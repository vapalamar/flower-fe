import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { first, tap, map } from 'rxjs/operators';

import { AppState, isAuthenticated } from '../../reducers';
import { RedirectService } from '../redirect/redirect.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthenticatedGuard implements CanLoad, CanActivate, CanActivateChild {
  constructor(private afAuth: AngularFireAuth, private redirect: RedirectService) {}

  canLoad(): Observable<boolean> {
    return this.checkAuthenticated();
  }

  canActivate(): Observable<boolean> {
    return this.checkAuthenticated();
  }

  canActivateChild(): Observable<boolean> {
    return this.checkAuthenticated();
  }

  private checkAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      first(),
      map(Boolean),
      tap(authenticated => {
        if (!authenticated) {
          this.redirect.toLogin();
        }
      })
    )
  }
}
