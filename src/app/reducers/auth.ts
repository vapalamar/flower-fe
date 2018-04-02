import * as auth from '../actions/auth';
import { User } from '../models';

export interface State {
  loginSuccess: boolean;
  loginFailed: boolean;
  loginError?: Error;
  isAuthenticated: boolean;
  accessToken: string;
  user?: User;
}

export const initialState: State = {
  isAuthenticated: false,
  loginSuccess: false,
  loginError: null,
  loginFailed: false,
  accessToken: '',
  user: undefined,
};

export function reducer(state = initialState, action: auth.Actions): State {
  switch (action.type) {
    case auth.LOGIN:
      return {
        ...state,
        loginSuccess: false,
        loginFailed: false,
        loginError: null,
      };
    case auth.LOGIN_SUCCESS:
      return {
        ...state,
        ...{
          isAuthenticated: true,
          accessToken: action.accessToken,
          user: action.user,
          loginSuccess: true,
          loginFailed: false,
          loginError: null,
        },
      };
    case auth.LOGIN_FAILED:
      return {
        ...initialState,
        loginFailed: true,
        loginError: action.error,
      };
    case auth.SET_USER:
      return { ...state, user: action.user };
    case auth.REFRESH_TOKEN_SUCCESS:
      return { ...state, accessToken: action.accessToken };
    case auth.REFRESH_TOKEN_FAILED:
    case auth.UNAUTHORIZED:
    case auth.LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}

export const isAuthenticated = (state: State) => state.isAuthenticated;
export const getUser = (state: State) => state.user;
export const hasLoginError = (state: State) => state.loginError;
