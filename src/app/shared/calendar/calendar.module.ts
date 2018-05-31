import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule as PrimeNGCalendarModule } from 'primeng/components/calendar/calendar';

import { CalendarComponent } from './calendar.component';

@NgModule({
  imports: [CommonModule, FormsModule, PrimeNGCalendarModule],
  declarations: [CalendarComponent],
  exports: [CalendarComponent],
})
export class CalendarModule {}
