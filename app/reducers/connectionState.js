import { CONNECTED_TO_BOARD } from '../actions/microcontroller';
import { CONNECTION_STATE } from './microcontrollerEnums';

const connectionState = (state = CONNECTION_STATE.NOT_CONNECTED, action) => {
  switch (action.type) {
    case CONNECTED_TO_BOARD:
      return CONNECTION_STATE.CONNECTED;
    default:
      return state;
  }
};

export default connectionState;
