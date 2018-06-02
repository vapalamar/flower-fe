import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { first, mergeMap, map, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { values } from 'lodash-es';

@Component({
  selector: 'fl-client-reviews',
  templateUrl: './client-reviews.component.html',
  styleUrls: ['./client-reviews.component.scss']
})
export class ClientReviewsComponent implements OnInit {
  reviews: any[];

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
    const userReviews = this.afAuth.authState.pipe(
      filter(Boolean),
      first(),
      mergeMap((u) => this.afDB.database.ref(`users/${u.uid}/my-reviews`).once('value')),
      map(s => s && s.val())
    );

    combineLatest(companies, userReviews)
      .subscribe(([cs, reviews]) => {
        this.reviews = values(reviews).map(review => ({...review, companyName: cs[review.vendorId].company.name}));
      });
  }

}
