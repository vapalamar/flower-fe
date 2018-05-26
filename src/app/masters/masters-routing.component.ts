import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MastersComponent } from './masters.component';

const routes: Routes = [{
  path: '', component: MastersComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
