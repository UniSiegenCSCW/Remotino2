import update from 'react/lib/update';
import R from 'ramda';
import {
  ADD_REPLAY_EVENT,
  START_RECORDING,
  STOP_RECORDING,
  START_REPLAY,
  STOP_REPLAY,
  CHANGE_RANGE,
  REMOVE_ITEM,
  MOVE_ITEM,
  REMOVE_ALL_ITEMS,
  SET_SHOWING_TIMELINE,
} from '../actions/replay';

const initalState = {
  recording: false,
  playing: false,
  events: [],
  start: undefined,
  end: undefined,
  showingTimeline: false,
};

const replay = (state = initalState, action) => {
  switch (action.type) {
    case ADD_REPLAY_EVENT:
      if (state.recording) {
        return update(state, { events: { $push: [action] } });
      }
      return state;
      // return update(state, { events: { $push: [action] } });
    case START_RECORDING:
      return update(state, {
        events: { $set: [] },
        recording: { $set: true },
        start: { $set: action.time },
      });
      // return update(state, {
        // recording: { $set: true },
        // start: { $set: action.time },
      // });
    case STOP_RECORDING:
      return update(state, {
        recording: { $set: false },
        end: { $set: action.time },
      });
    case START_REPLAY:
      return update(state, {
        playing: { $set: true },
      });
    case STOP_REPLAY:
      return update(state, {
        playing: { $set: false },
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
      if (action.id === -1) {
        return update(state, {
          start: { $set: action.start },
          end: { $set: action.end },
        });
      }

      return update(state, {
        events: {
          $apply: R.update(
              action.id,
              update(state.events[action.id], { time: { $set: action.start } })
          ) },
      });
    case REMOVE_ALL_ITEMS:
      return update(state, { events: { $set: [] } });
    case SET_SHOWING_TIMELINE:
      return update(state, { showingTimeline: { $set: action.value } });
    default:
      return state;
  }
};

export default replay;
