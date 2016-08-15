import update from 'react/lib/update';
import {
  DETECTED_PORT,
  REJECTED_PORT,
  REFRESHING_PORTS,
} from '../actions/microcontroller';

const pins = (state = { names: [], refreshing: false, remaining: 0 }, action) => {
  switch (action.type) {
    case REFRESHING_PORTS:
      return update(state, {
        names: { $set: [] },
        refreshing: { $set: action.count > 0 },
        remaining: { $set: action.count }
      });
    case DETECTED_PORT:
      return update(state, {
        names: { $push: [{ path: action.path, name: action.name, image: action.image }] },
        refreshing: { $set: (state.remaining < 1) },
        remaining: { $apply: (n) => n - 1 }
      });
    case REJECTED_PORT:
      return update(state, {
        refreshing: { $set: (state.remaining < 1) },
        remaining: { $apply: (n) => n - 1 }
      });
    default:
      return state;
  }
};

export default pins;
