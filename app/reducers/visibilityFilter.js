import update from 'react/lib/update';
import { SET_VISIBILITY_FILTER } from '../actions/visibilityFilter';

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
