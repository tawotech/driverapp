//import 'react-native-gesture-handler';

import React from 'react';
import {Provider} from 'react-redux'

import createStore from './src/store/createStore'
import NavContainer from './src/navigations/containers/NavContainer';
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import axios from 'axios'
import { 
  logoutAction
} from './src/navigations/modules/navigation'


const initialState = window.__INITIAL_STATE__;
const store = createStore (initialState);
const {dispatch} = store;

axios.interceptors.response.use(response=>{
  return response;
},error=>{
  const {status} = error.response;
  if(status == 401) // unauthorized
  {
    dispatch(logoutAction());
  }
  return Promise.reject(error);
});

const App = () => {

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
