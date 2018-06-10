import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { BaseComponent } from '../helpers/base.component';
import { filter, first, tap, mergeMap, map } from 'rxjs/operators';
import { entries, omit } from 'lodash-es';
import { AddCompanyReviewModalComponent } from '../shared/add-company-review-modal/add-company-review-modal.component';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { OrderServiceModalComponent } from '../shared/order-service-modal/order-service-modal.component';
import { ActivatedRoute, Router, UrlHandlingStrategy } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'fl-services-view',
  templateUrl: './services-view.component.html',
  styleUrls: ['./services-view.component.scss']
})
export class ServicesViewComponent extends BaseComponent implements OnInit {
  @ViewChild('successModal') successModal: ModalDirective;
  @Input() vendorId;
  @Input() hideCompanyOptions = false;
  services: any[];
  user: any;
  bsModalRef: BsModalRef;

  constructor(
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private modal: BsModalService,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    const users = this.afAuth.authState.pipe(
      first(),
      tap(u => this.user = u),
      mergeMap(() => this.afDB.database.ref('/users').orderByChild('role').equalTo('vendor').once('value')),
      map(s => (s && s.val()) || {}));
    
    combineLatest(
      users, this.route.queryParams
    ).subscribe(([users, params]) => {
      let usersArray = entries<any>(users).map(([id, user]) => ({id, ...user}));
      if (this.vendorId) {
        usersArray = usersArray.filter(({id}) => id === this.vendorId);
      }
      this.services = usersArray.reduce((acc, user) => {
        const services = entries(user.services || {}).map(([id, s]) => ({...s, id, owner: omit(user, 'services')}));
        return acc.concat(services);
      }, []);

      const {serviceId, adminId} = params;
      if (serviceId && adminId) {
        this.bsModalRef = this.modal.show(OrderServiceModalComponent, {
          class: 'modal-lg',
          backdrop: 'static'
        });
    
        this.bsModalRef.content.adminId = adminId;
        this.bsModalRef.content.serviceId = serviceId;
        
        this.subs = this.modal.onHidden.subscribe(() => setTimeout(() => this.successModal.show()));
      }
    });
  }

  trackById(i: number, s: any) {
    return s.id;
  }

  openCompanyReviewModal(adminId: string) {
    this.bsModalRef = this.modal.show(AddCompanyReviewModalComponent, {
      class: 'modal-lg',
      backdrop: 'static',
    });

    this.bsModalRef.content.adminId = adminId;
  }

  openOrderModel(service: any) {
    this.bsModalRef = this.modal.show(OrderServiceModalComponent, {
      class: 'modal-lg',
      backdrop: 'static'
    });

    this.bsModalRef.content.adminId = service.owner.id;
    this.bsModalRef.content.serviceId = service.id;
  }
}
