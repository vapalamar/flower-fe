import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from 'angularfire2';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { reducers } from './reducers';
import { SharedModule } from './shared/shared.module';
import { ApiModule } from './api/api.module';
import { effects } from './effects';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    AppRoutingModule,
    SharedModule.forRoot(),
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot({ dropSpecialCharacters: false }),
    TooltipModule.forRoot(),
    ApiModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
