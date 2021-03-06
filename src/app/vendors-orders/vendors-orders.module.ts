import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorsOrdersComponent } from './vendors-orders.component';
import { VendorsOrdersRoutingModule } from './vendors-orders-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    VendorsOrdersRoutingModule,
    SharedModule
  ],
  declarations: [VendorsOrdersComponent]
})
export class VendorsOrdersModule { }
