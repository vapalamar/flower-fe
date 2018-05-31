import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models';
import { BaseComponent } from '../../helpers/base.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { startWith, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'fl-order-service-form',
  templateUrl: './order-service-form.component.html',
  styleUrls: ['./order-service-form.component.scss']
})
export class OrderServiceFormComponent extends BaseComponent implements OnInit {
  @Input() serviceId: string;
  @Input() adminId: string;

  todayDate = moment().toDate();
  user: any;
  userExists: boolean = false;
  service: any;
  address: any = '';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase
  ) {
    super();
  }

  ngOnInit() {
    const user = this.afAuth.authState.pipe(
      startWith(null),
      mergeMap(u => u && u.uid ? this.afDb.database.ref(`users/${u.uid}`).once('value') : of(null)));

    const service = this.afDb.database.ref(`users/${this.adminId}/services/${this.serviceId}`).once('value');

    this.subs = combineLatest(user, service).subscribe(([u, s]) => {
      this.user = (u && u.val()) || {};
      this.userExists = !!u;
      this.service = s.val();
      this.generateForm();

      this.subs = this.form.get('place').valueChanges.pipe(tap(console.log)).subscribe(a => this.address = (a && a.address) || '');
    });
  }

  private generateForm() {
    this.form = this.fb.group({
      text: ['', [Validators.maxLength(500)]],
      firstName: [this.user.firstName || '', [Validators.required, Validators.maxLength(50)]],
      lastName: [this.user.lastName || '', [Validators.required, Validators.maxLength(50)]],
      email: [this.user.email || '', [Validators.required, Validators.maxLength(50)]],
      master: [''],
      place: [''],
      time: ['']
    });

    if (this.userExists) {
      this.form.get('firstName').disable();
      this.form.get('lastName').disable();
      this.form.get('email').disable();
    }
  }
}
