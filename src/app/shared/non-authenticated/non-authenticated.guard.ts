import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { first, map } from 'rxjs/operators';

import { AppState, isAuthenticated } from '../../reducers';
import { RedirectService } from '../redirect/redirect.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class NonAuthenticatedGuard implements CanLoad, CanActivate, CanActivateChild {
  constructor(private afAuth: AngularFireAuth, private redirect: RedirectService) {}

  canLoad(): Observable<boolean> {
    return this.checkNonAuthenticated();
  }

  canActivate(): Observable<boolean> {
    return this.checkNonAuthenticated();
  }

  canActivateChild(): Observable<boolean> {
    return this.checkNonAuthenticated();
  }

  private checkNonAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      first(),
      map(authenticated => {
        if (authenticated) {
          this.redirect.toMainPage();
        }
        return !authenticated;
      }),
    );
  }
}
