//import 'react-native-gesture-handler';

import React from 'react';
import {Provider} from 'react-redux'

import NavContainer from './src/navigations/containers/NavContainer';
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import axios from 'axios'
import { 
  logoutAction,
  saveFcmTokenAction
} from './src/navigations/modules/navigation'

import { updateTripDataAction } from './src/routes/viewtrip/modules/viewTrip';
import { onTripNotificationAction } from './src/routes/trips/modules/trips';
import PushNotification from "react-native-push-notification";
import { getGroupedTripsAction } from './src/routes/trips/modules/trips';
import store from './src/store/createStore'
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
      },
      //actions: ['Accept', 'Decline']
      //allowWhileIdle: true,
      //userInteraction: false
    })
  }

  if(notification.data.hasOwnProperty("type"))
  {
    if(notification.data.type == "trip_cancelled")
    {
      dispatch(updateTripDataAction(notification.data.id))
    }
    else if(notification.data.type == "trip_booked")
    {
      dispatch(onTripNotificationAction(notification))
    }
    dispatch(getGroupedTripsAction());
  }
   
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
