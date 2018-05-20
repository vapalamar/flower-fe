import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxMaskModule } from 'ngx-mask';

import { SharedModule } from '../shared/shared.module';
import { SignUpRoutingModule } from './signup-routing.module';
import { SignUpComponent } from './signup.component';

@NgModule({
  imports: [
    CommonModule,
    SignUpRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxMaskModule,
    PopoverModule,
    ModalModule,
    ModalModule
  ],
  declarations: [SignUpComponent],
})
export class SignUpModule {}
