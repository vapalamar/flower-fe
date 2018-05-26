import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { first, tap, map, mergeMap } from 'rxjs/operators';

import { AppState, isAuthenticated } from '../../reducers';
import { RedirectService } from '../redirect/redirect.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class VendorRoleGuard implements CanLoad, CanActivate, CanActivateChild {
  constructor(
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private redirect: RedirectService
  ) {}

  canLoad(): Observable<boolean> {
    return this.checkVendorRole();
  }

  canActivate(): Observable<boolean> {
    return this.checkVendorRole();
  }

  canActivateChild(): Observable<boolean> {
    return this.checkVendorRole();
  }

  private checkVendorRole(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      first(),
      mergeMap(u => this.afDB.database.ref(`users/${u.uid}`).once('value')),
      map(s => s.val().role === 'vendor'),
      tap(isVendor => {
        if (!isVendor) {
          this.redirect.toMainPage();
        }
      })
    )
  }
}
