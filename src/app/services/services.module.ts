import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ng2-clipboard';
import { ServicesComponent } from './services.component';
import { ServicesRoutingModule } from './services-routing,module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ServicesRoutingModule,
    SharedModule,
    ClipboardModule
  ],
  declarations: [ServicesComponent]
})
export class ServicesModule { }
