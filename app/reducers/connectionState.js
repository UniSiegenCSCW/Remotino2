import { CONNECTED_TO_BOARD } from '../actions/microcontroller';
import { TRY_FLASHING_BOARD, FLASHING_DONE, FLASHING_ERROR } from '../actions/flashActions';
import { CONNECTION_STATE } from './microcontrollerEnums';

const connectionState = (state = CONNECTION_STATE.NOT_CONNECTED, action) => {
  switch (action.type) {
    case CONNECTED_TO_BOARD:
      return CONNECTION_STATE.CONNECTED;
    case TRY_FLASHING_BOARD:
      return CONNECTION_STATE.FLASHING;
    case FLASHING_ERROR:
    case FLASHING_DONE:
      return CONNECTION_STATE.NOT_CONNECTED;
    default:
      return state;
  }
};

export default connectionState;
