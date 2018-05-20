import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { HttpModule } from '@angular/http';

import { ApiService } from './api.service';

// import { HttpHandleErrorsInterceptor } from './interceptors/http-handle-errors.interceptor';

@NgModule({
  imports: [HttpClientModule, HttpModule],
})
export class ApiModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ApiModule,
      providers: [
        ApiService,
      ],
    };
  }
}
