import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorReviewsComponent } from './vendor-reviews.component';
import { VendorReviewsRoutingModule } from './vendor-reviews-routing.module';

@NgModule({
  imports: [
    CommonModule,
    VendorReviewsRoutingModule
  ],
  declarations: [VendorReviewsComponent]
})
export class VendorReviewsModule { }
