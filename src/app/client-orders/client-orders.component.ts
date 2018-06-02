import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { first, mergeMap, map, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { values } from 'lodash-es';

@Component({
  selector: 'fl-client-orders',
  templateUrl: './client-orders.component.html',
  styleUrls: ['./client-orders.component.scss']
})
export class ClientOrdersComponent implements OnInit {
  orders: any[];

  constructor(
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase
  ) { }

  ngOnInit() {
    const companies = this.afAuth.authState.pipe(
      first(),
      mergeMap(() => this.afDB.database.ref('/users').orderByChild('role').equalTo('vendor').once('value')),
      map(s => s && s.val())
    );
    const userOrders = this.afAuth.authState.pipe(
      filter(Boolean),
      first(),
      mergeMap((u) => this.afDB.database.ref(`users/${u.uid}/my-orders`).once('value')),
      map(s => s && s.val())
    );

    combineLatest(companies, userOrders)
      .subscribe(([cs, orders]) => {
        this.orders = values(orders).map(order => ({
          ...order,
          vendor: cs[order.vendorId].company,
          master: cs[order.vendorId].employees[order.master]
        }));
      });
  }

}
