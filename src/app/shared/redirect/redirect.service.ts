import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { first, map } from 'rxjs/operators';

import { AppState, getAuthUser } from '../../reducers';

@Injectable()
export class RedirectService {
  mainPageUrl$: Observable<string> = this.store.select(getAuthUser).pipe(
    map(u => {
      if (!u) {
        return null;
      }
      return '';
    }),
  );

  constructor(
    private router: Router,
    private store: Store<AppState>,
    @Inject(PLATFORM_ID) private platfromId: Object,
  ) {}

  toMainPage(reload = false) {
    // this.mainPageUrl$.pipe(first()).subscribe(url => {
    //   if (!url) {
    //     return this.toLogin();
    //   }
    //   this.router.navigate([url]);
    //   if (reload && isPlatformBrowser(this.platfromId)) {
    //     window.location.reload();
    //   }
    // });
    this.router.navigate(['dashboard']);
  }

  toLogin() {
    this.router.navigate(['/login']);
  }
}
