import * as request from '../actions/request';

export interface State {
  inProgress: boolean;
}

export const initialState: State = {
  inProgress: false
};

export function reducer(state = initialState, action: request.Actions) {
  switch (action.type) {
    case request.SET_REQUEST_STATE:
      return { ...state, inProgress: action.state };
    default:
      return state;
  }
}
