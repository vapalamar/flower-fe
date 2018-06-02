import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [{
  path: '', 
  component: DashboardComponent,
  children: [
    {
      path: '',
      redirectTo: 'orders',
    },
    {
      path: 'orders',
      loadChildren: 'app/vendors-orders/vendors-orders.module#VendorsOrdersModule'
    },
    {
      path: 'reviews',
      loadChildren: 'app/vendor-reviews/vendor-reviews.module#VendorReviewsModule'
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
