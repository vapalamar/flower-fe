import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../helpers/base.component';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { map, filter, mergeMap, tap } from 'rxjs/operators';
import { defaultImage } from '../app.constants';

@Component({
  selector: 'fl-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss']
})
export class VendorDetailsComponent extends BaseComponent implements OnInit {
  vendor: any;

  constructor(
    private route: ActivatedRoute,
    private afDB: AngularFireDatabase
  ) {
    super();
   }

  ngOnInit() {
    this.route.params.pipe(
      map(p => p.id),
      filter(Boolean),
      tap(id => this.vendor = {id}),
      mergeMap(id => this.afDB.database.ref(`users/${id}`).once('value')),
      map(s => s.val())
    ).subscribe(v => {
      this.vendor = {...this.vendor, ...v};
      this.vendor.company.coverImage = this.vendor.company.coverImage || defaultImage.company.cover;
    });
  }

}
