import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { first, finalize, filter, switchMap, map, mergeMap } from 'rxjs/operators';
import * as uuid from 'uuid';

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
import { HttpClient } from '@angular/common/http';

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
    private api: ApiService,
    private modal: BsModalService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private store: Store<AppState>,
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private afStorage: AngularFireStorage,
    private http: HttpClient
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
      photo: photoURL ? { url: photoURL }: ''
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
    this.formDisabled = true;
    const putFile: Promise<any> = employeeData.photo ? this.afStorage.ref(`files/${uuid()}`).put(employeeData.photo) : Promise.resolve(null) as any;
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
    this.formDisabled = true;
    const putFile: Promise<any> = employeeData.photo && employeeData.photo.url !== employeeData.photoURL 
      ? this.afStorage.ref(`files/${uuid()}`).put(employeeData.photo) 
      : Promise.resolve(null) as any;
    combineLatest(putFile, this.afAuth.authState.pipe(filter(Boolean), first()))
      .pipe(
        mergeMap(([file, u]) => {
          if (!employeeData.photo) {
            employeeData.photoURL = '';
          } else {
            employeeData.photoURL = (file && file.downloadURL) || employeeData.photoURL;
          }
          const employees = this.afDB.database.ref(`users/${u.uid}/employees/${this.employeeId}`);
          return employees.set(employeeData);
        }),
        finalize(() => (this.formDisabled = false))
      ).subscribe(() => {
        this.toastr.success('Employee successfully updated');
        this.modal.setDismissReason('success');
        this.bsModalRef.hide();
      });
  }
}

function markAsTouchedControls(form: FormGroup) {
  Object.keys(form.controls).forEach(k => form.get(k).markAsTouched());
}
