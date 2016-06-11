import {
  UPDATE_PIN,
  CHANGE_MODE,
  SET_ENABLED,
  PIN_VALUE_CHANGED,
} from '../actions/microcontroller';
import update from 'react/lib/update';

const createPin = (action) => (
  {
    id: action.id,
    mode: action.mode,
    values: [],
    report: action.report,
    enabled: true,
    supportedModes: action.supportedModes,
    analogChannel: action.analogChannel,
    isHWSerialPort: action.isHWSerialPort,
    isSWSerialPort: action.isSWSerialPort,
    isAnalogPin: action.isAnalogPin,
  }
);

const addValue = (values, newValue, limit) => {
  const oldValues = values;
  oldValues.unshift(newValue);
  return oldValues.slice(0, limit);
};

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
        { [action.id]: { values:
          { $apply: values => addValue(values, { x: action.timestamp, y: action.value }, 100) }
        } }
      );
    default:
      return state;
  }
};

export default pins;
