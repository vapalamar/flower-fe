import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { ApiService } from '../../api';
import { BaseComponent } from '../../helpers/base.component';
import * as validators from '../validators/validators';
import { defaultImage, imageSize } from '../../app.constants';

@Component({
  selector: 'fl-add-employee-form',
  templateUrl: './add-employee-form.component.html',
  styleUrls: ['./add-employee-form.component.scss'],
})
export class AddEmployeeFormComponent extends BaseComponent implements OnInit {
  @Output() onOpenNestedModal = new EventEmitter<boolean>();

  @Input() role = '';
  @Input() isClient = false;
  @Input() isVendor = false;
  @Input() employeeId: number;

  imageSize = imageSize;
  defaulImage = defaultImage;
  validationsRequests = new BehaviorSubject<number>(0);

  maxLengths = {
    firstName: 50,
    lastName: 50,
    jobTitle: 100,
    department: 100,
  };

  form: FormGroup;

  private validationEmail: Subscription;

  constructor(private fb: FormBuilder, private api: ApiService) {
    super();
  }

  ngOnInit() {
    this.generateForm();
  }

  generateForm() {
    this.form = this.fb.group({
      firstName: [
        '',
        [Validators.required, validators.startsWithLetterOrDigit, Validators.maxLength(this.maxLengths.firstName)],
      ],
      lastName: [
        '',
        [Validators.required, validators.startsWithLetterOrDigit, Validators.maxLength(this.maxLengths.lastName)],
      ],
      phoneNumber: ['', [validators.phoneNumber]],
      jobTitle: ['', [Validators.maxLength(this.maxLengths.jobTitle)]],
      department: ['', [Validators.maxLength(this.maxLengths.department)]],
      photo: '',
      photoURL: '',
    });
  }
}
