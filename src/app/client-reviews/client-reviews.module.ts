import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientReviewsComponent } from './client-reviews.component';
import { ClientReviewsRoutingModule } from './client-reviews-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ClientReviewsRoutingModule,
    SharedModule
  ],
  declarations: [ClientReviewsComponent]
})
export class ClientReviewsModule { }
