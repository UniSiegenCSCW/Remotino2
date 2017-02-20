import update from 'react/lib/update';
import { CHANGE_LOCALE, VISIBLE_INTERVAL_CHANGED } from '../actions/uiActions';
import { timestamp } from '../utils/utils';

function startInterval() {
  const duration = 30 * 1000;
  const endDate = timestamp();
  const startDate = endDate - duration;
  return [startDate, endDate];
}

const ui = (state = { locale: 'en', interval: startInterval() }, action) => {
  switch (action.type) {
    case CHANGE_LOCALE:
      return update(state, { locale: { $set: action.locale } });
    case VISIBLE_INTERVAL_CHANGED:
      return update(state, { interval: { $set: action.interval } });
    default:
      return state;
  }
};

export default ui;
