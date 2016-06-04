import { connectionState } from './connectionState';
import { pins } from './pins';
import { mapping } from './mapping';

import { combineReducers } from 'redux';

const board = combineReducers({
  connectionState,
  pins,
  mapping,
});

export default board;
