import connectionState from './connectionState';
import pins from './pins';
import mapping from './mapping';
import visibilityFilter from './visibilityFilter';
import replay from './replay';

import { combineReducers } from 'redux';

const board = combineReducers({
  connectionState,
  pins,
  mapping,
  visibilityFilter,
  replay,
});

export default board;
