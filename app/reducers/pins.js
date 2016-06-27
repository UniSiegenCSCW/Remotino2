import {
  CHANGE_MODE,
  IDENTIFIED_BOARD,
  PIN_VALUE_CHANGED,
  SET_ENABLED,
  UPDATE_PINS,
} from '../actions/microcontroller';
import update from 'react/lib/update';
import { mapObjIndexed, merge } from 'ramda';

const createPin = (action) => (
    Object.assign({
      name: `Pin ${action.id}`,
      mode: action.mode,
      categories: [],
      values: [],
      report: action.report,
      enabled: true,
    }, action)
);

const addValue = (values, newValue, limit) => {
  const oldValues = values;
  oldValues.unshift(newValue);
  return oldValues.slice(0, limit);
};

const pins = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PINS:
      return mapObjIndexed(createPin, action.pins);
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
    case IDENTIFIED_BOARD:
      // Update name and categories for each pin
      //   state = {0: {name: 'Pin 0', categories: [], mode: 1, ...}, 1: ...}
      //   action.pins = {0: {name: 'D0', categories: ['PWM', 'Digital']}, 1: ...}
      return mapObjIndexed((value, key) => merge(value, action.pins[key]), state);
    default:
      return state;
  }
};

export default pins;
