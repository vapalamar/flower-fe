import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceFormComponent } from './service-form.component';
import { ServiceFormRoutingModule } from './service-form-routing.component';

@NgModule({
  imports: [
    CommonModule,
    ServiceFormRoutingModule
  ],
  declarations: [ServiceFormComponent]
})
export class ServiceFormModule { }
