import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { filter, mergeMap, map } from 'rxjs/operators';
import { BaseComponent } from '../helpers/base.component';
import { defaultImage } from '../app.constants';

@Component({
  selector: 'fl-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.scss']
})
export class MastersComponent extends BaseComponent implements OnInit {
  employees: any[];
  isLoading = false;

  constructor(private afDb: AngularFireDatabase, private afAuth: AngularFireAuth) {
    super();
  }

  ngOnInit() {
    this.isLoading = true;
    this.subs = this.afAuth.authState.pipe(
      filter(Boolean),
      mergeMap(u => this.afDb.database.ref(`users/${u.uid}/employees`).limitToFirst(10).once('value')),
      map(s => s && s.val()),
      map(v => (v || []).map(e => ({...e, photoURL: e.photoURL || defaultImage.employee.logo })))
    ).subscribe(es => {
      this.isLoading = false;
      this.employees = es;
    });
  }

}
