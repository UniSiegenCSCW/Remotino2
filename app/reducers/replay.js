import { ADD_REPLAY_EVENT } from '../store/replayMiddleware';
import update from 'react/lib/update';

const replay = (state = { recording: false, events: [], timestamp: 0 }, action) => {
  switch (action.type) {
    case ADD_REPLAY_EVENT:
      if (state.recording) {
        return update(state, { events: { $push: { action } } });
      }

      return state;
    default:
      return state;
  }
};

export default replay;
