import { AfterContentInit, AfterViewInit, ElementRef, HostBinding, Injector, Input, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';

import { BaseComponent } from '../../helpers/base.component';

const INVALID = 'INVALID';

const controlSelector = 'input.form-control, textarea.form-control';

export class ControlComponent extends BaseComponent implements AfterViewInit, AfterContentInit, ControlValueAccessor {
  @HostBinding('class.fl-control') controlClass = true;
  @HostBinding('class.ng-focused') focusClass = false;
  @HostBinding('class.ng-empty') emptyClass = false;

  @ViewChild('input') input: ElementRef;
  @Input('autofocus') autofocus: boolean;

  touched = false;
  invalid = false;
  disabled = false;

  public control: AbstractControl;

  private element: ElementRef;
  private controlElement: HTMLElement;

  constructor(private injector: Injector) {
    super();
    this.element = this.injector.get(ElementRef);
  }

  propagateChange: (obj: any) => void = _ => {};
  propagateTouch: () => void = () => {};

  touch() {
    this.touched = true;
    this.propagateTouch();
  }

  ngAfterViewInit() {
    if (this.input && this.autofocus) {
      setTimeout(() => this.input.nativeElement.focus());
    }
  }

  ngAfterContentInit() {
    try {
      this.control = this.injector.get(NgControl).control;
    } catch (e) {}
    if (!this.control) {
      return;
    }
    this.invalid = this.control.invalid;
    this.toggleEmptyClass();
    this.subs = this.control.statusChanges.subscribe(status => (this.invalid = status === INVALID));
    this.subs = this.control.valueChanges.subscribe(this.toggleEmptyClass.bind(this));

    this.listenFocus();
  }

  toggleEmptyClass() {
    this.emptyClass = Array.isArray(this.control.value) ? !this.control.value.length : !this.control.value;
  }

  listenFocus() {
    this.controlElement = this.element.nativeElement.querySelector(controlSelector);
    if (!this.controlElement) {
      return;
    }
    this.controlElement.addEventListener('focus', () => (this.focusClass = true));
    this.controlElement.addEventListener('blur', () => (this.focusClass = false));
  }

  writeValue(obj: any): void {}

  registerOnChange(fn: (obj: any) => void) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
