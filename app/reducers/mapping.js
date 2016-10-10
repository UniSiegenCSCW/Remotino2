import update from 'react/lib/update';
import { IDENTIFIED_BOARD, CHANGE_LOCALE } from '../actions/microcontroller';

const mapping = (state = { name: 'UNKNOWN DEVICE', locale: 'en' }, action) => {
  switch (action.type) {
    case IDENTIFIED_BOARD:
      return update(state, { name: { $set: action.name } });
    case CHANGE_LOCALE:
      return update(state, { locale: { $set: action.locale } });
    default:
      return state;
  }
};

export default mapping;
