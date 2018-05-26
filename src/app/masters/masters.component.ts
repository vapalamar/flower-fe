import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { filter, mergeMap, map, delay, withLatestFrom } from 'rxjs/operators';
import { BaseComponent } from '../helpers/base.component';
import { defaultImage } from '../app.constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { values } from 'lodash-es';
import { AddEmployeeModalComponent } from '../shared/add-employee-modal/add-employee-modal.component';

@Component({
  selector: 'fl-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.scss']
})
export class MastersComponent extends BaseComponent implements OnInit {
  employees: any[];
  company: any;
  isLoading = false;
  bsModalRef: BsModalRef;

  constructor(
    private afDb: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private modal: BsModalService,
  ) {
    super();
  }

  ngOnInit() {
    this.isLoading = true;
    this.subs = this.modal.onHidden.pipe(
        delay(500),
        filter(ev => ev === 'success'),
        withLatestFrom(this.afAuth.authState),
        mergeMap(([, u]) => this.afDb.database.ref(`users/${u.uid}/employees`).once('value'))
      )
      .subscribe(s => this.employees = this.mapEmployees(values(s.val())));

    this.subs = this.afAuth.authState.pipe(
      filter(Boolean),
      mergeMap(u => this.afDb.database.ref(`users/${u.uid}`).once('value')),
      map(s => s && s.val()),
    ).subscribe(v => {
      this.company = v.company;
      this.isLoading = false;
      this.employees = this.mapEmployees(values(v.employees));
    });
  }

  openAddEmployeeModal(employeeIdx?: number) {
    this.bsModalRef = this.modal.show(AddEmployeeModalComponent, {
      class: 'modal-lg',
      backdrop: 'static',
    });
    if (employeeIdx) {
      this.bsModalRef.content.title = 'Edit user';
      // this.api.employee.get(employeeId, this.company.id).subscribe(user => {
      //   this.bsModalRef.content.patchDataForm(user);
      // });
    } else {
      this.bsModalRef.content.title = 'Add user';
    }

    // if (this.currentEmployee.id === employeeId) {
    //   this.bsModalRef.content.role = this.currentEmployee.role;
    // } else {
    //   this.bsModalRef.content.isVendor = this.currentEmployee.role === EmployeeRole.VendorAdmin;
    //   this.bsModalRef.content.isClient = this.currentEmployee.role === EmployeeRole.ClientAdmin || this.isSuperAdmin;
    // }
    // this.bsModalRef.content.companyId = this.company.id;
    // this.bsModalRef.content.employeeId = employeeId;
  }

  private mapEmployees(employees) {
    return (employees || []).map(e => ({...e, photoURL: e.photoURL || defaultImage.employee.logo }));
  }
}
