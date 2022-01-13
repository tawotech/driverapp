
import React from 'react';
import {Provider} from 'react-redux'

import createStore from './src/store/createStore'
import NavContainer from './src/navigations/containers/NavContainer';

const App = () => {

  const initialState = window.__INITIAL_STATE__;
  const store = createStore (initialState);

  return (
    <Provider store = {store}>
      <NavContainer/>
    </Provider>
  )
};

export default App;
