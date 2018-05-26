import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { BaseComponent } from '../helpers/base.component';
import { filter, mergeMap, map, finalize } from 'rxjs/operators';
import { entries } from 'lodash-es';

@Component({
  selector: 'fl-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent extends BaseComponent implements OnInit {
  isLoading = false;
  services: any[] = [];

  constructor(
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase
  ) {
    super();
  }

  ngOnInit() {
    this.subs = this.afAuth.authState.pipe(
      filter(Boolean),
      mergeMap(u => this.afDB.database.ref(`users/${u.uid}`).once('value')),
      map(s => s && s.val()),
      finalize(() => (this.isLoading = false))
    ).subscribe(v => this.services = this.mapServices(v.services));
  }

  private mapServices(servicesObj = {}) {
    return entries(servicesObj).map(([id, service]) => ({...service, id}));
  }
}
