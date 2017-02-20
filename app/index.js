import React from 'react';
import counterpart from 'counterpart';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.sass';

const store = configureStore();
document.store = store;
const history = syncHistoryWithStore(hashHistory, store);

// set the initial locale to 'de' because counterpart default is 'en'
counterpart.setLocale('de');

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
