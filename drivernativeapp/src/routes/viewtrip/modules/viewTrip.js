/**
 * contains all actions and action handlers
 */

 import update from 'react-addons-update'
 import actionConstants from './actionConstants'
 import axios from 'axios';
 import apiConstants from '../../../api/apiConstants'
 import { Linking, Alert, PermissionsAndroid } from 'react-native';
 import PushNotification from 'react-native-push-notification'
import * as WidgetService  from '../../../Services/WidgetService';
import * as TrackingService from '../../../Services/TrackingService';

const { 
    startWidgetService,
    widgetPerformAction,
    getWidgetState,
    setWidgetState 
} = WidgetService;

const {
    startCalculatingDistanceAction,
    stopTrackingService,
    getTrackingState
} = TrackingService;
 
const {url} = apiConstants;
 // login initial state
const initialState = {
    tag: null,
    date: null,
    time: null,
    trip_id: null,
    company: null,
    status: null,
    total_distance: null,
    trips:[],
    order: '',
    passenger: null,
    passengerName: null,
    passengerSurname: null,
    passengerLocation: null,
    passengerDestination: null,
    passengerBound: null,
    passengerStatus: null,
    googleMapsRoute:{},
    contactToCall: null,
    firstPassenger: null,
    passengerIsLoading: true,
    isLoading: true,
    currentLocation: null,
    prevLocation: null,
    //distanceTravelled: 0,
    startCalculatingDistance: false,
    allTripsOnRoute: "false"
}

 /**
 * Action types
 */

const {
    GET_TRIP_DATA,
    ACCEPT_TRIP,
    ON_ROUTE,
    GET_PASSENGER,
    COMPLETE_TRIP,
    END_TRIP,
    OPEN_IN_GOOGLE_MAPS,
    OPEN_CALL_DIALOG,
    VIEW_TRIP_IS_LOADING,
    PASSENGER_IS_LOADING,
    DECLINE_TRIP,
    SKIP_TRIP,
    SET_LOCATIONS,
    GET_INITIAL_LOCATION,
    CALCULATE_DISTANCE_TRAVELLED,
    START_CALCULATING_DISTANCE,
    ALL_TRIPS_ON_ROUTE,
    UPDATE_WIDGET_STATUS
} = actionConstants;
const MONTH_OF_THE_YEAR = ["JAN","FEB","MAR","APR", "MAY", "JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

const handleNotification = (date,time) =>{

    let formatedTime = time.split(":");
    let notifDate = new Date(date);
    notifDate.setHours(formatedTime[0]);
    if(formatedTime[1] == "00AM" || formatedTime[1] == "00PM")
    {
        formatedTime[1] = 0;
    }
    else{
        formatedTime[1] = 30;
    }
    notifDate.setMinutes(formatedTime[1]);

    // change to an hour before
    notifDate.setHours(notifDate.getHours()-1);

    PushNotification.localNotificationSchedule({
        channelId: "app-channel",
        title: `Etapath Trip Message`,
        message: `You have a trip booked for ${notifDate.getDate()}/${MONTH_OF_THE_YEAR[notifDate.getMonth()]}/${notifDate.getFullYear()} at ${time}, get ready!`,
        date: new Date(Date.now() + 10 * 1000),
        //date: notifDate,
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
            type: VIEW_TRIP_IS_LOADING,
            payload:{
                isLoading
            }
        })
    }
}

export function passengerIsLoadingAction(passengerIsLoading)
{
    return (dispatch, store)=>{
        dispatch({
            type: PASSENGER_IS_LOADING,
            payload:{
                passengerIsLoading
            }
        })
    }
}

