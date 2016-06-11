import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { replayMiddleware } from './replayMiddleware';
import rootReducer from '../reducers';

const router = routerMiddleware(hashHistory);

const enhancer = applyMiddleware(thunk, replayMiddleware, router);

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
