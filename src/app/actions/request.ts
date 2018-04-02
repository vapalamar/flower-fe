export const SET_REQUEST_STATE = '[Request] Set state';

export class SetRequestState {
  readonly type = SET_REQUEST_STATE;

  constructor(public state: boolean) { }
}

export type Actions = SetRequestState;
