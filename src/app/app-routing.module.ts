import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { AuthenticatedGuard } from './shared/authenticated/authenticated.guard';
import { NonAuthenticatedGuard } from './shared/non-authenticated/non-authenticated.guard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthenticatedGuard],
    component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
      },
      {
        path: 'masters',
        loadChildren: 'app/masters/masters.module#MastersModule'
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
