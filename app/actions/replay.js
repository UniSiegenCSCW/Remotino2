export const REMOVE_ALL_ITEMS = 'REMOVE_ALL_ITEMS';
export function removeAllItems() {
  return { type: REMOVE_ALL_ITEMS };
}

export const CHANGE_RANGE = 'CHANGE_RANGE';
export function changeRange(start, end) {
  return {
    type: CHANGE_RANGE,
    start,
    end,
  };
}

export const REMOVE_ITEM = 'REMOVE_ITEM';
export function removeItem(id) {
  return {
    type: REMOVE_ITEM,
    id,
  };
}

export const MOVE_ITEM = 'MOVE_ITEM';
export function moveItem(id, start, end) {
  return {
    type: MOVE_ITEM,
    id,
    start,
    end,
  };
}

export const SET_SHOWING_TIMELINE = 'SET_SHOWING_TIMELINE';
export function setShowingTimeline(value) {
  return {
    type: SET_SHOWING_TIMELINE,
    value,
  };
}

export const START_RECORDING = 'START_RECORDING';
export function startRecording() {
  return {
    type: START_RECORDING,
    time: new Date(),
  };
}

export const STOP_RECORDING = 'STOP_RECORDING';
export function stopRecording() {
  return {
    type: STOP_RECORDING,
    time: new Date(),
  };
}

export const START_REPLAY = 'START_REPLAY';
export function startReplay() {
  return { type: START_REPLAY };
}

export const STOP_REPLAY = 'STOP_REPLAY';
export function stopReplay() {
  return { type: STOP_REPLAY };
}

export const ADD_REPLAY_EVENT = 'ADD_REPLAY_EVENT';
export function addReplayEvent(replay, description, time = new Date()) {
  return {
    type: ADD_REPLAY_EVENT,
    replay,
    description,
    time,
  };
}
