import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { OrderServiceFormComponent } from '../order-service-form/order-service-form.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormGroup } from '@angular/forms';
import * as uuid from 'uuid';
import { first, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { omit } from 'lodash-es';

@Component({
  selector: 'fl-order-service-modal',
  templateUrl: './order-service-modal.component.html',
  styleUrls: ['./order-service-modal.component.scss']
})
export class OrderServiceModalComponent {
  @Input() adminId: string;
  @Input() serviceId: string;
  @ViewChild('order') order: OrderServiceFormComponent;
  formDisabled = false;
  
  constructor(
    private modal: BsModalService,
    private bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
  ) { }

  ngOnInit() {
    console.log(this);
  }

  submitReview() {
    if (this.formDisabled) {
      return;
    }
    if (this.order.form.invalid) {
      markAsTouchedControls(this.order.form);
      return;
    }
    const value = JSON.parse(JSON.stringify(this.order.form.getRawValue()));

    const pass = uuid();
    this.afAuth.authState.pipe(
      first(),
      mergeMap(u => u && u.uid 
        ? of([u, false]) 
        : Promise.all([
            this.afAuth.auth.createUserWithEmailAndPassword(value.email, pass),
            Promise.resolve(true)
          ])
      ),
      mergeMap(([u, isNew]) => isNew 
        ? this.afAuth.authState.pipe(first()).toPromise().then(
          (u) =>this.afDB.database.ref(`users/${u.uid}`).set({email: value.email, firstName: value.firstName, lastName: value.lastName, role: 'client'})
        )
        : of(u)
      ),
      mergeMap(() => this.afDB.database.ref(`users/${this.adminId}/orders`).push().set({...value, serviceId: this.serviceId})),
      mergeMap(() => this.afAuth.authState.pipe(first())),
      mergeMap((u) => this.afDB.database.ref(`users/${u.uid}/my-orders`).push().set({...omit(value, 'firstName', 'lastName', 'email'), vendorId: this.adminId}))
    ).subscribe(() => {
      this.toastr.success('Your order is submitted!');
      this.bsModalRef.hide();
    });
  }

}

function markAsTouchedControls(form: FormGroup) {
  Object.keys(form.controls).forEach(k => form.get(k).markAsTouched());
}