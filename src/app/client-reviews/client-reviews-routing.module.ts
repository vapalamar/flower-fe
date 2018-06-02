import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientReviewsComponent } from './client-reviews.component';

const routes: Routes = [
  {
    path: '',
    component: ClientReviewsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientReviewsRoutingModule {}
