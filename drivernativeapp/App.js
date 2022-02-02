//import 'react-native-gesture-handler';

import React from 'react';
import {Provider} from 'react-redux'

import createStore from './src/store/createStore'
import NavContainer from './src/navigations/containers/NavContainer';
import {GestureHandlerRootView} from 'react-native-gesture-handler'

const App = () => {

  const initialState = window.__INITIAL_STATE__;
  const store = createStore (initialState);

  return (
    <Provider store = {store}>
      <GestureHandlerRootView
        style ={{
          flex: 1
        }}
      >
        <NavContainer/>
      </GestureHandlerRootView>
    </Provider>
  )
};

export default App;
