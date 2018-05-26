import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, ElementRef, Injector, Input, Renderer2, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'fl-price-control',
  templateUrl: './price-control.component.html',
  styleUrls: ['./price-control.component.scss'],
  providers: [
    CurrencyPipe,
    DecimalPipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PriceControlComponent,
      multi: true,
    },
  ],
})
export class PriceControlComponent extends ControlComponent {
  @ViewChild('input') input: ElementRef;

  @Input('id') id = '';
  @Input('placeholder') placeholder = '';
  @Input('pipe') pipe = 'currency';

  model: number;
  viewValue = '';

  constructor(injector: Injector, private renderer: Renderer2, private currency: CurrencyPipe, private decimal: DecimalPipe) {
    super(injector);
  }

  formatValue() {
    let value = this.viewValue;
    let pipe;
    let pipeArgs = [];
    switch (this.pipe) {
      case 'currency':
        pipe = this.currency;
        pipeArgs = ['USD', 'symbol', '1.0-0'];
        break;
      case 'decimal':
        pipe = this.decimal;
        pipeArgs = ['1.0-0'];
        break;
      default:
        throw new Error('Unknown pipe');
    }
    if (this.model || this.model === 0) {
      value = pipe.transform(this.model, ...pipeArgs);
    } else {
      value = '';
    }
    if (this.input.nativeElement.value !== value) {
      this.renderer.setProperty(this.input.nativeElement, 'value', value);
      this.viewValue = value;
    }
  }

  writeValue(value) {
    this.model = value;
    this.formatValue();
  }

  change() {
    const input = this.input.nativeElement;
    const viewValue = input.value;
    const parsedValue = this.parseValue(viewValue);
    const lastModel = this.model;
    let carretPos = input.selectionStart;

    this.viewValue = viewValue;
    this.model = parsedValue && !isNaN(+parsedValue) && parsedValue !== '' ? +parsedValue : null;
    setTimeout(() => {
      if (document.activeElement !== input || input.selectionStart !== input.selectionEnd) {
        return;
      }
      const lengthDiff = this.viewValue.length - viewValue.length;
      if (lengthDiff !== 0) {
        carretPos += lengthDiff;
      }
      input.selectionStart = input.selectionEnd = carretPos;
    });

    this.formatValue();
    if (this.model !== lastModel) {
      this.propagateChange(this.model);
    }
  }

  onBlur() {
    const input = this.input.nativeElement;
    const value = this.parseValue(input.value);
    if (value !== `${parseFloat(value)}`) {
      if (isNaN(+value) || value === '') {
        this.viewValue = '';
      } else {
        this.model = parseFloat(value);
      }
      this.formatValue();
      this.propagateChange(this.model);
    }
    this.touch();
  }

  private parseValue(str: string) {
    return str.replace(/\D/g, '');
  }
}
