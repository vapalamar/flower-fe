import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { find, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { Login } from '../actions/auth';
import { AppState, hasLoginError, isAuthenticated, getAuthUser } from '../reducers';

@Component({
  selector: 'fl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  formDisabled = false;
  private error$: Subscription;
  private login$: Subscription;

  constructor(
    private store: Store<AppState>,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  login() {
    if (this.form.invalid) {
      return;
    }
    this.formDisabled = true;
    this.store.dispatch(new Login(this.form.value));
    this.error$ = this.store
      .select(hasLoginError)
      .pipe(find(error => Boolean(error)))
      .subscribe(error => {
        if (error) {
          this.toastr.error(error.message);
        }
        if (this.error$) {
          this.error$.unsubscribe();
        }
        if (this.login$) {
          this.login$.unsubscribe();
        }
        this.formDisabled = false;
      });
    this.login$ = this.store
      .select(isAuthenticated)
      .pipe(find(v => v), switchMap(() => this.store.select(getAuthUser)))
      .subscribe(u => {
        if (this.login$) {
          this.login$.unsubscribe();
        }
        this.toastr.success('Login success');
        this.formDisabled = false;
      });
  }
}
