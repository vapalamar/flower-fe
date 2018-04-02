import * as router from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as auth from './auth';
import * as page from './page';
import * as request from './request';

export interface AppState {
  router: router.RouterReducerState;
  auth: auth.State;
  page: page.State;
  request: request.State;
}

export const reducers = {
  router: router.routerReducer,
  auth: auth.reducer,
  page: page.reducer,
  request: request.reducer,
};

// Auth selects
export const getAuth = createFeatureSelector<auth.State>('auth');
export const isAuthenticated = createSelector(getAuth, auth.isAuthenticated);
export const getAuthUser = createSelector(getAuth, auth.getUser);
export const hasLoginError = createSelector(getAuth, auth.hasLoginError);

// Request selects
export const getRequest = createFeatureSelector<request.State>('request');

// Page selects
export const getPage = createFeatureSelector<page.State>('page');
