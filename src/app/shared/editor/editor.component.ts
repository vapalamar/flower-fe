import { Component, Injector, forwardRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Editor } from 'primeng/components/editor/editor';

import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'fl-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EditorComponent),
      multi: true,
    },
  ],
})
export class EditorComponent extends ControlComponent implements OnDestroy {
  @ViewChild('editor') editor: Editor;

  @Input('placeholder') placeholder = '';
  @Input('maxLength') maxLength = Infinity;
  @Input('formats') formats = ['header', 'bold', 'italic', 'underline', 'link', 'list'];
  @Input('validators') validators = [];
  @Input('id') id = '';

  private quill;

  constructor(injector: Injector) {
    super(injector);
  }

  textLength = 0;

  onEditorInit() {
    this.editor.quill.clipboard.options.matchVisual = false;
    this.quill = this.editor.getQuill();
    if (!this.textLength && this.control.value) {
      setTimeout(() => this.writeValue(this.control.value));
    }
    this.observeMaxLength();
  }

  observeMaxLength() {
    this.quill.once('text-change', () => {
      if (this.control && this.control.untouched) {
        this.control.markAsTouched();
      }
    });
  }

  writeValue(value) {
    if (this.quill) {
      if (value) {
        this.quill.pasteHTML(value);
      } else {
        this.quill.setText('');
      }
      this.textLength = value ? this.quill.getLength() - 1 : 0;
    }
  }

  valueChanged({ textValue, htmlValue }) {
    this.textLength = textValue.replace(/\n$/, '').length;

    htmlValue = (htmlValue || '').replace(/<a([\w="-\s]+)href="((?!https?:|\/\/)[^"]+?)"/gi, (_, add, link) => {
      return `<a${add}href="//${link}"`;
    });
    this.propagateChange(htmlValue);
  }

  validate() {
    let errors = null;
    const allErrors = this.control && this.control.invalid ? this.control && this.control.errors : null;
    if (this.quill && this.quill.getText().length > this.maxLength + 1) {
      errors = { max: this.maxLength };
    }
    if (errors && this.control) {
      this.control.setErrors({ ...(allErrors || {}), max: errors });
    }
    return errors ? { ...(allErrors || {}), max: errors } : allErrors;
  }

  ngOnDestroy() {
    this.control.clearValidators();
    if (this.validators && this.validators.length) {
      this.control.setValidators(this.validators);
    }
  }
}
