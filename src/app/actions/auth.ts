import { Action } from '@ngrx/store';

import { User } from '../models';

export const SET_USER = '[Auth] Set user';
export const LOGIN = '[Auth] Login';
export const LOGIN_SUCCESS = '[Auth] Login success';
export const LOGIN_FAILED = '[Auth] Login failed';
export const LOGOUT = '[Auth] Logout';
export const LOGOUT_SUCCESS = '[Auth] Logout success';
export const LOGOUT_FAILED = '[Auth] Logout failed';
export const REFRESH_TOKEN = '[Auth] Refresh token';
export const REFRESH_TOKEN_SUCCESS = '[Auth] Refresh token success';
export const REFRESH_TOKEN_FAILED = '[Auth] Refresh token failed';
export const UNAUTHORIZED = '[Auth] Unauthorized';

export class SetUser implements Action {
  readonly type = SET_USER;

  constructor(public user: User) {}
}

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public credentials: { email: string; password: string }) {}
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public accessToken: string, public user: User) {}
}

export class LoginFailed implements Action {
  readonly type = LOGIN_FAILED;

  constructor(public error: any) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LogoutFailed implements Action {
  readonly type = LOGOUT_FAILED;
}

export class RefreshToken implements Action {
  readonly type = REFRESH_TOKEN;
}

export class RefreshTokenSuccess implements Action {
  readonly type = REFRESH_TOKEN_SUCCESS;

  constructor(public accessToken: string) {}
}

export class RefreshTokenFailed implements Action {
  readonly type = REFRESH_TOKEN_FAILED;
}

export class Unauthorized implements Action {
  readonly type = UNAUTHORIZED;
}

export type Actions =
  | SetUser
  | Login
  | LoginSuccess
  | LoginFailed
  | Logout
  | LogoutFailed
  | RefreshToken
  | RefreshTokenSuccess
  | Unauthorized
  | RefreshTokenFailed;
