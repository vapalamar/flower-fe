import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { BaseComponent } from '../helpers/base.component';
import { filter, first, tap, mergeMap, map } from 'rxjs/operators';
import { entries, omit } from 'lodash-es';

@Component({
  selector: 'fl-services-view',
  templateUrl: './services-view.component.html',
  styleUrls: ['./services-view.component.scss']
})
export class ServicesViewComponent extends BaseComponent implements OnInit {
  services: any[];
  user: any;

  constructor(
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase
  ) {
    super();
  }

  ngOnInit() {
    this.afAuth.authState.pipe(
      first(),
      tap(u => this.user = u),
      mergeMap(() => this.afDB.database.ref('/users').orderByChild('role').equalTo('vendor').once('value')),
      map(s => (s && s.val()) || {})
    ).subscribe(users => {
      const usersArray = entries<any>(users).map(([id, user]) => ({id, ...user}));
      this.services = usersArray.reduce((acc, user) => {
        const services = entries(user.services || {}).map(([id, s]) => ({...s, id, owner: omit(user, 'services')}));
        return acc.concat(services);
      }, []);
    });
  }

  trackById(i: number, s: any) {
    return s.id;
  }
}
