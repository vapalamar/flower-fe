import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { filter, mergeMap, map, delay, withLatestFrom } from 'rxjs/operators';
import { BaseComponent } from '../helpers/base.component';
import { defaultImage } from '../app.constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { values, keys } from 'lodash-es';
import { AddEmployeeModalComponent } from '../shared/add-employee-modal/add-employee-modal.component';

@Component({
  selector: 'fl-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.scss']
})
export class MastersComponent extends BaseComponent implements OnInit {
  employees: any[];
  employeesMap: {};
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
      .subscribe(s => {
        const employeesMap = s.val();
        this.employeesMap = employeesMap;
        this.employees = this.mapEmployees(values(this.employeesMap));
      });

    this.subs = this.afAuth.authState.pipe(
      filter(Boolean),
      mergeMap(u => this.afDb.database.ref(`users/${u.uid}`).once('value')),
      map(s => s && s.val()),
    ).subscribe(v => {
      this.company = v.company;
      this.isLoading = false;
      this.employeesMap = v.employees;
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
      const employeeKey = keys(this.employeesMap)[employeeIdx];
      this.bsModalRef.content.employeeId = employeeKey;
      this.bsModalRef.content.patchDataForm(this.employees[employeeIdx]);
    } else {
      this.bsModalRef.content.title = 'Add user';
    }
  }

  private mapEmployees(employees) {
    return (employees || []).map(e => ({...e, photoURL: e.photoURL || defaultImage.employee.logo }));
  }
}
