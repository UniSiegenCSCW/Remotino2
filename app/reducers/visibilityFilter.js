import {
  SET_VISIBILITY_FILTER,
} from '../actions/microcontroller';
import update from 'react/lib/update';


const initialState = {
  showDisabled: false,
  showAnalogIn: true,
  showDigitalIn: true,
  showAnalogOut: true,
  showDigitalOut: true,
};

const visibilityFilter = (state = initialState, action) => {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return update(state, { [action.property]: { $set: action.value } });
    default:
      return state;
  }
};

export default visibilityFilter;
