import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceFormComponent } from './service-form.component';
import { ServiceFormRoutingModule } from './service-form-routing.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ServiceFormRoutingModule
  ],
  declarations: [ServiceFormComponent]
})
export class ServiceFormModule { }
