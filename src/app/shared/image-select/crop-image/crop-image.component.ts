import { Component, ViewChild } from '@angular/core';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'fl-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.scss'],
})
export class CropImageComponent {
  @ViewChild('cropper') cropper: ImageCropperComponent;

  command: Subject<{method: string, args?: any}>;
  cropperSettings: CropperSettings;
  croppData: { image: string } = { image: '' };

  constructor() {
    this.command = new Subject<any>();
  }

  close() {
    this.command.next({ method: 'close' });
  }

  save() {
    this.command.next({ method: 'save' });
  }
}
