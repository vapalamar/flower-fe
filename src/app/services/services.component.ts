import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { BaseComponent } from '../helpers/base.component';
import { filter, mergeMap, map, finalize, first } from 'rxjs/operators';
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
    this.isLoading = true;
    this.subs = this.getServices().subscribe(v => this.services = this.mapServices(v.services));
  }

  deleteService(id) {
    this.afAuth.authState.pipe(
      filter(Boolean),
      first(),
      mergeMap(u => this.afDB.database.ref(`users/${u.uid}/services/${id}`).remove())
    ).subscribe(() => this.getServices().subscribe(v => this.services = this.mapServices(v.services)))
  }

  getServices() {
    return this.afAuth.authState.pipe(
      filter(Boolean),
      first(),
      mergeMap(u => this.afDB.database.ref(`users/${u.uid}`).once('value')),
      map(s => s && s.val()),
      finalize(() => (this.isLoading = false))
    );
  }

  private mapServices(servicesObj = {}) {
    return entries(servicesObj).map(([id, service]) => ({...service, id}));
  }
}
