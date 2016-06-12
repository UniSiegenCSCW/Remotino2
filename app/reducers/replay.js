import {
  START_RECORDING,
  STOP_RECORDING,
} from '../actions/microcontroller';
import { ADD_REPLAY_EVENT } from '../store/replayMiddleware';
import update from 'react/lib/update';

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
        start: { $set: action.timestamp },
      });
    case STOP_RECORDING:
      return update(state, {
        recording: { $set: false },
        end: { $set: action.timestamp },
      });
    default:
      return state;
  }
};

export default replay;
