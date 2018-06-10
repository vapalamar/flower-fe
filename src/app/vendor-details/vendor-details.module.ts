import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorDetailsComponent } from './vendor-details.component';
import { VendorDetailsRoutingModule } from './vendor-details-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ServicesViewModule } from '../services-view/services-view.module';

@NgModule({
  imports: [
    CommonModule,
    VendorDetailsRoutingModule,
    SharedModule,
    ServicesViewModule
  ],
  declarations: [VendorDetailsComponent]
})
export class VendorDetailsModule { }
