import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceDetailsComponent } from './service-details.component';
import { ServiceDetailsRoutingModule } from './service-details-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ServiceDetailsRoutingModule
  ],
  declarations: [ServiceDetailsComponent]
})
export class ServiceDetailsModule { }
