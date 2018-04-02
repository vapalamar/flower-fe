import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: 'app/login/login.module#LoginModule',
      },
      // {
      //   path: 'reset-password',
      //   loadChildren: 'app/reset-password/reset-password.module#ResetPasswordModule',
      // },
      // {
      //   path: 'set-password',
      //   loadChildren: 'app/set-password/set-password.module#SetPasswordModule',
      // },
      {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
