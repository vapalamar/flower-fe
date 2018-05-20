import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, map } from 'rxjs/operators';

import { Logout } from '../../actions/auth';
import { AppState, getAuthUser } from '../../reducers';

@Component({
  selector: 'fl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  employee$: Observable<any> = this.store.select(getAuthUser).pipe(filter(Boolean), map(u => u && u.Employee || null));

  constructor(private store: Store<AppState>) {}

  logout() {
    this.store.dispatch(new Logout());
  }
}
