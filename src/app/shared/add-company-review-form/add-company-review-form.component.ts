import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { first, mergeMap, startWith } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models';
import { of } from 'rxjs/observable/of';
import { BaseComponent } from '../../helpers/base.component';

@Component({
  selector: 'fl-add-company-review-form',
  templateUrl: './add-company-review-form.component.html',
  styleUrls: ['./add-company-review-form.component.scss']
})
export class AddCompanyReviewFormComponent extends BaseComponent implements OnInit {
  user: User;
  userExists = false;
  form: FormGroup;

  constructor(
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.subs = this.afAuth.authState.pipe(
      startWith(null),
      mergeMap(u => u && u.uid ? this.afDb.database.ref(`users/${u.uid}`).once('value') : of(null))
    ).subscribe(u => {
      this.user = (u && u.val()) || {};
      this.userExists = !!u;
      this.generateForm();
    });
  }

  private generateForm() {
    this.form = this.fb.group({
      text: ['', [Validators.maxLength(500)]],
      firstName: [this.user.firstName || '', [Validators.required, Validators.maxLength(50)]],
      lastName: [this.user.lastName || '', [Validators.required, Validators.maxLength(50)]],
      email: [this.user.email || '', [Validators.required, Validators.maxLength(50)]],
    });

    if (this.userExists) {
      this.form.get('firstName').disable();
      this.form.get('lastName').disable();
      this.form.get('email').disable();
    }
  }
}
