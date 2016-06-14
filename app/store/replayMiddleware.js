export const ADD_REPLAY_EVENT = 'ADD_REPLAY_EVENT';
import update from 'react/lib/update';

export const replayMiddleware = store => next => action => {
  if (action.replayable) {
    const replay = {
      type: ADD_REPLAY_EVENT,
      time: new Date(),
      description: action.description,
      // Don't record replayed events
      replay: () => store.dispatch(update(action, { replayable: { $set: false } })),
    };
    next(action);
    next(replay);
  } else {
    next(action);
  }
};
