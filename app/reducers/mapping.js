import update from 'react/lib/update';
import { IDENTIFIED_BOARD } from '../actions/microcontroller';

const mapping = (state = { name: 'UNKNOWN DEVICE' }, action) => {
  switch (action.type) {
    case IDENTIFIED_BOARD:
      return update(state, { name: { $set: action.name } });
    default:
      return state;
  }
};

export default mapping;
