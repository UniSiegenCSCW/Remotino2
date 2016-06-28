import { DETECTED_PORTS } from '../actions/microcontroller';

const pins = (state = [], action) => {
  switch (action.type) {
    case DETECTED_PORTS:
      return action.ports;
    default:
      return state;
  }
};

export default pins;
