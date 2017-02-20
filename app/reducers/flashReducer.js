import update from 'react/lib/update';
import { TRY_FLASHING_BOARD, FLASHING_DONE, FLASHING_ERROR } from '../actions/flashActions';

const flash = (state = { flashDone: false }, action) => {
  switch (action.type) {
    case TRY_FLASHING_BOARD:
      return update(state, {
        boardType: { $set: action.boardType },
        flashDone: { $set: false }
      });
    case FLASHING_DONE:
      return update(state, {
        flashDone: { $set: true }
      });
    case FLASHING_ERROR:
      return update(state, {
        flashDone: { $set: false }
      });
    default:
      return state;
  }
};

export default flash;
