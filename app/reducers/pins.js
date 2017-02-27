import update from 'react/lib/update';
import { mapObjIndexed, merge } from 'ramda';
// import { timestamp } from '../utils/utils';
import {
  CHANGE_MODE,
  IDENTIFIED_BOARD,
  PIN_VALUE_CHANGED,
  SET_ENABLED,
  SET_SHOWING_CODE,
  UPDATE_PINS,
  CHANGE_VALUE,
} from '../actions/microcontroller';

const createPin = action => (
    Object.assign({
      name: `Pin ${action.id}`,
      mode: action.mode,
      categories: [],
      values: [],
      value: 0,
      report: action.report,
      enabled: true,
      showingCode: false,
      min: 100, // FIXME: currently this values are in %
      max: 0,
    }, action)
);

const addValue = (values, newValue, limit) => {
  const oldValues = values;
  if (oldValues.length > 1 && oldValues[0].y === newValue.y) {
    oldValues[0] = newValue;
    return oldValues;
  } else {
    oldValues.unshift(newValue);
    return oldValues.slice(0, limit);
  }
};

const pins = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PINS:
      return mapObjIndexed(createPin, action.pins);
    case CHANGE_MODE:
//      return update(state, { [action.id]: { mode: { $set: action.mode } } });
      return update(state, { [action.id]: { mode: { $set: action.mode }, values: { $set: [] } } });
// , values: { $set: [] } } });
    case SET_ENABLED:
      return update(state, { [action.id]: { enabled: { $set: action.value } } });
    case SET_SHOWING_CODE:
      return update(state, { [action.id]: { showingCode: { $set: action.value } } });
    case CHANGE_VALUE:
//      console.log(action.id);
//      console.log(state);
      return update(
        state,
        { [action.id]:
        { value:
        { $set: action.value },
          values:
          { $apply: values => addValue(
          values,
          { x: action.timestamp, y: action.value }, 2000) },
          min:
          { $apply: old => (((action.value < old) && (state[action.id].values.length > 1)) ?
                  action.value : old) },
          max:
          { $apply: old => (((action.value > old) && (state[action.id].values.length > 1)) ?
                action.value : old) },
        },
        },
      );
    case PIN_VALUE_CHANGED:
      return update(
        state,
        { [action.id]:
        { values:
        { $apply: values => addValue(
              values, { x: action.timestamp, y: action.value }, 3000) },
          min:
          { $apply: old => (((action.value < old) && (state[action.id].values.length > 1)) ?
                  action.value : old) },
          max:
          { $apply: old => (((action.value > old) && (state[action.id].values.length > 1)) ?
                action.value : old) },
        },
        },
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
