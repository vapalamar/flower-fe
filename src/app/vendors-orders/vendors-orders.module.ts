import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorsOrdersComponent } from './vendors-orders.component';
import { VendorsOrdersRoutingModule } from './vendors-orders-routing.module';

@NgModule({
  imports: [
    CommonModule,
    VendorsOrdersRoutingModule
  ],
  declarations: [VendorsOrdersComponent]
})
export class VendorsOrdersModule { }
