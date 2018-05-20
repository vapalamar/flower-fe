import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { get, set } from 'lodash';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { filter, finalize, find, mergeMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { ApiService } from '../api';
import { defaultImage, imageSize } from '../app.constants';
import { BaseComponent } from '../helpers/base.component';
import { AppState } from '../reducers';
import { FileHelperService } from '../shared/file-helper/file-helper.service';
import { RedirectService } from '../shared/redirect/redirect.service';
import * as validators from '../shared/validators/validators';

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
  ) {
    super();
  }

  ngOnInit() {
    this.generateForm();

    const aboutSub = (this.subs = this.form.get('company.about').valueChanges.subscribe(() => {
      this.scrape.about = false;
      aboutSub.unsubscribe();
    }));
    const logoSub = (this.subs = this.form.get('company.logo').valueChanges.subscribe(() => {
      this.scrape.logo = false;
      logoSub.unsubscribe();
    }));
    const coverSub = (this.subs = this.form.get('company.cover').valueChanges.subscribe(() => {
      this.scrape.cover = false;
      coverSub.unsubscribe();
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
      }),
      company: this.formBuilder.group({
        name: [
          '',
          [Validators.required, validators.startsWithLetterOrDigit, Validators.maxLength(this.maxLengths.company.name)],
        ],
        website: ['', [validators.website]],
        companyEmail: ['', [validators.emailOrEmpty]],
        Addresses: this.formBuilder.array([
          this.formBuilder.group({
            gPlace: ['', [Validators.required]],
            additional: ['', [Validators.maxLength(100)]],
          }),
        ]),
        phoneNumber: ['', [Validators.required, validators.phoneNumber]],
        BusinessTypes: this.formBuilder.array([
          this.formBuilder.group({
            id: ['', [Validators.required]],
          }),
        ]),
        Industries: [[], [Validators.required]],
        Services: ['', [Validators.required, Validators.maxLength(this.maxLengths.company.services)]],
        about: ['', [Validators.required, validators.notOnlySpaces]],
        logo: '',
        cover: '',
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

  createProfile() {
    const companyData = this.compileData();
    const gtmPayload = {
      email: this.form.get(['user', 'email']).value,
      firstName: this.form.get(['user', 'firstName']).value,
      lastName: this.form.get(['user', 'lastName']).value,
      company: this.form.get(['company', 'name']).value,
      companyType: this.form.get(['company', 'type']).value,
    };

    this.formDisabled = true;
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
