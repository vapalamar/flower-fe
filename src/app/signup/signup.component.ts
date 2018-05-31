import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { get, set } from 'lodash-es';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { filter, finalize, find, mergeMap, tap, first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebase } from '@firebase/app';

import { ApiService } from '../api';
import { defaultImage, imageSize } from '../app.constants';
import { BaseComponent } from '../helpers/base.component';
import { AppState } from '../reducers';
import { FileHelperService } from '../shared/file-helper/file-helper.service';
import { RedirectService } from '../shared/redirect/redirect.service';
import * as validators from '../shared/validators/validators';
import { AngularFireDatabase } from 'angularfire2/database';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { switchMap } from 'rxjs/operator/switchMap';

const stepsValidityConf = [
  ['user.firstName', 'user.lastName', 'user.email', 'user.password'],
  ['company.name', 'company.Addresses.0.gPlace', 'company.phoneNumber'],
  ['company.BusinessTypes.0.id', 'company.Industries', 'company.Services'],
  ['company.about'],
];

@Component({
  selector: 'avi-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignUpComponent extends BaseComponent implements OnInit {
  @ViewChild('joinToCompanyModal') joinToCompanyModal: ModalDirective;
  @ViewChild('successModal') successModal: ModalDirective;

  maxLengths = {
    user: {
      firstName: 50,
      lastName: 50,
    },
    company: {
      name: 100,
      Addresses: {
        additional: 100,
      },
      services: 60,
      about: 1000,
    },
  };

  defaultImage = defaultImage;
  imageSize = imageSize;
  form: FormGroup;
  modalRef: BsModalRef;
  scrape = {
    about: true,
    logo: true,
    cover: true,
  };
  scrappingInProgress: boolean;
  formDisabled = false;
  joinFormDisabled = false;

  private validationsRequests = new BehaviorSubject<number>(0);
  private scrapeRequest: Subscription;
  private nextStepSub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private redirect: RedirectService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private store: Store<AppState>,
    private fileHelper: FileHelperService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase
  ) {
    super();
  }

  ngOnInit() {
    this.generateForm();

    const aboutSub = (this.subs = this.form.get('company.description').valueChanges.subscribe(() => {
      this.scrape.about = false;
      aboutSub.unsubscribe();
    }));
  }

  mapFileToImage(f): Observable<any> {
    return f instanceof Blob ? this.fileHelper.read(f) : of(f);
  }

  generateForm() {
    this.form = this.formBuilder.group({
      user: this.formBuilder.group({
        firstName: [
          '',
          [
            Validators.required,
            validators.startsWithLetterOrDigit,
            Validators.maxLength(this.maxLengths.user.firstName),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            validators.startsWithLetterOrDigit,
            Validators.maxLength(this.maxLengths.user.lastName),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        role: ['client', [Validators.required]]
      }),
      company: this.formBuilder.group({
        name: [
          '',
          [validators.startsWithLetterOrDigit, Validators.maxLength(this.maxLengths.company.name)],
        ],
        description: [''],
      }),
    });
  }

  checkEmail() {
    const emailControl = this.form.get('user.email');
    if (emailControl.invalid || !emailControl.value) {
      return;
    }
    this.validationsRequests.next(this.validationsRequests.getValue() + 1);
    this.subs = this.api.user.checkEmail(emailControl.value).subscribe(user => {
      if (user) {
        emailControl.setErrors({ uniqEmail: true });
      }
      this.validationsRequests.next(this.validationsRequests.getValue() - 1);
    });
  }

  async createProfile() {
    const user = this.form.get('user').value;
    const company = this.form.get('company').value;
    this.formDisabled = true;

    const createUser$ = fromPromise(this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password));
    const userData = id => this.afDB.database.ref(`/users/${id}`).set({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      ...(user.role === 'vendor'
        ? { 
          company: {
            name: company.name,
            description: company.description
          }
        } 
        : {}
      )
    });
    const userData$ = () => this.afAuth.authState.pipe(
      filter(u => u && !!u.uid),
      mergeMap(token => fromPromise(userData(token.uid)))
    );
    createUser$.pipe(mergeMap(userData$), first()).subscribe({
      next: () => this.showSuccessModal(),
      complete: () => this.formDisabled = false
    });
  }

  compileData() {
    const companyData = {
      ...this.form.value,
      company: {
        ...this.form.value.company,
        Addresses: this.form.value.company.Addresses.map(a => ({
          ...a.gPlace,
          additional: a.additional,
        })),
      },
    };

    if (companyData.company.logo && typeof companyData.company.logo === 'object' && 'id' in companyData.company.logo) {
      companyData.company.ImageId = companyData.company.logo.id;
      delete companyData.company.logo;
    }
    if (
      companyData.company.cover &&
      typeof companyData.company.cover === 'object' &&
      'id' in companyData.company.cover
    ) {
      companyData.company.CoverImageId = companyData.company.cover.id;
      delete companyData.company.cover;
    }

    return companyData;
  }

  private showSuccessModal() {
    this.successModal.show();
    this.subs = this.successModal.onHidden.subscribe(() => this.redirect.toLogin());
  }
}
