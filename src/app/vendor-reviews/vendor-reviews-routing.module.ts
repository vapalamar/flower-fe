import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorReviewsComponent } from './vendor-reviews.component';

const routes: Routes = [
  {
    path: '',
    component: VendorReviewsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorReviewsRoutingModule {}
