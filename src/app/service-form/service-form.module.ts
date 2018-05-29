import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceFormComponent } from './service-form.component';
import { ServiceFormRoutingModule } from './service-form-routing.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ServiceFormRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ServiceFormComponent]
})
export class ServiceFormModule { }
