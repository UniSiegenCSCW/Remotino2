import { UPDATE_PIN, CHANGE_MODE, PIN_VALUE_CHANGED, CONNECTING_TO_BOARD, CONNECTED_TO_BOARD }
  from '../actions/microcontroller';
import { map } from 'ramda';
import { CONNECTION_STATE } from './microcontrollerEnums';

const initialState = {
  connectionState: CONNECTION_STATE.NOT_CONNECTED,
  pins: [],
};

const createPin = (action) => (
  {
    id: action.id,
    mode: action.mode,
    value: action.value,
    report: action.report,
    supportedModes: action.supportedModes,
    analogChannel: action.analogChannel,
    isHWSerialPort: action.isHWSerialPort,
    isSWSerialPort: action.isSWSerialPort,
    isAnalogPin: action.isAnalogPin,
  }
);

const updatePins = (state, id, newProps) => updatePinsFromCurrent(state, id, () => newProps);

const updateItemFromCurrent = (id, fun) => (
  (pin) => ((pin.id.toString() === id.toString()) ? Object.assign(pin, fun(pin)) : pin)
);

const updatePinsFromCurrent = (state, id, fun) => map(updateItemFromCurrent(id, fun), state);

const updateState = (state, newAttrib) => Object.assign({}, state, newAttrib);

export default function board(state = initialState, action) {
  switch (action.type) {
    case CONNECTING_TO_BOARD:
      return updateState(state, { connectionState: CONNECTION_STATE.CONNECTING });
    case CONNECTED_TO_BOARD:
      return updateState(state, { connectionState: CONNECTION_STATE.CONNECTED });
    case UPDATE_PIN:
      return updateState(state, { pins: [...state.pins, createPin(action)] });
    case CHANGE_MODE:
      return updateState(state, { pins: updatePins(state.pins, action.id, { mode: action.mode }) });
    case PIN_VALUE_CHANGED:
      return (
        updateState(state, { pins: updatePins(state.pins, action.id, { value: action.value }) })
      );
    default:
      return state;
  }
}
