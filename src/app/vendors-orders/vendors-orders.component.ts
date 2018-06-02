import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { filter, first, mergeMap, map } from 'rxjs/operators';
import { values } from 'lodash-es';

@Component({
  selector: 'fl-vendors-orders',
  templateUrl: './vendors-orders.component.html',
  styleUrls: ['./vendors-orders.component.scss']
})
export class VendorsOrdersComponent implements OnInit {
  orders: any[];

  constructor(
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.afAuth.authState.pipe(
      filter(Boolean),
      first(),
      mergeMap(u => this.afDB.database.ref(`users/${u.uid}`).once('value')),
      map(s => s && s.val())
    ).subscribe(admin => {
      this.orders = values(admin.orders).map(order => ({
        ...order,
        service: admin.services[order.serviceId],
        masterInfo: admin.employees[order.master]
      }));
    });
  }
}
