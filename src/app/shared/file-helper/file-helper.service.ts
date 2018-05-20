import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileHelperService {
  constructor() {}

  read(file: File | Blob): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.addEventListener('loadend', (loadEvent: any) => {
        observer.next(loadEvent.target.result);
        observer.complete();
      });
      reader.readAsDataURL(file);
    });
  }
}
