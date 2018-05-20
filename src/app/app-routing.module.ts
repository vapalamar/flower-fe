import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
          },
        ],
      },
      {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'signup',
        children: [
          {
            path: '',
            loadChildren: 'app/signup/signup.module#SignUpModule',
          },
        ],
      },
      {
        path: '',
        component: AuthLayoutComponent,
        children: [
          {
            path: 'login',
            loadChildren: 'app/login/login.module#LoginModule',
          },
          {
            path: '**',
            redirectTo: '/login',
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
