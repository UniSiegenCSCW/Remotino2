import {
  START_RECORDING,
  STOP_RECORDING,
  CHANGE_RANGE,
  REMOVE_ITEM,
  MOVE_ITEM,
} from '../actions/microcontroller';
import { ADD_REPLAY_EVENT } from '../store/replayMiddleware';
import update from 'react/lib/update';
import R from 'ramda';

const replay = (state = { recording: false, events: [], start: 0, end: 0 }, action) => {
  switch (action.type) {
    case ADD_REPLAY_EVENT:
      if (state.recording) {
        return update(state, { events: { $push: [action] } });
      }
      return state;
    case START_RECORDING:
      return update(state, {
        recording: { $set: true },
        events: { $set: [] },
      });
    case STOP_RECORDING:
      return update(state, {
        recording: { $set: false },
      });
    case CHANGE_RANGE:
      return update(state, {
        start: { $set: action.start },
        end: { $set: action.end },
      });
    case REMOVE_ITEM:
      return update(state, {
        events: { $apply: R.remove(action.id, 1) },
      });
    case MOVE_ITEM:
      return update(state, {
        events: {
          $apply: R.update(
              action.id,
              update(state.events[action.id], { time: { $set: action.time } })
          ) },
      });
    default:
      return state;
  }
};

export default replay;
