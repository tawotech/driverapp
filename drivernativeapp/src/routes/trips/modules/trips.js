/**
 * contains all actions and action handlers
 */

 import update from 'react-addons-update'
 import actionConstants from './actionConstants'
 import axios from 'axios';
 import apiConstants from '../../../api/apiConstants'
 import AsyncStorage from '@react-native-community/async-storage';
 import PushNotification from 'react-native-push-notification'


 const {url} = apiConstants;
 // login initial state
const initialState = {
    completeTrips: [],
    incompleteTrips:[],
    vehicle: null,
    isLoading: false,
    name: null,
    surname: null,
    startDate: null,
    fcmToken: null,
    notifications: [],
    notificationTrip: null,
    notificationTripIsLoading: false
};

 /**
 * Action types
 */

const {
    GET_GROUPED_TRIPS,
    TRIPS_IS_LOADING,
    ASSIGN_FCM_TOKEN,
    UNASSIGN_FCM_TOKEN,
    ON_TRIP_NOTIFICATION,
    NOTIFICATION_TRIP_IS_LOADING,
    GET_NOTIFICATION_TRIP_DATA,
    CLOSE_TRIP_NOTIFICATION,
    NOTIFICATION_ACCEPT_TRIP,
    NOTIFICATION_DECLINE_TRIP
} = actionConstants;

const MONTH_OF_THE_YEAR = ["Jan","Feb","Mar","Apr", "May", "Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const handleNotification = (date, time, firstPickupTime) => {

    let formatedTime = firstPickupTime.split(":");
    let notifDate = new Date(date);
    notifDate.setHours(formatedTime[0]);
    formatedTime[1] = formatedTime[1].slice(0,-2);
    notifDate.setMinutes(formatedTime[1]);
    // change to an hour before
    notifDate.setHours(notifDate.getHours() - 1);

    PushNotification.localNotificationSchedule({
        channelId: "app-channel",
        title: `Etapath Trip Message`,
        message: `You have a trip booked for ${notifDate.getDate()}/${MONTH_OF_THE_YEAR[notifDate.getMonth()]}/${notifDate.getFullYear()} at ${time}, get ready!`,
        //date: new Date(Date.now() + 10 * 1000),
        date: notifDate,
        allowWhileIdle: true,
        data: {
            openedInForeground: true
        }
    })
}

/**
 * Actions
 */

export function isLoadingAction(isLoading)
{
    return (dispatch, store)=>{
        dispatch({
            type: TRIPS_IS_LOADING,
            payload:{
                isLoading
            }
        })
    }
}

export function notificationTripIsLoadingAction(notificationTripIsLoading)
{
    return (dispatch, store)=>{
        dispatch({
            type: NOTIFICATION_TRIP_IS_LOADING,
            payload:{
                notificationTripIsLoading
            }
        })
    }
}

export function onTripNotificationAction(notification)
{
    return (dispatch, store)=>{

        let notifications = store().trips.notifications;
        notifications.push(notification);
        // sort the notifications
        let compare = (a, b) => (a > b) - (a < b);
        notifications = notifications.sort(function(a, b) {
            return compare(a.data.timeslot, b.data.timeslot); //|| compare(a.data.date, b.data.date)
        });

        dispatch({
            type: ON_TRIP_NOTIFICATION,
            payload:{
                notifications
            }
        })
    }
}

export function closeTripNotificationAction()
{
    return (dispatch, store)=>{

        let notifications = store().trips.notifications;
        notifications.shift();
        dispatch({
            type: CLOSE_TRIP_NOTIFICATION,
            payload:{
                notifications,
                notificationTrip: null
            }
        })
    }
}

