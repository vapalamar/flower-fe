import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersComponent } from './masters.component';
import { SharedModule } from '../shared/shared.module';
import { MastersRoutingModule } from './masters-routing.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MastersRoutingModule
  ],
  declarations: [MastersComponent]
})
export class MastersModule { }
