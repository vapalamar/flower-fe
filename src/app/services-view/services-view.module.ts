import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesViewComponent } from './services-view.component';
import { ServicesViewRoutingModule } from './services-view-routing.module';
import { SharedModule } from '../shared/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
    CommonModule,
    ServicesViewRoutingModule,
    SharedModule,
    BsDropdownModule,
  ],
  declarations: [ServicesViewComponent]
})
export class ServicesViewModule { }
