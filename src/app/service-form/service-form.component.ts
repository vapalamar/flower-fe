import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { filter, first, mergeMap, finalize, map, withLatestFrom, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../helpers/base.component';
import { entries } from 'lodash-es';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'fl-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  maxLengths = {
    title: 120,
    summary: 500
  };
  requiredValidator = [Validators.required];
  steps = [1, 2];
  currStep = 1;
  formDisabled = false;
  masters = [];
  editMode = false;
  serviceId: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private toastr: ToastrService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(this.maxLengths.title)]],
      summary: ['', this.requiredValidator],
      masters: [[]],
      price: ['', [Validators.min(0)]],
      includeMaps: [false],
      includeChat: [false],
      includeCalendar: [false],
      includeFeedback: [false]
    });

    const route = this.route.params
      .pipe(
        filter(({id}) => id),
        map(({id}) => id),
        tap(id => this.serviceId = id)
      );
    const user = this.afAuth.authState.pipe(filter(Boolean), first());

    this.formDisabled = true;
    this.afAuth.authState.pipe(
      filter(Boolean),
      first(),
      mergeMap((u) => this.afDB.database.ref(`/users/${u.uid}/employees`).once('value')),
      map(s => (s && s.val() || [])),
      finalize(() => this.formDisabled = false)
    ).subscribe(masters => {
      this.masters = entries(masters).map(([id, value]: [any, any]) => ({id, name: `${value.firstName} ${value.lastName}`}));

      combineLatest(route, user).pipe(
        mergeMap(([id, u]) => this.afDB.database.ref(`users/${u.uid}/services/${id}`).once('value')),
        map(s => s && s.val()),
        filter(Boolean))
      .subscribe(service => {
        this.form.patchValue(service);
        this.editMode = true;
      });
    });
  }

  createService() {
    if (this.form.invalid) {
      return;
    }

    this.formDisabled = true;
    if (!this.editMode) {
      this.afAuth.authState.pipe(
        filter(Boolean),
        first(),
        mergeMap(u => this.afDB.database.ref(`users/${u.uid}/services`).push().set(this.form.value)),
        finalize(() => this.formDisabled = false)
      ).subscribe(() => {
        this.toastr.success('Service successfully created!');
        this.router.navigate(['services']);
      });
    } else {
      this.afAuth.authState.pipe(
        filter(Boolean),
        first(),
        mergeMap(u => this.afDB.database.ref(`users/${u.uid}/services/${this.serviceId}`).set(this.form.value)),
        finalize(() => this.formDisabled = false)
      ).subscribe(() => {
        this.toastr.success('Service successfully edited!');
        this.router.navigate(['services']);
      });
    }
  }

  setStep(step: number) {
    this.currStep = 1;
  }

  cancel() {
    this.router.navigate(['services']);
  }
}
