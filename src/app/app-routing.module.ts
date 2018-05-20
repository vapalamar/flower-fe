import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';

const routes: Routes = [
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
