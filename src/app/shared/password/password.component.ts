import { AfterContentInit, Component, ElementRef, Injector, Input, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as zxcvbn from 'zxcvbn';

import { ControlComponent } from '../control/control.component';

const passwordStrengthTypes = {
  '1': {
    text: 'Weak',
    class: 'danger',
  },
  '2': {
    text: 'Good',
    class: 'warning',
  },
  '3': {
    text: 'Strong',
    class: 'info',
  },
  '4': {
    text: 'Very strong',
    class: 'success',
  },
};

@Component({
  selector: 'fl-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PasswordComponent,
      multi: true,
    },
  ],
})
export class PasswordComponent extends ControlComponent implements AfterContentInit {
  @Input('email') email: AbstractControl;
  @Input('placeholder') placeholder = '';
  @ViewChild('input') input: ElementRef;

  isTypePassword = true;
  model;
  passwordStrength: any;

  constructor(injector: Injector, private renderer: Renderer2) {
    super(injector);
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();
    if (this.email) {
      this.subs = this.email.valueChanges.subscribe(() => this.evaluateStrength());
    }
    this.subs = this.control.valueChanges.subscribe(() => this.evaluateStrength());
  }

  writeValue(value: string) {
    this.model = value;
    this.renderer.setProperty(this.input.nativeElement, 'value', value);
    this.evaluateStrength();
  }

  toggleType() {
    this.isTypePassword = !this.isTypePassword;
    const type = this.isTypePassword ? 'password' : 'text';
    this.renderer.setAttribute(this.input.nativeElement, 'type', type);
  }

  change($event) {
    this.model = $event.target.value;
    this.propagateChange(this.model);
    this.evaluateStrength();
  }

  private evaluateStrength() {
    if (!this.model) {
      this.passwordStrength = {};
      return;
    }

    if (this.email && this.email.valid && this.model === this.email.value) {
      this.passwordStrength = {
        score: 1,
        feedback: {
          warning: `Using email as password it's not safety`,
        },
      };
    } else {
      this.passwordStrength = zxcvbn(this.model);
    }

    this.passwordStrength.type = passwordStrengthTypes[this.passwordStrength.score || 1];
  }
}
