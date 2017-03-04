import update from 'react/lib/update';
import {
  ADD_REPLAY_EVENT,
  START_REPLAY,
  STOP_REPLAY,
} from '../actions/replay';
import {
  CHANGE_MODE,
} from '../actions/microcontroller';

const initalState = {
  playing: false,
  events: [],
  replayStart: null,
  replayEnd: null,
};

const removePinEvents = (events, pinId) => {
  const result = events.filter(event => event.replay.pinId !== pinId);
  return result;
};

const replay = (state = initalState, action) => {
  switch (action.type) {
    case CHANGE_MODE: {
      return update(state,
        { events:
          { $apply: events => removePinEvents(events, action.id) }
        }
      );
    }
    case ADD_REPLAY_EVENT:
      return update(state, { events: { $push: [action] } });
//      return state;
    case START_REPLAY:
      return update(state, {
        playing: { $set: true },
        replayStart: { $set: action.startTime },
        replayEnd: { $set: action.endTime },
      });
    case STOP_REPLAY:
      return update(state, {
        playing: { $set: false },
      });
    default:
      return state;
  }
};

export default replay;
