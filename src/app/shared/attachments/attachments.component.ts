import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as bowser from 'bowser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { withLatestFrom } from 'rxjs/operators';

import { ApiService } from '../../api';
import { AppState, getAuthUser } from '../../reducers';

function previewFile(name: string) {
  const format = name.slice(name.lastIndexOf('.') + 1) || '';

  const viewMod = {
    imgTag: ['img', 'png', 'jpg', 'jpeg', 'giff'],
    iframeWithGoogle: ['doc', 'docx'],
    iframe: ['pdf'],
  };

  for (const type in viewMod) {
    if (viewMod[type].find(item => item === format.toLowerCase())) {
      return type;
    }
  }
}

@Component({
  selector: 'fl-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
})
export class AttachmentsComponent {
  @ViewChild('previewModal') previewModal: TemplateRef<any>;
  @Input('onlyManageFile') onlyManageFile = false;
  @Input('attachments') attachments: Array<any>;
  @Input('rfpId') rfpId: number = null;
  @Output('remove') remove: EventEmitter<any> = new EventEmitter();
  @Input('canView') canView = true;
  @Input('canDownload') canDownload = true;
  @Input('canDelete') canDelete = false;
  @Input('canTrackActivities') canTrackActivities = true;

  modalRef: BsModalRef;
  downloading = false;

  viewIEMessage = bowser.msie;

  constructor(
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private api: ApiService,
    private store: Store<AppState>,
  ) {}

  viewFile(attachment) {
    this.modalRef = this.modalService.show(this.previewModal, { class: 'modal-lg' });
    setTimeout(() => {
      (document.querySelector('modal-container') as HTMLElement).focus();
    });
    const { name, url, isUploaded } = attachment.File;
    const viewMod = previewFile(name);
    this.modalRef.content = {
      ...attachment,
      url: this.sanitizeUrl(viewMod, url),
      isUploaded,
      viewMod,
    };
  }

  downloadFile(attachment, fromModal?: boolean) {
    this.downloading = fromModal;
    // this.api.file
    //   .download(attachment.File.id, attachment.title || attachment.File.name)
    //   .pipe(withLatestFrom(this.store.select(getAuthUser)))
    //   .subscribe(([, user]) => {
    //     const isVendor = [EmployeeRole.VendorAdmin, EmployeeRole.Vendor].includes(user.Employee.role);
    //     if (this.canTrackActivities && isVendor) {
    //       this.api.trackActivities.downloadFiles(this.rfpId, attachment.RfpDocuments.propertyName).subscribe();
    //     }
    //     if (fromModal) {
    //       this.downloading = false;
    //       this.modalRef.hide();
    //     }
    //   });
  }

  private sanitizeUrl(mod: string, url: string) {
    let formatUrl = url;
    if (mod === 'iframeWithGoogle') {
      formatUrl = `//docs.google.com/gview?url=${url}&embedded=true`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(formatUrl);
  }
}
