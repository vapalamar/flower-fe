import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorDetailsComponent } from './vendor-details.component';

const routes: Routes = [
  {
    path: '',
    component: VendorDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorDetailsRoutingModule {}
