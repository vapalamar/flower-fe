import { AbstractControl, Validators } from '@angular/forms';
import * as moment from 'moment-timezone';
import { Subscription } from 'rxjs/Subscription';

import { maxFileSize } from './../../app.constants';

export function phoneNumber(control: AbstractControl): { [key: string]: any } {
  const phoneNumberRe = /\(\d{3}\)\s\d{3}-\d{4}/;
  return control.value && !phoneNumberRe.test(control.value) ? { phoneNumber: true } : null;
}

export function duns(control: AbstractControl): { [key: string]: any } {
  const dunsRe = /^\d{2}-\d{3}-\d{4}$/;
  return control.value && !dunsRe.test(control.value) ? { DUNS: true } : null;
}

export function federalTaxID(control: AbstractControl): { [key: string]: any } {
  const dunsRe = /^\d{4}-\d{2}-\d{5}$/;
  return control.value && !dunsRe.test(control.value) ? { federalTaxID: true } : null;
}

export function website(control: AbstractControl): { [key: string]: any } {
  const websiteRe = /^(https?:\/\/)?[^:\/]+\.\w+(\/|$)/;
  return control.value && !websiteRe.test(control.value) ? { website: true } : null;
}

export function domain(control: AbstractControl) {
  const domainRe = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  return control.value && !domainRe.test(control.value) ? { domain: true } : null;
}

export function startsWithLetterOrDigit(control: AbstractControl): { [key: string]: any } {
  const companyNameRe = /^(\w|\d)/;
  return control.value && !companyNameRe.test(control.value) ? { startsWithLetterOrDigit: true } : null;
}

export function requiredIfValue(parentControl: AbstractControl): (control: AbstractControl) => { [key: string]: any } {
  let sub: Subscription;
  return (control: AbstractControl): { [key: string]: any } => {
    if (!sub) {
      sub = parentControl.valueChanges.subscribe(() => {
        control.updateValueAndValidity();
      });
    }
    return parentControl.value && control && !control.value ? { required: true } : null;
  };
}

export function time(
  timeRe = /^([0-9]|0[0-9]|1[012]):[0-5][0-9]$/,
): (control: AbstractControl) => { [key: string]: any } {
  return (control: AbstractControl): { [key: string]: any } => {
    return control.value && !timeRe.test(control.value) ? { time: true } : null;
  };
}

export function minDateTime(
  currentDateControl: AbstractControl,
  minDateControl: AbstractControl,
  minTimeControl: AbstractControl,
) {
  const subs: Subscription[] = [];
  return control => {
    if (!subs.length) {
      subs[subs.length] = currentDateControl.valueChanges.subscribe(() => {
        control.updateValueAndValidity();
        control.markAsTouched();
      });
      subs[subs.length] = minDateControl.valueChanges.subscribe(() => {
        control.updateValueAndValidity();
      });
      subs[subs.length] = minTimeControl.valueChanges.subscribe(() => {
        control.updateValueAndValidity();
      });
    }

    const timeFormat = 'hh:mm:ss A';
    const minTimeDate = moment(minTimeControl.value, timeFormat);
    const currentTime = moment(control.value, timeFormat);

    const minTime =
      minDateControl.valid && minTimeControl.valid && minTimeDate.isValid()
        ? moment(minDateControl.value)
            .startOf('day')
            .add({
              hours: minTimeDate.hour(),
              minutes: minTimeDate.minute(),
              seconds: minTimeDate.seconds(),
            })
        : null;

    const currentDate =
      currentDateControl.valid && currentTime.isValid()
        ? moment(currentDateControl.value)
            .startOf('day')
            .add({
              hours: currentTime.hour(),
              minutes: currentTime.minute(),
              seconds: currentTime.seconds(),
            })
        : null;

    const isAfter = moment(currentDate).isAfter(minTime);
    const isSame = moment(currentDate).isSame(minTime);

    if (!control.value || !(minTime && currentDate) || isAfter || isSame) {
      return null;
    }

    return { minTime };
  };
}

export function min(minControl: AbstractControl): (control: AbstractControl) => { [key: string]: any } {
  let sub: Subscription;
  return (control: AbstractControl): { [key: string]: any } => {
    if (!sub) {
      sub = minControl.valueChanges.subscribe(() => control.updateValueAndValidity());
    }
    return control.value && control.value < minControl.value ? { min: minControl.value } : null;
  };
}

export function maxLengthIgnoreHTML(maxLength: number = Infinity) {
  return function(control: AbstractControl) {
    if (!control.value) {
      return null;
    }

    const htmlTagRe = /<[^>]+>/gm;
    const textWithoutHtml = (control.value as string).replace(htmlTagRe, '');

    return textWithoutHtml.length <= maxLength
      ? null
      : {
          maxLength: { valid: false },
        };
  };
}

export function minLengthArray(minLength: number) {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value || control.value.length >= minLength) {
      return null;
    }
    return { minLengthArray: true };
  };
}

export function emailOrEmpty(control: AbstractControl) {
  return control.value === '' || control.value === null ? null : Validators.email(control);
}

export function fileType(mimeTypes: string[], extensions: string[] = []) {
  return (control: AbstractControl): { [key: string]: any } => {
    const file: File = control.value;
    if (!file) {
      return null;
    }
    if (file.type) {
      return !mimeTypes.includes(file.type) ? { fileType: true } : null;
    } else if (extensions.length) {
      const ext = file.name.split('.').pop();
      return !extensions.includes(ext) ? { fileType: true } : null;
    }
  };
}

export function fileMaxSize(maxSize: number = maxFileSize) {
  return (control: AbstractControl): { [key: string]: any } => {
    const file: File = control.value;
    if (!control.value || !file.size || file.size <= maxFileSize) {
      return null;
    }
    return { fileMaxSize: { max: maxFileSize } };
  };
}

export function notOnlySpaces(control: AbstractControl): { [key: string]: any } {
  if (!control.value || (control.value || '').trim().length) {
    return null;
  }
  return { notOnlySpaces: true };
}
