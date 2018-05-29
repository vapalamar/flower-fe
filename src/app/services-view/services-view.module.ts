import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesViewComponent } from './services-view.component';
import { ServicesViewRoutingModule } from './services-view-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ServicesViewRoutingModule,
    SharedModule
  ],
  declarations: [ServicesViewComponent]
})
export class ServicesViewModule { }
