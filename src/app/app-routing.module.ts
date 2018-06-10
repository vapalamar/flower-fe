import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { AuthenticatedGuard } from './shared/authenticated/authenticated.guard';
import { NonAuthenticatedGuard } from './shared/non-authenticated/non-authenticated.guard';
import { VendorRoleGuard } from './shared/vendor/vendor.guard';
import { ClientRoleGuard } from './shared/client/client.guard';

const routes: Routes = [
  {
    path: 'all-services',
    component: AppLayoutComponent,
    children: [
      {
        path: ':id',
        loadChildren: 'app/service-details/service-details.module#ServiceDetailsModule'
      },
      {
        path: '',
        loadChildren: 'app/services-view/services-view.module#ServicesViewModule'
      }
    ]
  },
  {
    path: 'companies',
    component: AppLayoutComponent,
    children: [
      {
        path: ':id',
        loadChildren: 'app/vendor-details/vendor-details.module#VendorDetailsModule'
      }
    ]
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivateChild: [AuthenticatedGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [VendorRoleGuard],
        loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
      },
      {
        path: 'masters',
        canActivate: [VendorRoleGuard],
        loadChildren: 'app/masters/masters.module#MastersModule'
      },
      {
        path: 'services',
        canActivate: [VendorRoleGuard],
        children: [
          {
            path: 'create',
            loadChildren: 'app/service-form/service-form.module#ServiceFormModule'
          },
          {
            path: ':id/edit',
            loadChildren: 'app/service-form/service-form.module#ServiceFormModule'
          },
          {
            path: '',
            loadChildren: 'app/services/services.module#ServicesModule',
          }
        ]
      },
      {
        path: 'my-reviews',
        canActivate: [ClientRoleGuard],
        loadChildren: 'app/client-reviews/client-reviews.module#ClientReviewsModule'
      },
      {
        path: 'my-orders',
        canActivate: [ClientRoleGuard],
        loadChildren: 'app/client-orders/client-orders.module#ClientOrdersModule'
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard'
      }
    ]
  },
  {
    path: 'signup',
    canActivateChild: [NonAuthenticatedGuard],
    loadChildren: 'app/signup/signup.module#SignUpModule',
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
    canActivateChild: [NonAuthenticatedGuard],
    loadChildren: 'app/login/login.module#LoginModule',
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
