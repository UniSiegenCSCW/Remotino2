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
};

const removePinEvents = (events, pinId) => {
  const result = events.filter((event) => event.replay.pinId !== pinId);
  return result;
};

const replay = (state = initalState, action) => {
  switch (action.type) {
    case CHANGE_MODE: {
      // searching last event in stack
//      let lastEvent = null;
//      for (let i = state.events.length - 1; i >= 0; i--) {
//        if (state.events[i].id === action.id) {
//          lastEvent = state.events[i];
//          break;
//        }
//      }
//      if (lastEvent !== null && lastEvent.value === action.value) {
//        return state;
//      } else {
//      return update(state, { events: { $push: [action] } });
//      }
      return update(state,
        { events:
          { $apply: events => removePinEvents(events, action.id) }
        }
      );
    }
    case ADD_REPLAY_EVENT:
      return update(state, { events: { $push: [action] } });
      return state;
    case START_REPLAY:
      return update(state, {
        playing: { $set: true },
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
