import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebase } from '@firebase/app';

import * as authActions from '../actions/auth';
import { ApiService } from '../api';
import { RedirectService } from '../shared/redirect/redirect.service';
import { User } from '../models';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { _throw } from 'rxjs/observable/throw';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private api: ApiService,
    private redirect: RedirectService,
    private injector: Injector,
    private afAuth: AngularFireAuth
  ) {}

  @Effect()
  login$ = this.actions$.ofType(authActions.LOGIN).pipe(
    map(({credentials}: authActions.Login) => credentials),
    mergeMap((credentials: any) => {
      return fromPromise(
        this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password)
      ).pipe(catchError(e => of(e)));
    }),
    map(data => data.error || data.message 
      ? { type: authActions.LOGIN_FAILED, error: data.error || { message: data.message } } 
      : ({type: authActions.LOGIN_SUCCESS, user: data})),
  );

  @Effect()
  unauthorized$: Observable<Action> = this.actions$
    .ofType(authActions.REFRESH_TOKEN_FAILED, authActions.UNAUTHORIZED, authActions.LOGOUT)
    .pipe(
      mergeMap(() => {
        this.redirect.toLogin();
        return empty();
      }),
    );
}
