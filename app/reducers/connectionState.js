import {
  CONNECTING_TO_BOARD,
  CONNECTED_TO_BOARD,
} from '../actions/microcontroller';

import { CONNECTION_STATE } from './microcontrollerEnums';

export function connectionState(state = CONNECTION_STATE.NOT_CONNECTED, action) {
  switch (action.type) {
    case CONNECTING_TO_BOARD:
      return CONNECTION_STATE.CONNECTING;
    case CONNECTED_TO_BOARD:
      return CONNECTION_STATE.CONNECTED;
    default:
      return state;
  }
}
