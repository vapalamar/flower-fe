import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { BaseComponent } from '../helpers/base.component';
import { filter, mergeMap, map, finalize, first } from 'rxjs/operators';
import { entries } from 'lodash-es';
import { ClipboardService } from 'ng2-clipboard/ng2-clipboard';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    private afDB: AngularFireDatabase,
    private clipboard: ClipboardService,
    private toastr: ToastrService
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
    ).subscribe(() => this.getServices().subscribe(v => this.services = this.mapServices(v.services)));
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

  shareService(id) {
    const urlString = `${window.location.protocol}//${window.location.host}/all-services`;
    this.afAuth.authState.pipe(
      filter(Boolean),
      first()
    ).subscribe((u) => {
      const url = new URL(urlString);
      url.searchParams.append('serviceId', id);
      url.searchParams.append('adminId', u.uid);
      this.clipboard.copy(url.toString());
      this.toastr.info('URL is copied, you can embed it inrto your application.');
    });
  }

  private mapServices(servicesObj = {}) {
    return entries(servicesObj).map(([id, service]) => ({...service, id}));
  }
}
