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
import { PasswordComponent } from './password/password.component';
import { RedirectService } from './redirect/redirect.service';
import { FileHelperService } from './file-helper/file-helper.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HeaderComponent } from './header/header.component';
import { AuthenticatedGuard } from './authenticated/authenticated.guard';
import { NonAuthenticatedGuard } from './non-authenticated/non-authenticated.guard';
import { EditorComponent } from './editor/editor.component';
import { AddEmployeeFormComponent } from './add-employee-form/add-employee-form.component';
import { AddEmployeeModalComponent } from './add-employee-modal/add-employee-modal.component';
import { ImageSelectComponent } from './image-select/image-select.component';
import { CropImageComponent } from './image-select/crop-image/crop-image.component';
import { VendorRoleGuard } from './vendor/vendor.guard';
import { SeeMoreComponent } from './see-more/see-more.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { PriceControlComponent } from './price-control/price-control.component';
import { SelectComponent } from './select/select.component';
import { AddCompanyReviewModalComponent } from './add-company-review-modal/add-company-review-modal.component';
import { AddCompanyReviewFormComponent } from './add-company-review-form/add-company-review-form.component';
import { MapComponent } from './map/map.component';
import { GPlaceAutocompleteComponent } from './g-place-autocomplete/g-place-autocomplete.component';
import { OrderServiceModalComponent } from './order-service-modal/order-service-modal.component';
import { OrderServiceFormComponent } from './order-service-form/order-service-form.component';
import { CalendarModule } from './calendar/calendar.module';

const modules = [];
const components = [
  ControlMessagesComponent,
  SpinnerComponent,
  PasswordComponent,
  SidenavComponent,
  HeaderComponent,
  EditorComponent,
  AddEmployeeFormComponent,
  AddEmployeeModalComponent,
  ImageSelectComponent,
  CropImageComponent,
  SeeMoreComponent,
  AttachmentsComponent,
  PriceControlComponent,
  SelectComponent,
  AddCompanyReviewModalComponent,
  AddCompanyReviewFormComponent,
  MapComponent,
  GPlaceAutocompleteComponent,
  OrderServiceModalComponent,
  OrderServiceFormComponent
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
    CalendarModule
  ],
  declarations: [...components],
  exports: [...modules, ...components],
  entryComponents: [
    AddEmployeeModalComponent,
    CropImageComponent,
    AddCompanyReviewModalComponent,
    OrderServiceModalComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        // TokenService,
        // TokenHelperService,
        // HttpFormDataService,
        AuthenticatedGuard,
        NonAuthenticatedGuard,
        VendorRoleGuard,
        RedirectService,
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
        FileHelperService,
      ],
    };
  }
}
