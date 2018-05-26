import {
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  Injector,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';
import * as bowser from 'bowser';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { ControlComponent } from '../control/control.component';

interface Option {
  name?: string;
  id?: number;
  selected?: boolean;

  [key: string]: any;
}

const privateProps = ['selected'];
const debounceQuery = 100;

@Component({
  selector: 'fl-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent extends ControlComponent implements OnInit {
  @ViewChild('dropdown') dropdown: BsDropdownDirective;

  @ContentChild(TemplateRef) customOptionTemplate: TemplateRef<any>;
  @ViewChild('defaultOptionTemplate') defaultOptionTemplate: TemplateRef<any>;
  @ViewChild('multipleOptionTemplate') multipleOptionTemplate: TemplateRef<any>;
  @ViewChild('input') input: ElementRef;
  @ViewChild('virtualScroll') virtualScroll: VirtualScrollComponent;

  @Input('options') options: Array<Option> = [];
  @Input('disabledControl') disabled = false;
  @Input('multiple') multiple = false;
  @Input('showSearch') showSearch = false;
  @Input('accessCustomItem') accessCustomItem = false;
  @Input('accessCustomTemplate') accessCustomTemplate = false;
  @Input('placeholder') placeholder = '';
  @Input('maxLength') maxLength = Infinity;
  @Input('maxLengthItem') maxLengthItem = Infinity;
  @Input('accessVirtualScroll') accessVirtualScroll = false;
  @Input('disabledStyle') disabledStyle: boolean;
  @Input('requireChoose') requireChoose = false;
  @Input('dropup') dropup = false;
  @Input('chooseWithName') chooseWithName = false;
  @Input('id') id= '';

  showVirtualScroll: boolean;

  search = '';
  search$: Subject<string> = new Subject();

  showItemComponent: TemplateRef<any>;
  modelArray: Array<Option> = [];
  viewPortItems: Array<Option> = [];
  model: number | Option = null;
  selectedValues: string;
  sortParams = 'name';
  findValue = '';

  private selectElement: ElementRef;
  private preventChangeFindValue: boolean;

  constructor(injector: Injector) {
    super(injector);
    this.selectElement = injector.get(ElementRef);
  }

  isComplexModel(model: number | Option): model is Option {
    return this.chooseWithName;
  }

  ngOnInit() {
    if (this.accessCustomTemplate && this.customOptionTemplate) {
      this.showItemComponent = this.customOptionTemplate;
    } else {
      this.showItemComponent = this.multiple ? this.multipleOptionTemplate : this.defaultOptionTemplate;
    }

    this.modelArray = this.multiple ? [] : null;

    const label = this.selectElement.nativeElement.parentElement.querySelector('label');
    if (label) {
      label.addEventListener('click', () => {
        setTimeout(() => this.dropdown.show());
      });
    }
    this.subs = this.search$
      .asObservable()
      .pipe(debounceTime(debounceQuery), distinctUntilChanged())
      .subscribe(value => {
        if (!this.preventChangeFindValue) {
          this.findValue = value;
        }
        this.preventChangeFindValue = false;
        this.updateVirtualScroll();
      });

    this.showVirtualScroll = this.accessVirtualScroll && this.options.length > 70;
  }

  addCustomField() {
    const item = (this.search || '').trim();
    const notEmptySearch = item && item.length && this.search.replace(/\s/g, '').length;
    if (this.accessCustomItem && notEmptySearch) {
      const foundOption: Option = this.options.find(option => option.name.toLowerCase() === item.toLowerCase());
      this.select(foundOption || { name: item });
    }
  }

  setId(name, id?, ...spread) {
    return `${name}-${id}-${spread}`;
  }

  writeValue(value) {
    let ids = [];
    if (Array.isArray(value)) {
      this.modelArray = value.map(item => ({ ...item, selected: true }));
      ids = value.filter(i => Boolean(i.id)).map(i => i.id);
    } else {
      this.model = value;
      if (this.chooseWithName) {
        if (value && value.id) {
          ids = [value.id];
        } else {
          ids = [];
        }
      } else {
        ids = [value];
      }
    }
    this.options = this.options.map(item => ({ ...item, selected: ids.includes(item.id) }));
    this.setSelectedValues();
  }

  onShown() {
    this.focusClass = true;
    this.focusInput();
    this.updateVirtualScroll();
  }

  onHidden() {
    if (this.findValue) {
      this.findValue = '';
    }
    this.focusClass = false;
    this.touch();
    this.clearSearch();
    this.preventChangeFindValue = false;
  }

  stopHideInput(ev: MouseEvent) {
    if (this.focusClass) {
      ev.stopPropagation();
    }
  }

  focusInput() {
    if (this.showSearch) {
      setTimeout(() => {
        if (this.input) {
          this.input.nativeElement.focus();
        }
      }, 200);
    }
  }

  clearSearch() {
    if (this.showSearch) {
      this.search = '';
      this.updateVirtualScroll();
    }
  }

  handleClick(option: Option, $event: MouseEvent) {
    if (this.chooseWithName) {
      this.model = {};
    }
    if (this.multiple) {
      $event.stopImmediatePropagation();
    }
    if (
      (this.multiple && this.modelArray.find(item => item.id === option.id)) ||
      (!this.multiple && (this.isComplexModel(this.model) ? this.model.id : this.model) === option.id)
    ) {
      if (!this.requireChoose) {
        return this.unselect(option);
      }
    } else if (!this.multiple) {
      this.unselectAll();
    }
    this.select(option);
  }

  select(option: Option) {
    if ((Array.isArray(this.modelArray) && this.maxLength === this.modelArray.length) || option.disabled) {
      return;
    }

    option.selected = true;
    if (this.multiple) {
      if (!this.modelArray.some(o => (option.id && o.id === option.id) || o.name === option.name)) {
        this.modelArray.push(option);
      }
    } else {
      this.model = this.chooseWithName ? { ...option } : option.id;
    }
    this.valueChanged();
  }

  unselect(option: Option) {
    const optionSource = this.options.find(item => (option.id && item.id === option.id) || item.name === option.name);
    if (optionSource) {
      optionSource.selected = false;
    }

    if (this.multiple) {
      const i = this.modelArray.findIndex(item => (option.id && item.id === option.id) || item.name === option.name);
      if (i >= 0) {
        this.modelArray.splice(i, 1);
      }
    } else {
      this.model = null;
    }
    this.valueChanged();
  }

  private updateVirtualScroll() {
    if (this.virtualScroll) {
      this.virtualScroll.refresh();
    }
  }

  private unselectAll() {
    this.options.forEach(o => (o.selected = false));
    if (this.multiple) {
      this.modelArray = [];
    } else {
      this.model = null;
    }
    this.clearSearch();
  }

  private setSelectedValues() {
    this.selectedValues =
      (this.multiple && this.modelArray.length) ||
      (this.chooseWithName ? Object.keys(this.model || {}).length : this.model)
        ? this.options
            .filter(o => o.selected)
            .map(o => o.name)
            .join(', ')
        : '';
  }

  private valueChanged() {
    this.setSelectedValues();
    this.emptyClass = !this.selectedValues;
    let value = this.getPlainModel();
    if (Array.isArray(value) && !this.chooseWithName) {
      value = value.map(item => (item.id ? { id: item.id, name: item.name } : { name: item.name }));
    }
    this.propagateChange(value);
    this.preventChangeFindValue = bowser.msie && this.multiple;
    this.clearSearch();
    this.focusInput();
  }

  private getPlainModel(): Array<Option> | number | {} {
    if (!this.multiple) {
      return this.model;
    }
    return this.modelArray.map(option => {
      const data = { ...option };
      privateProps.forEach(p => delete data[p]);
      return data;
    });
  }
}
