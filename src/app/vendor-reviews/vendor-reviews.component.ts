import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { filter, first, mergeMap, map } from 'rxjs/operators';
import { values } from 'lodash-es';

@Component({
  selector: 'fl-vendor-reviews',
  templateUrl: './vendor-reviews.component.html',
  styleUrls: ['./vendor-reviews.component.scss']
})
export class VendorReviewsComponent implements OnInit {
  reviews: any[];

  constructor(
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.afAuth.authState.pipe(
      filter(Boolean),
      first(),
      mergeMap((u) => this.afDb.database.ref(`users/${u.uid}/reviews`).once('value')),
      map(s => s && s.val())
    ).subscribe(reviews => {
      this.reviews = values(reviews);
    });
  }

}
