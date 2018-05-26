import { Component, HostBinding, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { delay, filter, find, map, withLatestFrom, mergeMap, share, tap } from 'rxjs/operators';

import { BaseComponent } from '../../helpers/base.component';
import { User } from '../../models';
import { AppState, getAuthUser } from '../../reducers';
import { RedirectService } from '../redirect/redirect.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserInfo } from '@firebase/auth-types';

@Component({
  selector: 'fl-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent extends BaseComponent implements OnInit {
  userData$ = this.afAuth.authState
  .pipe(
    filter(Boolean),
    mergeMap(u => this.afDb.database.ref(`users/${u.uid}`).once('value')),
    map(u => u && u.val())
  );
  avatar$ = this.afAuth.authState.pipe(delay(1000), filter(Boolean), map((u: UserInfo) => u.photoURL));

  userFullName$ = this.userData$
    .pipe(map(u => `${u.firstName} ${u.lastName}`));

  role$ = this.userData$
    .pipe(map(u => u.role.toUpperCase()));

  avatar: string;
  userFullName: string;
  role: string;
  isClient: boolean;
  isVendor: boolean;
  isDashboardActive: boolean;
  isMastersTabActive: boolean;

  // isVendorAdmin$ = this.role$.pipe(map(role => role === EmployeeRole.VendorAdmin));

  // isIndependent$ = this.store
  //   .select(getAuthUser)
  //   .pipe(
  //     filter(u => Boolean(u && u.Employee.Company)),
  //     map(({ Employee }) => Employee.Company.type === CompanyType.Independent),
  //   );

  // isVendor$ = this.role$.pipe(map(role => role === EmployeeRole.VendorAdmin || role === EmployeeRole.Vendor));

  // isClientAdmin$ = this.role$.pipe(map(role => role === EmployeeRole.ClientAdmin));

  // isClient$ = this.role$.pipe(map(role => role === EmployeeRole.ClientAdmin || role === EmployeeRole.Client));

  // isClientViewOnly$ = this.role$.pipe(
  //   map(
  //     role => role === EmployeeRole.ClientAdmin || role === EmployeeRole.Client || role === EmployeeRole.ClientViewOnly,
  //   ),
  // );

  // isSuperAdmin$ = this.role$.pipe(map(role => role === EmployeeRole.SuperAdmin));

  // mainPageUrl$: Observable<string> = this.redirect.mainPageUrl$.pipe(filter(Boolean));

  // isVendorsRouteActive = false;
  // isManageVendorsRouteActive = false;
  // isRfpsRouteActive = false;
  // isManageRoutesActive = false;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private redirect: RedirectService,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase
  ) {
    super();
  }

  ngOnInit() {
    this.subs = [
      this.avatar$.subscribe(avatar => this.avatar = avatar),
      this.userFullName$.subscribe(name => this.userFullName = name),
    ];
    // this.store
    //   .select(getAuthUser)
    //   .pipe(find(Boolean))
    //   .subscribe(user => this.setActiveStates(this.router.url, user));

    this.subs = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), withLatestFrom(this.role$))
      .subscribe(([, user]) => this.setActiveStates(this.router.url, user));

    this.subs = this.role$.subscribe(role => {
      console.log(this.router.url);
      this.role = role;
      this.isClient = role === 'CLIENT';
      this.isVendor = !this.isClient;
      this.setActiveStates(this.router.url, role);
    });
  }

  private setActiveStates(url: string, user: User) {
    this.isDashboardActive = Boolean(url.match(/^\/dashboard/));
    this.isMastersTabActive = Boolean(url.match(/^\/masters/))
  //   if (user.Employee.role === EmployeeRole.SuperAdmin) {
  //     const hasQueryParams = url.indexOf('?') !== -1;
  //     const pureUrl = hasQueryParams ? url.slice(0, url.indexOf('?')) : url;
  //     this.isManageVendorsRouteActive = Boolean(pureUrl.match(/^\/manage\/vendors(\/(employees|import))?$/));
  //     const isManageClientsRouteActive = Boolean(url.match(/^\/manage\/clients/));
  //     this.isManageRoutesActive = isManageClientsRouteActive || this.isManageVendorsRouteActive;
  //   }
  //   this.isVendorsRouteActive = Boolean(url.match(/^\/vendors([^\/]+|$)/));
  // }
  }
}
