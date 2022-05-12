//import 'react-native-gesture-handler';

import React from 'react';
import {Provider} from 'react-redux'

import createStore from './src/store/createStore'
import NavContainer from './src/navigations/containers/NavContainer';
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import axios from 'axios'
import { 
  logoutAction,
  saveFcmTokenAction
} from './src/navigations/modules/navigation'

import PushNotification from "react-native-push-notification";
import { getGroupedTripsAction } from './src/routes/trips/modules/trips';
import {Alert} from 'react-native'

const initialState = window.__INITIAL_STATE__;
const store = createStore (initialState);
const {dispatch} = store;

const handleNotification = (notification) =>{
  if (notification.foreground == true && !notification.data.hasOwnProperty("openedInForeground"))
  {
    PushNotification.localNotificationSchedule({
      channelId: "app-channel",
      title: notification.title,
      message: notification.message,
      date: new Date(Date.now()),
      data: {
        openedInForeground: true
      }
      //allowWhileIdle: true,
      //userInteraction: false
    })
  }
  dispatch(getGroupedTripsAction());
}

PushNotification.configure({

  onRegister: function (token) {
    dispatch(saveFcmTokenAction(token))
  },
  onNotification: function (notification) {
    handleNotification(notification);
 },
  onAction: function (notification) {
  },
 requestPermissions: Platform.OS === 'ios',
});


axios.interceptors.response.use(response=>{
  return response;
},error=>{
  if((error.response && (error.response.status == 401)) || error.status == 401 )
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
