import {
  IDENTIFIED_BOARD,
} from '../actions/microcontroller';

import update from 'react/lib/update';

const mapping = (state = { name: 'UNKNOWN DEVICE', mapping: {} }, action) => {
  switch (action.type) {
    case IDENTIFIED_BOARD:
      return update(state, { pins: { $set: action.pins }, name: { $set: action.name } });
    default:
      return state;
  }
};

export default mapping;
