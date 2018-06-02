import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorsOrdersComponent } from './vendors-orders.component';

const routes: Routes = [
  {
    path: '',
    component: VendorsOrdersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorsOrdersRoutingModule {}
