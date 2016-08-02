import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import connectionState from './connectionState';
import pins from './pins';
import mapping from './mapping';
import visibilityFilter from './visibilityFilter';
import replay from './replay';
import ports from './ports';

const rootReducer = combineReducers({
  connectionState,
  pins,
  mapping,
  visibilityFilter,
  replay,
  ports,
  routing,
});

export default rootReducer;
