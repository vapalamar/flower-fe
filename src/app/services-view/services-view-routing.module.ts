import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicesViewComponent } from './services-view.component';

const routes: Routes = [{
  path: '', component: ServicesViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesViewRoutingModule { }
