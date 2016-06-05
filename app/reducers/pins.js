import {
  UPDATE_PIN,
  CHANGE_MODE,
  SET_ENABLED,
  PIN_VALUE_CHANGED,
} from '../actions/microcontroller';

import update from 'react/lib/update';

// TODO: Remove all non-pure functions
import { timestamp } from '../utils/utils';

const createPin = (action) => (
  {
    id: action.id,
    mode: action.mode,
    values: [{ x: timestamp(), y: 0 }],
    report: action.report,
    enabled: true,
    supportedModes: action.supportedModes,
    analogChannel: action.analogChannel,
    isHWSerialPort: action.isHWSerialPort,
    isSWSerialPort: action.isSWSerialPort,
    isAnalogPin: action.isAnalogPin,
  }
);


const pins = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PIN:
      return update(state, { [action.id]: { $set: createPin(action) } });
    case CHANGE_MODE:
      return update(state, { [action.id]: { mode: { $set: action.mode } } });
    case SET_ENABLED:
      return update(state, { [action.id]: { enabled: { $set: action.value } } });
    case PIN_VALUE_CHANGED:
      return update(
        state,
        { [action.id]: { values: { $push:
          [{ x: action.timestamp, y: action.value }]
        } } }
      );
    default:
      return state;
  }
};

export default pins;
