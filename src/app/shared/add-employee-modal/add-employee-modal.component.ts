import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { first, finalize, filter, switchMap, map, mergeMap } from 'rxjs/operators';

import { ApiService } from '../../api';
import { AddEmployeeFormComponent } from '../add-employee-form/add-employee-form.component';
import { AppState, getAuthUser } from '../../reducers';
import { SetUser } from '../../actions/auth';
import { defaultImage } from '../../app.constants';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { empty } from 'rxjs/observable/empty';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'fl-add-employee-modal',
  templateUrl: './add-employee-modal.component.html',
  styleUrls: ['./add-employee-modal.component.scss'],
})
export class AddEmployeeModalComponent {
  @Input() title = '';
  @Output() save$: EventEmitter<any> = new EventEmitter();
  @ViewChild('employee') employee: AddEmployeeFormComponent;

  companyId: number;
  employeeId: number;
  visibilityForm = true;

  formDisabled = false;

  constructor(
    public modalRef: BsModalRef,
    private api: ApiService,
    private modal: BsModalService,
    private bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private store: Store<AppState>,
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private afStorage: AngularFireStorage
  ) {}

  patchDataForm(userData: any) {
    const { firstName, lastName, role, jobTitle, phoneNumber, department, photoURL, photo } = userData;
    this.employee.form.patchValue({
      firstName,
      lastName,
      phoneNumber,
      jobTitle,
      department,
      photoURL,
      photo
    });
  }

  manageEmployee() {
    if (this.formDisabled) {
      return;
    }
    if (this.employee.form.invalid) {
      markAsTouchedControls(this.employee.form);
      return;
    }

    const formData = {
      ...this.employee.form.value,
      ImageId: this.employee.form.value.Image ? this.employee.form.value.ImageId : null,
    };
    if (this.employeeId) {
      this.editEmployee(formData);
    } else {
      this.addEmployee(formData);
    }
  }

  addEmployee(employeeData) {
    // this.formDisabled = true;
    // const addEmployee = this.api.employee
    //   .create(this.companyId, employeeData)
    //   .pipe(finalize(() => (this.formDisabled = false)));

    // this.employee.validationsRequests
    //   .pipe(filter(requests => requests === 0), first(), switchMap(() => addEmployee))
    //   .subscribe(() => {
        
    //   });
    const putFile: Promise<any> = employeeData.photo ? this.afStorage.ref('files').put(employeeData.photo) : Promise.resolve(null) as any;
    combineLatest(putFile, this.afAuth.authState.pipe(filter(Boolean), first()))
      .pipe(
        mergeMap(([file, u]) => {
          employeeData.photoURL = (file && file.downloadURL) || '';
          const employees = this.afDB.database.ref(`users/${u.uid}/employees`).push();
          return employees.set(employeeData);
        }),
        finalize(() => (this.formDisabled = false))
      ).subscribe(() => {
        this.toastr.success('Employee successfully created');
        this.modal.setDismissReason('success');
        this.bsModalRef.hide();
      });
  }
 
  editEmployee(employeeData) {
    
  }
}

function markAsTouchedControls(form: FormGroup) {
  Object.keys(form.controls).forEach(k => form.get(k).markAsTouched());
}
