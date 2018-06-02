import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientOrdersComponent } from './client-orders.component';

const routes: Routes = [
  {
    path: '',
    component: ClientOrdersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientOrdersRoutingModule {}
