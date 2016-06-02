import {
  UPDATE_PIN,
  CHANGE_MODE,
  PIN_VALUE_CHANGED,
  CONNECTING_TO_BOARD,
  CONNECTED_TO_BOARD,
  IDENTIFIED_BOARD
} from '../actions/microcontroller';

import { CONNECTION_STATE } from './microcontrollerEnums';
import update from 'react/lib/update';
import { timestamp } from '../utils/utils';

const initialState = {
  connectionState: CONNECTION_STATE.NOT_CONNECTED,
  pins: {},
  mapping: {},
};

const createPin = (action) => (
  {
    id: action.id,
    mode: action.mode,
    values: [{ x: timestamp(), y: 0 }],
    report: action.report,
    supportedModes: action.supportedModes,
    analogChannel: action.analogChannel,
    isHWSerialPort: action.isHWSerialPort,
    isSWSerialPort: action.isSWSerialPort,
    isAnalogPin: action.isAnalogPin,
  }
);

export default function board(state = initialState, action) {
  switch (action.type) {
    case CONNECTING_TO_BOARD:
      return update(state, { connectionState: { $set: CONNECTION_STATE.CONNECTING } });
    case CONNECTED_TO_BOARD:
      return update(state, { connectionState: { $set: CONNECTION_STATE.CONNECTED } });
    case UPDATE_PIN:
      return update(state, { pins: { [action.id]: { $set: createPin(action) } } });
    case CHANGE_MODE:
      return update(state, { pins: { [action.id]: { mode: { $set: action.mode } } } });
    case PIN_VALUE_CHANGED:
      return update(
        state,
        { pins: { [action.id]: { values: { $push:
          [{ x: action.timestamp, y: action.value }]
        } } } }
      );
    case IDENTIFIED_BOARD:
      return update(state, { mapping: { $set: action.mapping } });
    default:
      return state;
  }
}
