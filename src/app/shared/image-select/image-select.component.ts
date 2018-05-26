import {
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';

import { ControlComponent } from '../control/control.component';
import { CropImageComponent } from './crop-image/crop-image.component';

const canvasSize = {
  width: 798,
  height: 500,
};

@Component({
  selector: 'fl-image-select',
  templateUrl: './image-select.component.html',
  styleUrls: ['./image-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageSelectComponent),
      multi: true,
    },
  ],
})
export class ImageSelectComponent extends ControlComponent implements OnInit, OnChanges {
  @ViewChild('buttonUpload') buttonUploadRef: TemplateRef<any>;
  @ViewChild('iconUpload') iconUploadRef: TemplateRef<any>;

  @Input() placeholder: string;
  @Input() size: { width: number; height: number };
  @Input() buttonUpload = false;
  @Input() iconUpload = false;
  @Input() customTemplateUpload: TemplateRef<any>;
  @Input() displayButtonInPreview = false;
  @Input() classForUploadArea = false;
  @Input() classForPreview = false;
  @Input() disableCropper = false;

  showTemplate: TemplateRef<any>;

  @Output() onOpenNestedModal = new EventEmitter<boolean>();

  cropModalRef: BsModalRef;

  file: Blob;
  fileName: string;
  cropperSettingsConfig: CropperSettings;

  selectedImage: string;

  get cropper(): ImageCropperComponent {
    return this.cropModalRef.content.cropper;
  }

  get croppData(): { image: string } {
    return this.cropModalRef.content.croppData;
  }

  get cropperSettings() {
    return this.cropperSettingsConfig;
  }

  set cropperSettings(config) {
    this.cropperSettingsConfig = config;
    if (this.cropModalRef) {
      this.cropModalRef.content.cropperSettingsConfig = config;
    }
  }

  constructor(injector: Injector, private modalService: BsModalService) {
    super(injector);
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.cropperDrawSettings = {
      strokeWidth: 1,
      strokeColor: '#337ab7',
      dragIconStrokeWidth: 1,
      dragIconStrokeColor: '#337ab7',
      dragIconFillColor: '#fff',
    };
    this.cropperSettings.noFileInput = true;
    this.subs = this.modalService.onHide.subscribe(() => this.onOpenNestedModal.emit(false));
    this.subs = this.modalService.onShow.subscribe(() => this.onOpenNestedModal.emit(true));
  }

  ngOnInit() {
    this.showAppropriateTemplate();
  }

  ngOnChanges({ size }: SimpleChanges) {
    if (size) {
      if (typeof this.size === 'number') {
        this.size = { width: this.size, height: this.size };
      }
      if (typeof this.size === 'object') {
        this.cropperSettings.width = this.size.width;
        this.cropperSettings.height = this.size.height;
        this.cropperSettings.minWidth = this.size.width;
        this.cropperSettings.minHeight = this.size.height;
        this.cropperSettings.croppedWidth = this.size.width;
        this.cropperSettings.croppedHeight = this.size.height;
        this.cropperSettings.cropperClass = 'cropper-position';
      }
    }
  }

  showAppropriateTemplate() {
    if (!this.customTemplateUpload && !this.iconUpload) {
      this.showTemplate = this.buttonUploadRef;
    }
    if (!this.customTemplateUpload && !this.buttonUpload) {
      this.showTemplate = this.iconUploadRef;
    }
    if (this.customTemplateUpload && !this.iconUpload && !this.buttonUpload) {
      this.showTemplate = this.customTemplateUpload;
    }
  }

  writeValue(value: { url: string; name: string }) {
    if (!value) {
      this.selectedImage = '';
      return;
    }
    if (typeof value === 'object' && 'url' in value) {
      this.selectedImage = value.url;
      this.fileName = value.name;
    }
    if (value instanceof Blob) {
      this.file = value;
      this.fileName = 'name' in value ? value.name : null;
      this.readFile(this.file).subscribe(base64 => (this.selectedImage = base64));
    }
  }

  canvasAddTransperretBackground(image: HTMLImageElement): Observable<any> {
    if (typeof this.size === 'object' && this.size.width !== this.size.height) {
      return new Observable(observer => {
        observer.next(image);
        observer.complete();
      });
    }

    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const cxt: CanvasRenderingContext2D = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.width;

    cxt.fillStyle = 'transparent';
    cxt.fillRect(0, 0, canvas.width, canvas.height);
    cxt.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);
    return this.createImage(canvas.toDataURL());
  }

  onFileChange = $event => {
    if (!$event.target.files || !$event.target.files.length) {
      return;
    }

    this.file = $event.target.files[0];
    this.fileName = $event.target.files[0].name;

    if (this.disableCropper) {
      this.readFile(this.file).subscribe(base64 => (this.selectedImage = base64));
      // this.selectedImage = this.croppData.image;
      this.propagateChange(this.file);
      // this.file = null;
    } else {
      this.readFile(this.file)
        .pipe(mergeMap(base64 => this.createImage(base64)))
        .pipe(mergeMap(image => this.canvasAddTransperretBackground(image)))
        .subscribe(image => {
          this.openModal();
          setTimeout(() => {
            this.setCanvasSize({ width: image.width, height: image.height });
            this.cropper.setImage(image);
            $event.target.value = '';
          });
        });
    }
  }

  openModal() {
    this.cropModalRef = this.modalService.show(CropImageComponent, { class: 'modal-xl' });
    this.cropModalRef.content.cropperSettings = this.cropperSettings;
    this.cropModalRef.content.croppData = this.croppData;
    this.subs = this.cropModalRef.content.command.subscribe(command => {
      if (command.method === 'close') {
        this.fileName = null;
        this.cropModalRef.hide();
      }
      if (command.method === 'save') {
        this.save();
        this.control.markAsTouched();
      }
    });
  }

  hideModal() {
    if (this.cropModalRef) {
      this.cropModalRef.hide();
    }
  }

  readFile(file: Blob): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.addEventListener('loadend', (loadEvent: any) => {
        observer.next(loadEvent.target.result);
        observer.complete();
      });
      reader.readAsDataURL(file);
    });
  }

  createImage(base64): Observable<any> {
    return new Observable(observer => {
      const image = new Image();
      image.addEventListener('load', () => {
        observer.next(image);
        observer.complete();
      });
      image.src = base64;
    });
  }

  setCanvasSize({ width, height }: { width: number; height: number }) {
    const baseRatio = canvasSize.width / canvasSize.height;
    if (width / height > baseRatio) {
      this.cropperSettings.canvasWidth = canvasSize.width;
      this.cropperSettings.canvasHeight = height * (canvasSize.width / width);
    } else {
      this.cropperSettings.canvasWidth = width * (canvasSize.height / height);
      this.cropperSettings.canvasHeight = canvasSize.height;
    }
    this.cropper.cropper.resizeCanvas(this.cropperSettings.canvasWidth, this.cropperSettings.canvasHeight);
  }

  save() {
    this.selectedImage = this.croppData.image;
    this.hideModal();
    const file = this.generateFile();
    file['name'] = this.file['name'];
    this.propagateChange(file);
    this.file = null;
  }

  generateFile(): Blob {
    const dataURI = this.selectedImage;
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }
    const type = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type });
  }

  delete() {
    this.selectedImage = '';
    this.propagateChange('');
    this.file = null;
    this.fileName = null;
    this.control.markAsTouched();
  }
}
