import { timestamp } from '../utils/utils';

export const ADD_REPLAY_EVENT = 'ADD_REPLAY_EVENT';
export const replayMiddleware = store => next => action => {
  if (action.replayable) {
    next(action);
    const replay = {
      type: ADD_REPLAY_EVENT,
      timestamp: timestamp(),
      replay: () => store.dispatch(action),
    };
    next(action);
    next(replay);
  } else {
    next(action);
  }
};
