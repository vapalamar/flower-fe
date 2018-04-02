import { Action } from '@ngrx/store';

export const SET_CAN_DEACTIVATE_STATE = '[Page] Set canDeactivate state';

export class SetCanDeactivateState implements Action {
  readonly type = SET_CAN_DEACTIVATE_STATE;

  constructor(public canDeactivate: boolean) { }
}

export type Actions = SetCanDeactivateState;
