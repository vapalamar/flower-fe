import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorReviewsComponent } from './vendor-reviews.component';
import { VendorReviewsRoutingModule } from './vendor-reviews-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    VendorReviewsRoutingModule,
    SharedModule
  ],
  declarations: [VendorReviewsComponent]
})
export class VendorReviewsModule { }
