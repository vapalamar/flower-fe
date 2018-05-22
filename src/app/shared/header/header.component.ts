import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, map, mergeMap } from 'rxjs/operators';

import { Logout } from '../../actions/auth';
import { AppState, getAuthUser } from '../../reducers';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'fl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  employee$: Observable<any> = this.afAuth.authState.pipe(
    filter(u => u && !!u.uid),
    mergeMap(u => this.afDb.database.ref(`users/${u.uid}`).once('value')),
    map(u => u && u.val())
  );

  constructor(
    private store: Store<AppState>,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase
  ) {}

  logout() {
    this.store.dispatch(new Logout());
  }
}
