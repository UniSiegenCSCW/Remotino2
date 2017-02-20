import update from 'react/lib/update';
import { dec } from 'ramda';
import {
  DETECTED_PORT,
  REJECTED_PORT,
  REFRESHING_PORTS,
} from '../actions/microcontroller';

const ports = (state = { names: [], remaining: 0 }, action) => {
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
        remaining: { $apply: dec }
      });
    case REJECTED_PORT:
      return update(state, { remaining: { $apply: dec } });
    default:
      return state;
  }
};

export default ports;
