import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import connectionState from './connectionState';
import pins from './pins';
import ui from './uiReducer';
import visibilityFilter from './visibilityFilter';
import replay from './replay';
import ports from './ports';
import flash from './flashReducer';

const rootReducer = combineReducers({
  connectionState,
  pins,
  ui,
  visibilityFilter,
  replay,
  ports,
  routing,
  flash,
});

export default rootReducer;
