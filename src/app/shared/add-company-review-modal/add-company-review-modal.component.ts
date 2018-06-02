import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AddCompanyReviewFormComponent } from '../add-company-review-form/add-company-review-form.component';
import { FormGroup } from '@angular/forms';
import { first, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as uuid from 'uuid';

@Component({
  selector: 'fl-add-company-review-modal',
  templateUrl: './add-company-review-modal.component.html',
  styleUrls: ['./add-company-review-modal.component.scss']
})
export class AddCompanyReviewModalComponent {
  @Input() adminId; string;
  @ViewChild('review') review: AddCompanyReviewFormComponent;
  formDisabled = false;
  
  constructor(
    private modal: BsModalService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
  ) { }

  submitReview() {
    if (this.formDisabled) {
      return;
    }
    if (this.review.form.invalid) {
      markAsTouchedControls(this.review.form);
      return;
    }
    const value = this.review.form.getRawValue();

    const pass = uuid();
    this.afAuth.authState.pipe(
      first(),
      mergeMap(u => u && u.uid 
        ? of([u, false]) 
        : Promise.all([
            this.afAuth.auth.createUserWithEmailAndPassword(this.review.form.value.email, pass),
            Promise.resolve(true)
          ])
      ),
      mergeMap(([u, isNew]) => isNew 
        ? this.afAuth.authState.pipe(first()).toPromise().then(
          (u) =>this.afDB.database.ref(`users/${u.uid}`).set({email: value.email, firstName: value.firstName, lastName: value.lastName, role: 'client'})
        )
        : of(u)
      ),
      mergeMap(() => this.afDB.database.ref(`users/${this.adminId}/reviews`).push().set(value)),
      mergeMap(() => this.afAuth.authState.pipe(first())),
      mergeMap((u) => this.afDB.database.ref(`users/${u.uid}/my-reviews`).push().set({review: value.text, vendorId: this.adminId}))
    ).subscribe(() => {
      this.toastr.success('Your review is submitted!');
      this.bsModalRef.hide();
    });
  }

}

function markAsTouchedControls(form: FormGroup) {
  Object.keys(form.controls).forEach(k => form.get(k).markAsTouched());
}
