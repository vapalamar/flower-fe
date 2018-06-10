import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { first, map, filter, mergeMap } from 'rxjs/operators';

import { AppState, getAuthUser } from '../../reducers';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { empty } from 'rxjs/observable/empty';

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
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    @Inject(PLATFORM_ID) private platfromId: Object,
  ) {}

  toMainPage(reload = false) {
    this.afAuth.authState.pipe(
      first(),
      mergeMap(u => u && u.uid ? this.afDB.database.ref(`users/${u.uid}`).once('value') : empty()),
      map(s => s && s.val())
    ).subscribe(u => {
      if (!u || u.role === 'client') {
        this.router.navigate(['all-services']);
      } else {
        this.router.navigate(['dashboard', 'orders']);
      }
    });
  }

  toLogin() {
    this.router.navigate(['login']);
  }
}
