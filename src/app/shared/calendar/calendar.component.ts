import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment-timezone';

enum UpcommingDates {
  Today = 'today',
  Next3Days = '3_days',
  Next5Days = '5_days',
  Next1Week = '1_week',
  TillNextWeek = 'till_next_week',
  TillNextMonth = 'till_next_month',
}

type CalendarValue = Array<Date> | Date;

@Component({
  selector: 'fl-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CalendarComponent),
    },
  ],
})
export class CalendarComponent implements ControlValueAccessor {
  @Input() inputId: string;
  @Input() selectionMode = 'single';
  @Input() inline: boolean;
  @Input() upcomingDates: boolean;
  @Input() placeholder: string;
  @Input() readonlyInput: boolean;
  @Input() minDate: Date;
  @Input() maxDate: Date;

  model: any;
  upcommingDates: typeof UpcommingDates = UpcommingDates;
  propagateChange = (value: CalendarValue): void => {};

  modelChange(model: CalendarValue) {
    let value = Array.isArray(model) ? model.filter(item => item) : model;
    if (Array.isArray(value) && value.length === 2 && `${value[0]}` === `${value[1]}`) {
      value = value.slice(0, 1);
    }
    this.propagateChange(value);
  }

  setCalendarSetting(type: UpcommingDates) {
    const dateFormat = 'MM-DD-YYYY';
    const today = moment().format('MM-DD-YYYY');
    const todayClass = moment(today, dateFormat);
    const nextDayClass = moment(today, dateFormat);

    let secondDate = null;
    switch (type) {
      case UpcommingDates.Next3Days:
        secondDate = nextDayClass.add(2, 'day');
        break;
      case UpcommingDates.Next5Days:
        secondDate = nextDayClass.add(4, 'day');
        break;
      case UpcommingDates.Next1Week:
        secondDate = nextDayClass.add(6, 'day');
        break;
      case UpcommingDates.TillNextWeek:
        secondDate = nextDayClass.endOf('week');
        break;
      case UpcommingDates.TillNextMonth:
        secondDate = nextDayClass.endOf('month');
        break;
      default:
        secondDate = null;
        break;
    }

    const resultDate: Array<Date> = secondDate ? [todayClass.toDate(), secondDate.toDate()] : [todayClass.toDate()];
    this.propagateChange(resultDate);
  }

  writeValue(value) {
    this.model = value;
  }

  registerOnChange(fn: any) {
    this.propagateChange = (value: CalendarValue) => {
      this.model = value;
      fn(value);
    };
  }
  registerOnTouched() {}
}
