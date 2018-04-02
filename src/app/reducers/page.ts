import * as page from '../actions/page';

export interface State {
  canDeactivate: boolean;
}

export const initialState: State = {
  canDeactivate: true
};

export function reducer(state: State = initialState, action: page.Actions) {
  switch (action.type) {
    case page.SET_CAN_DEACTIVATE_STATE:
      return { ...state, canDeactivate: action.canDeactivate };
    default:
      return state;
  }
}
