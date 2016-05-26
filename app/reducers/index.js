import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import microcontroller from './microcontroller';

const rootReducer = combineReducers({
  microcontroller,
  routing,
});

export default rootReducer;
