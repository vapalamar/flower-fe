import { Component, HostBinding, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { delay, filter, find, map, withLatestFrom } from 'rxjs/operators';

import { BaseComponent } from '../../helpers/base.component';
import { User } from '../../models';
import { AppState, getAuthUser } from '../../reducers';
import { RedirectService } from '../redirect/redirect.service';

@Component({
  selector: 'fl-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent extends BaseComponent implements OnInit {
  // avatar$ = this.store.select(getAuthUser).pipe(delay(1000), filter(Boolean), map(u => u.Employee.Image.url));

  // userFullName$ = this.store
  //   .select(getAuthUser)
  //   .pipe(filter(Boolean), map(u => `${u.Employee.firstName} ${u.Employee.lastName}`));
  // companyType$ = this.store
  //   .select(getAuthUser)
  //   .pipe(filter(u => Boolean(u && u.Employee.Company)), map(({ Employee }) => Employee.Company.type.toUpperCase()));
  reducedState = false;

  // role$ = this.store.select(getAuthUser).pipe(filter(Boolean), map(({ Employee: { role } }) => role));

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
  ) {
    super();
  }

  ngOnInit() {
    // this.store
    //   .select(getAuthUser)
    //   .pipe(find(Boolean))
    //   .subscribe(user => this.setActiveStates(this.router.url, user));

    // this.subs = this.router.events
    //   .pipe(filter(e => e instanceof NavigationEnd), withLatestFrom(this.store.select(getAuthUser)))
    //   .subscribe(([, user]) => this.setActiveStates(this.router.url, user));
  }

  toggleReduceState() {
    this.reducedState = !this.reducedState;
  }

  // private setActiveStates(url: string, user: User) {
  //   this.isRfpsRouteActive = Boolean(url.match(/^\/rfps([^\/]+|$)/));
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