export function getTripDataAction(id)
{
    return (dispatch, store)=>
    {
        dispatch(isLoadingAction(true));

        axios.get(`http://${url}/api_grouped_trips/show?id=${id}`,{
            headers:{
                'Authorization': `Bearer ${store().navigate.userToken}`
            }
        })
        .then(async (res)=>{
            dispatch({
                type: GET_TRIP_DATA,
                payload: {
                    tag: res.data.tag,
                    date: res.data.date,
                    time: res.data.time,
                    trip_id: res.data.trip_id,
                    company: res.data.company,
                    status: res.data.status,
                    total_distance: res.data.total_distance,
                    order: res.data.order,
                    trips: res.data.trips,
                    firstPassenger: res.data.first_passenger,
                    allTripsOnRoute: res.data.all_trips_on_route
                }
            });

            dispatch(isLoadingAction(false));
            if(res.data.status == "on_route")
            {
                dispatch(getPassengerAction());
            }
            //handleNotification(res.data.date,res.data.time);
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}

export function acceptTripAction()
{
    return (dispatch, store)=>
    {
        const trip_id = store().viewTrip.trip_id;
        axios.post(`http://${url}/api_grouped_trips/accept`,
            {
                id: trip_id
            },
            {
                headers:{
                    'Authorization': `Bearer ${store().navigate.userToken}`
                }
            }
        )
        .then(async (res)=>{
            dispatch({
                type: ACCEPT_TRIP,
                payload: {
                    status: res.data.status,
                }
            });

            const {date , time} = store().viewTrip;

            handleNotification(date, time);
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}

export function declineTripAction(navigation)
{
    return (dispatch, store)=>
    {
        const trip_id = store().viewTrip.trip_id;
        axios.post(`http://${url}/api_grouped_trips/decline`,
            {
                id: trip_id
            },
            {
                headers:{
                    'Authorization': `Bearer ${store().navigate.userToken}`
                }
            }
        )
        .then(async (res)=>{
            dispatch({
                type: DECLINE_TRIP,
                payload: {
                    status: res.data.status
                }
            });

            setTimeout(()=>{
                navigation.goBack();
            }, 100);
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}



export function onRouteAction()
{
    return (dispatch, store)=>
    {
        const trip_id = store().viewTrip.trip_id;
        axios.post(`http://${url}/api_grouped_trips/on_route`,
            {
                id: trip_id
            },
            {
                headers:{
                    'Authorization': `Bearer ${store().navigate.userToken}`
                }
            }
        )
        .then(async (res)=>{
            dispatch({
                type: ON_ROUTE,
                payload: {
                    status: res.data.status,
                }
            });

            dispatch(getPassengerAction());
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}


export function getPassengerAction()
{
    return (dispatch, store)=>
    {
        dispatch(passengerIsLoadingAction(true));
        const trip_id = store().viewTrip.trip_id;
        axios.get(`http://${url}/api_grouped_trips/get_passenger?id=${trip_id}`,
            {
                headers:{
                    'Authorization': `Bearer ${store().navigate.userToken}`
                }
            }
        )
        .then(async (res)=>{

            let passenger = res.data.passenger;
            let status = res.data.status;
            let allTripsOnRoute = res.data.all_trips_on_route
            
            if(status == 'trips_completed' || passenger == null)
            {
                dispatch({
                    type: GET_PASSENGER,
                    payload: {
                        passenger: null,
                        passengerStatus: null,
                        passengerName: null,
                        passengerSurname: null,
                        passengerLocation: null,
                        passengerDestination: null,
                        passengerBound: null,
                        allTripsOnRoute,
                        status
                    }
                });

                let widgetState = await getWidgetState();
                if(widgetState != null)
                {
                    widgetPerformAction(WidgetService.TRIPS_COMPLETED, widgetState);
                }
            }
            else
            {
                let trip = store().viewTrip.trips.filter((trip)=> trip.id == passenger );
                dispatch({
                    type: GET_PASSENGER,
                    payload: {
                        passenger,
                        passengerStatus: trip[0].status,
                        passengerName: trip[0].name,
                        passengerSurname: trip[0].surname,
                        passengerLocation: trip[0].location,
                        passengerDestination: trip[0].destination,
                        passengerBound: trip[0].trip_type,
                        allTripsOnRoute,
                        status
                    }
                });
                // update widget
                
                let widgetState = await getWidgetState();
                
                if(widgetState != null)
                {
                    widgetState.passenger = passenger;
                    widgetState.passengerName = trip[0].name;
                    widgetState.passengerSurname = trip[0].surname;
                    widgetState.passengerLocation = trip[0].location;
                    widgetState.passengerDestination = trip[0].destination;
                    widgetState.passengerBound = trip[0].trip_type;
                    widgetState.allTripsOnRoute = allTripsOnRoute,
                    widgetState.status = status;
                    await setWidgetState(widgetState);
                    widgetPerformAction(WidgetService.UPDATE_PASSENGER, widgetState);
                }
            }

            setTimeout(()=>{
                dispatch(passengerIsLoadingAction(false));
            },100);
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}

export function completeTripAction()
{
    console.log("about to complete trip action");
    return (dispatch, store)=>{
        console.log("calling complete trip action");
        const trip_id = store().viewTrip.trip_id;
        const passenger_trip_id = store().viewTrip.passenger
        axios.post(`http://${url}/api_grouped_trips/complete_trip`,
        {
            id: trip_id,
            passenger_trip_id
        },
        {
            headers:{
                'Authorization': `Bearer ${store().navigate.userToken}`
            }
        }
        )
        .then(async (res)=>{

            let passenger =  res.data.passenger;
            let passengerStatus = res.data.passenger_status;

            dispatch({
                type: COMPLETE_TRIP,
                payload: {
                    passenger,
                    passengerStatus
                }
            });

            //check if tracking service is runnning and attempt to start (on pickup and dropoff)
            let trackingState = await TrackingService.getTrackingState();
            if(trackingState == null)
            {
                console.log(" starting distance calculation");
                startCalculatingDistanceAction();
            }
            dispatch(getPassengerAction());
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}

export function skipTripAction()
{
    return (dispatch, store)=>
    {
        const trip_id = store().viewTrip.trip_id;
        const passenger_trip_id = store().viewTrip.passenger
        axios.post(`http://${url}/api_grouped_trips/skip_trip`,
        {
            id: trip_id,
            passenger_trip_id
        },
        {
            headers:{
                'Authorization': `Bearer ${store().navigate.userToken}`
            }
        }
        )
        .then(async (res)=>{

            let passenger =  res.data.passenger;
            let passengerStatus = res.data.passenger_status;

            dispatch({
                type: SKIP_TRIP,
                payload: {
                    passenger,
                    passengerStatus
                }
            });

            let trackingState = await TrackingService.getTrackingState();
            if(trackingState == null)
            {
                console.log(" starting distance calculation");
                startCalculatingDistanceAction();
            }

            setTimeout(()=>{
                dispatch(getPassengerAction());
            },100);
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}

export function endTripAction()
{
    return async (dispatch, store)=>
    {
        const trip_id = store().viewTrip.trip_id;
        let actual_total_distance = 0;
        let trackingState = await getTrackingState();
        if(trackingState != null)
        {
            actual_total_distance = trackingState.distanceTravelled/1000; // convert to km
            console.log("total distance travelled is: " + actual_total_distance);
        }

        axios.post(`http://${url}/api_grouped_trips/complete`,
        {
            id: trip_id,
            actual_total_distance: actual_total_distance + " km"  
        },
        {
            headers:{
                'Authorization': `Bearer ${store().navigate.userToken}`
            }
        }
        )
        .then(async (res)=>{

            let status = res.data.status;

            dispatch({
                type: END_TRIP,
                payload: {
                    status,
                }
            });
            console.log("end trip action being called");
            let widgetState = await getWidgetState();
            if(widgetState != null)
            {
                widgetState.status = status;
                await setWidgetState(widgetState);
                widgetPerformAction(WidgetService.END_TRIP, widgetState);
            }

            console.log ("ending driver tracking service");
            if(trackingState != null)
            {
                stopTrackingService();
            }
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}


export function openInGoogeMapsAction(navigation)
{
    return (dispatch, store)=>
    {
        let { 
            status,
            trips,
            order,
            passengerName,
            passengerSurname,
            passengerLocation,
            passengerDestination,
            allTripsOnRoute,
            passenger,
            trip_id
        } = store().viewTrip;
        let bound = trips[0].trip_type;
        let route = order.split(",").map((id,index)=>{
            let trip = trips.filter((trip)=>(trip.id == id));
            if(bound == "inbound") return (`${trip[0].location_latitude},${trip[0].location_longitude}`);

            return (`${trip[0].destination_latitude},${trip[0].destination_longitude}`)
        });

        let destLatLng = null;
        if(bound == "inbound")
        {
            destLatLng = `${trips[0].destination_latitude},${trips[0].destination_longitude}`;
        }
        else
        {
            destLatLng = route.pop();
            route.unshift(`${trips[0].location_latitude},${trips[0].location_longitude}`);
        }

 
        const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'https://www.google.com/maps/dir/?api=1';     

        let wayLatLng = route.join('|');

        const url = Platform.select({
          ios: `${scheme}@${destLatLng}`,
          android: `${scheme}&travelmode=driving&avoid=t&waypoints=${wayLatLng}&destination=${destLatLng}&dir_action=navigate`
        });


        try{
            setTimeout(()=>{
                Linking.openURL(url);
            },100);

            startWidgetService({
                trip_id,
                passenger,
                passengerName,
                passengerSurname,
                passengerLocation,
                passengerDestination,
                passengerBound: bound,
                status,
                allTripsOnRoute,
                trips
            });
        }catch(e){
            Alert.alert('Cannot open Google Maps is it installed?' );
        }

        /*navigation.push("mapView",{
            url
        })*/

        /*Linking.canOpenURL(url)
        .then(supported=>{
            console.log("linking support : " + supported); 
            if(!supported)
            {
                Alert.alert('supported error: ' + JSON.stringify(supported) );
            }
            else
            {
                setTimeout(()=>{
                    Linking.openURL(url);
                },100);

                startWidgetService({
                    trip_id,
                    passenger,
                    passengerName,
                    passengerSurname,
                    passengerLocation,
                    passengerDestination,
                    passengerBound: bound,
                    status,
                    allTripsOnRoute,
                    trips
                });
                
                dispatch({
                    type: OPEN_IN_GOOGLE_MAPS,
                    payload:{
                        origin: [],
                        waypoints: [],
                        destination:[]
                    }
                })
            }
        });*/       
    }
}

export function openCallDialogAction(contact)
{
    return (dispatch, store)=>
    {
        const scheme = Platform.OS === 'ios' ? 'telprompt:' : 'tel:';  
        const url = `${scheme}${contact}`          

        Linking.canOpenURL(url)
        .then(supported=>{
            if(!supported)
            {
                Alert.alert('Cannot open call dialog')
            }
            else
            {
                Linking.openURL(url);

                dispatch({
                    type: OPEN_CALL_DIALOG,
                    payload:{
                        contactToCall: contact
                    }
                })
            }
        });
    }
}


export function allTripsOnRouteAction()
{
    return (dispatch, store)=>
    {
        const trip_id = store().viewTrip.trip_id;

        axios.post(`http://${url}/api_grouped_trips/all_trips_on_route`,
        {
            id: trip_id,
            all_trips_on_route: "true"
        },
        {
            headers:{
                'Authorization': `Bearer ${store().navigate.userToken}`
            }
        }
        )
        .then(async (res)=>{
            let allTripsOnRoute = res.data.all_trips_on_route;
            dispatch({
                type: ALL_TRIPS_ON_ROUTE,
                payload: {
                    allTripsOnRoute
                }
            });

            let widgetState = await getWidgetState();
            if(widgetState != null)
            {
                widgetState.allTripsOnRoute = allTripsOnRoute;
                await setWidgetState(widgetState);
                widgetPerformAction(WidgetService.UPDATE_PASSENGER, widgetState);
            }

            // start tracking service
            let trackingState = await TrackingService.getTrackingState();
            if(trackingState == null)
            {
                startCalculatingDistanceAction();
            }
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}

export function refreshTripAction()
{
    return (dispatch,store)=>
    {
        const trip_id = store().viewTrip.trip_id;
        if(trip_id != null)
        {
            dispatch(getTripDataAction(trip_id));
        }
    }
}

/**
 * Action handlers
 */

function handleGetTripData(state,action)
{
    return update(state,{
        tag: { $set: action.payload.tag },
        date: { $set: action.payload.date },
        time: { $set: action.payload.time },
        trip_id: { $set: action.payload.trip_id },
        company: { $set: action.payload.company },
        total_distance: { $set: action.payload.total_distance },
        status: { $set: action.payload.status },
        order: { $set: action.payload.order},
        trips: { $set: action.payload.trips },
        passengerIsLoading: { $set: false },
        firstPassenger: { $set: action.payload.firstPassenger },
        allTripsOnRoute: { $set: action.payload.allTripsOnRoute}
    });
}

function handleAcceptTrip(state,action)
{
    return update(state,{
        status: { $set: action.payload.status }
    });
}

function handleDeclineTrip(state,action)
{
    return state;
}

function handleOnRoute(state,action)
{
    return update(state,{
        status: { $set: action.payload.status }
    });
}

function handleGetPassenger(state,action)
{
    return update(state,{
        passenger: { $set: action.payload.passenger },
        passengerStatus: { $set: action.payload.passengerStatus },
        passengerBound: { $set: action.payload.passengerBound },
        passengerName: { $set: action.payload.passengerName },
        passengerSurname: { $set: action.payload.passengerSurname },
        passengerLocation: { $set: action.payload.passengerLocation },
        passengerDestination: { $set: action.payload.passengerDestination },
        status: { $set: action.payload.status}
    });
}

function handleCompleteTrip(state,action)
{
    return update(state,{
        passenger: { $set: action.payload.passenger },
        passengerStatus: { $set: action.payload.passengerStatus }
    });
}

function handleSkipTrip(state,action)
{
    return update(state,{
        passenger: { $set: action.payload.passenger },
        passengerStatus: { $set: action.payload.passengerStatus }
    });
}

function handleEndTrip(state,action)
{
    return update(state,{
        status: { $set: action.payload.status },
        startCalculatingDistance: { $set: action.payload.startCalculatingDistance},
    });
}


function handleOpenInGoogleMaps(state,action)
{
    return state;
}

function handleOpenCallDialog(state,action)
{
    return state;
}

function handleIsLoading (state,action){
    return update(state,{
        isLoading:{ $set: action.payload.isLoading}
    })
}

function handlePassengerIsLoading (state,action){
    return update(state,{
        passengerIsLoading:{ $set: action.payload.passengerIsLoading}
    })
}


function handleSetLocations (state,action){
    return update(state,{
        prevLocation:{ $set: action.payload.prevLocation},
        currentLocation:{ $set: action.payload.currentLocation},
    })
}

function handleGetInitialLocation (state,action){
    return update(state,{
        prevLocation:{ $set: action.payload.prevLocation},
        currentLocation:{ $set: action.payload.currentLocation},
    })
}

function handleAllTripsOnRoute (state,action){
    return update(state,{
        allTripsOnRoute:{ $set: action.payload.allTripsOnRoute},
    })
}

function handleStartCalculatingDistance (state,action){
    return update(state,{
        startCalculatingDistance:{ $set: action.payload.startCalculatingDistance},
    })
}

const ACTION_HANDLERS = {
    GET_TRIP_DATA: handleGetTripData,
    ACCEPT_TRIP: handleAcceptTrip,
    ON_ROUTE: handleOnRoute,
    GET_PASSENGER: handleGetPassenger,
    COMPLETE_TRIP: handleCompleteTrip,
    END_TRIP: handleEndTrip,
    OPEN_IN_GOOGLE_MAPS: handleOpenInGoogleMaps,
    VIEW_TRIP_IS_LOADING: handleIsLoading,
    PASSENGER_IS_LOADING: handlePassengerIsLoading,
    DECLINE_TRIP: handleDeclineTrip,
    SKIP_TRIP: handleSkipTrip,
    SET_LOCATIONS: handleSetLocations,
    GET_INITIAL_LOCATION: handleGetInitialLocation,
    START_CALCULATING_DISTANCE: handleStartCalculatingDistance,
    ALL_TRIPS_ON_ROUTE: handleAllTripsOnRoute,
}

export function ViewTripReducer (state = initialState, action){
    const handler = ACTION_HANDLERS[action.type];
    // if the handler does not exist, just return the state, no changes 
    return handler ? handler(state,action): state;
}