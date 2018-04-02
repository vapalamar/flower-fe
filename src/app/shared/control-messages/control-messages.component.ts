import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import * as moment from 'moment-timezone';
import { debounceTime, throttleTime } from 'rxjs/operators';

const debounce = 250;

function getConfig(validatorValue) {
  return {
    required: 'Please fill in this field',
    url: 'Please enter a valid URL',
    email: 'Please enter a valid email',
    minlength: `Minimum length ${validatorValue.requiredLength}`,
    maxlength: `Maximum length ${validatorValue.requiredLength}`,
    min: `Minimum value must be greater or equal ${validatorValue.min}`,
    max: `Maximum value must be less or equal ${validatorValue.max}`,
    phoneNumber: 'Please enter correct phone number',
    place: 'Please choose location from dropdown',
    time: 'Please enter a valid time',
    minTime: `Min time is ${moment(validatorValue, 'hh:mm:ss A').format('hh:mm:ss A')}`,
    website: 'Please enter valid link',
    uniqEmail: 'Email is already taken',
    uniqName: 'Company name already taken',
    uniqDomain: 'Company domain is already taken',
    startsWithLetterOrDigit: 'Must start with a letter or digit',
    domain: 'Please use valid domain format',
    fileType: `You’re trying to upload the file with unsupported filename extension`,
  };
}

@Component({
  selector: 'fl-control-messages',
  templateUrl: './control-messages.component.html',
  styleUrls: ['./control-messages.component.scss'],
})
export class ControlMessagesComponent implements OnInit {
  @Input() control: AbstractControl;
  @Input() messages = {};
  errorMessage = '';

  private controlName = '';

  @HostListener('window:click', ['$event'])
  clickGlobal({ target }) {
    const isButtonSubmit = target instanceof HTMLButtonElement && target.type === 'submit';
    const form = target.closest('form');
    const controlElement = form && this.controlName && form.querySelector(`[formControlName="${this.controlName}"]`);
    if (isButtonSubmit && controlElement && this.control) {
      this.control.markAsTouched();
      this.errorMessage = this.getErrorMessage();
    }
  }

  ngOnInit() {
    this.controlName = Object.keys(this.control.parent.controls).reduce(
      (controlName, name) => (this.control === this.control.parent.get(name) ? name : controlName),
      '',
    );
    this.control.valueChanges
      .pipe(throttleTime(debounce), debounceTime(debounce))
      .subscribe(() => (this.errorMessage = this.getErrorMessage()));
    this.control.statusChanges
      .pipe(throttleTime(debounce), debounceTime(debounce))
      .subscribe(() => (this.errorMessage = this.getErrorMessage()));
    this.errorMessage = this.getErrorMessage();
  }

  private getValidatorErrorMessage(propertyName: string) {
    const validatorValue = this.control.errors[propertyName];
    return this.messages[propertyName] || getConfig(validatorValue)[propertyName];
  }

  private getErrorMessage() {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.errors[propertyName]) {
        if (typeof this.control.errors[propertyName] === 'string') {
          return this.control.errors[propertyName];
        }
        return this.getValidatorErrorMessage(propertyName);
      }
    }
    return '';
  }
}
