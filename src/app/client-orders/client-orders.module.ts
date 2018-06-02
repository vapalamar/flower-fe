import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientOrdersComponent } from './client-orders.component';
import { ClientOrdersRoutingModule } from './client-orders-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ClientOrdersRoutingModule
  ],
  declarations: [ClientOrdersComponent]
})
export class ClientOrdersModule { }