export const getGroupedTripsAction = () =>{
    return async (dispatch, store)=>{

        dispatch(isLoadingAction(true));

        let token = await store().navigate.userToken;

        axios.get(`${url}/api_dashboard/index`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async (res)=>{
            let startDate = new Date(res.data.current_user.started_date);
            let formatedStartDate = `${MONTH_OF_THE_YEAR[startDate.getMonth()]} ${startDate.getFullYear()}`
            dispatch({
                type: GET_GROUPED_TRIPS,
                payload: {
                    startDate: formatedStartDate,
                    name: res.data.current_user.name,
                    surname: res.data.current_user.surname,
                    vehicle: res.data.current_user.vehicle,
                    completeTrips: res.data.complete_trips,
                    incompleteTrips: res.data.incomplete_trips
                }
            });

            dispatch(isLoadingAction(false));
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}

export const assignFcmTokenAction = ()=>{

    return async(dispatch,store)=>{
        try{
            let fcmToken = await AsyncStorage.getItem('fcmToken');
            axios.post(`${url}/api_dashboard/assign_fcm_token`,
            {
                fcm_token: fcmToken
            },
            {
                headers:{
                    'Authorization': `Bearer ${store().navigate.userToken}`
                }
            })
            .then(async (res)=>{
                dispatch({
                    type: ASSIGN_FCM_TOKEN,
                    payload:{
                        fcmToken: res.data.fcm_Token
                    }
                });
            })
        }
        catch(e){
            console.log(e);
        }
    }
}

export const unassignFcmTokenAction = (token)=>{
    
    return (dispatch,store)=>{

        dispatch({
            type: UNASSIGN_FCM_TOKEN,
            payload:{
                fcmToken: null
            }
        });
    }
}

export function getNotificationTripDataAction(id) {
    return (dispatch, store) => {
        dispatch(notificationTripIsLoadingAction(true));

        axios.get(`${url}/api_grouped_trips/show?id=${id}`, {
            headers: {
                'Authorization': `Bearer ${store().navigate.userToken}`
            }
        })
            .then(async (res) => {
                dispatch({
                    type: GET_NOTIFICATION_TRIP_DATA,
                    payload: {
                        notificationTrip: res.data
                    }
                });
                notificationTripIsLoadingAction(false);
            })
            .catch((e) => {
                console.log(e);
            });
    }
}

export function notificationAcceptTripAction() {
    return (dispatch, store) => {
        const { notificationTrip, incompleteTrips } = store().trips;
        axios.post(`${url}/api_grouped_trips/accept`,
            {
                id: notificationTrip.trip_id
            },
            {
                headers: {
                    'Authorization': `Bearer ${store().navigate.userToken}`
                }
            }
        )
            .then(async (res) => {

                let updatedIncompleteTrips = incompleteTrips.map((trip)=>{
                    if(trip.trip_id == notificationTrip.trip_id)
                    {
                        trip.status = res.data.status;
                        return trip;
                    }
                    else
                    {
                        return trip;
                    }
                });

                dispatch({
                    type: NOTIFICATION_ACCEPT_TRIP,
                    payload: {
                        incompleteTrips: updatedIncompleteTrips,
                    }
                });

                dispatch(closeTripNotificationAction());
                const firstPickupTime = notificationTrip.first_passenger.split(" ")[2];
                handleNotification(notificationTrip.date, notificationTrip.time, firstPickupTime);
            })
            .catch((e) => {
                console.log(e);
            });
    }
}

export function notificationDeclineTripAction() {
    return (dispatch, store) => {
        const { notificationTrip, incompleteTrips } = store().trips;
        axios.post(`${url}/api_grouped_trips/decline`,
            {
                id: notificationTrip.trip_id
            },
            {
                headers: {
                    'Authorization': `Bearer ${store().navigate.userToken}`
                }
            }
        )
            .then(async (res) => {

                let updatedIncompleteTrips = incompleteTrips.filter((trip)=>trip.trip_id != notificationTrip.trip_id);
                dispatch({
                    type: NOTIFICATION_DECLINE_TRIP,
                    payload: {
                        incompleteTrips: updatedIncompleteTrips
                    }
                });
                dispatch(closeTripNotificationAction());
            })
            .catch((e) => {
                console.log(e);
            });
    }
}


/**
 * Action handlers
 */
function handleGetGroupedTrips (state,action){
    return update(state,{
        startDate:{ $set: action.payload.startDate},
        name:{ $set: action.payload.name},
        surname:{ $set: action.payload.surname},
        vehicle:{ $set: action.payload.vehicle},
        completeTrips:{ $set: action.payload.completeTrips},
        incompleteTrips:{ $set: action.payload.incompleteTrips}
    })
}

function handleIsLoading (state,action){
    return update(state,{
        isLoading:{ $set: action.payload.isLoading}
    })
}

function handleAssignFcmToken(state, action)
{
    return update( state,{
        fcmToken: { $set: action.payload.fcmToken } ,
    })
}

function handleUnassignFcmToken(state, action)
{
    return update( state,{
        fcmToken: { $set: action.payload.fcmToken } ,
    })
}

function handleOnTripNotification(state, action)
{
    return update( state,{
        notifications: { $set: action.payload.notifications } ,
    })
}

function handleCloseTripNotification(state, action)
{
    return update( state,{
        notifications: { $set: action.payload.notifications },
        notificationTrip:{ $set: action.payload.noticationTrip}
    })
}

function handleNotificationTripIsLoading (state,action){
    return update(state,{
        notificationTripIsLoading:{ $set: action.payload.notificationTripIsLoading}
    })
}

function handleGetNotificationTripData (state,action){
    return update(state,{
        notificationTrip:{ $set: action.payload.notificationTrip}
    })
}

function handleNotificationAcceptTrip (state,action){
    return update(state,{
        incompleteTrips:{ $set: action.payload.incompleteTrips}
    })
}

function handleNotificationDeclineTrip (state,action){
    return update(state,{
        incompleteTrips:{ $set: action.payload.incompleteTrips}
    })
}

const ACTION_HANDLERS = {
    GET_GROUPED_TRIPS: handleGetGroupedTrips,
    TRIPS_IS_LOADING: handleIsLoading,
    ASSIGN_FCM_TOKEN: handleAssignFcmToken,
    UNASSIGN_FCM_TOKEN: handleUnassignFcmToken,
    ON_TRIP_NOTIFICATION: handleOnTripNotification,
    NOTIFICATION_TRIP_IS_LOADING: handleNotificationTripIsLoading,
    GET_NOTIFICATION_TRIP_DATA: handleGetNotificationTripData,
    CLOSE_TRIP_NOTIFICATION: handleCloseTripNotification,
    NOTIFICATION_ACCEPT_TRIP: handleNotificationAcceptTrip,
    NOTIFICATION_DECLINE_TRIP: handleNotificationDeclineTrip
}

export function TripsReducer (state = initialState, action){
    const handler = ACTION_HANDLERS[action.type];
    // if the handler does not exist, just return the state, no changes 
    return handler ? handler(state,action): state;
}