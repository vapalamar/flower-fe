import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { ImageCropperModule } from 'ng2-img-cropper';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxMaskModule } from 'ngx-mask';
import { EditorModule } from 'primeng/components/editor/editor';

import { ControlMessagesComponent } from './control-messages/control-messages.component';
import { SpinnerComponent } from './spinner/spinner.component';

const modules = [];
const components = [
  ControlMessagesComponent,
  SpinnerComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ImageCropperModule,
    ModalModule,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule,
    VirtualScrollModule,
    TooltipModule,
    EditorModule,
    NgxMaskModule,
  ],
  declarations: [...components],
  exports: [...modules, ...components],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        // TokenService,
        // TokenHelperService,
        // HttpFormDataService,
        // AuthenticatedGuard,
        // NonAuthenticatedGuard,
        // RedirectService,
        // RoleVendorGuard,
        // RoleClientGuard,
        // ConfirmDeactivateGuard,
        // RoutesService,
        // DynamicHeaderService,
        // RoleSuperAdminGuard,
        // RoleClientAdminGuard,
        // RoleVendorAdminGuard,
        // RoleClientViewOnlyGuard,
        // RoleNotIndependentGuard,
        // OutdatedBrowserGuard,
        // ModernBrowserGuard,
        // ModernBrowserService,
        // FormHelperService,
        // FileHelperService,
      ],
    };
  }
}
