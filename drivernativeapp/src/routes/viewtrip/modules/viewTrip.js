/**
 * contains all actions and action handlers
 */

 import update from 'react-addons-update'
 import actionConstants from './actionConstants'
 import axios from 'axios';
 import apiConstants from '../../../api/apiConstants'

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
    isLoading: true,
    order: '',
    passenger: null,
    passengerName: null,
    passengerSurname: null,
    passengerLocation: null,
    passengerDestination: null,
    passengerBound: null,
    passengerStatus: null
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
    END_TRIP
} = actionConstants;

/**
 * Actions
 */
export function getTripDataAction(id)
{
    return (dispatch, store)=>
    {
        axios.get(`http://${url}/api_grouped_trips/show?id=${id}`,{
            headers:{
                'Authorization': `Bearer ${store().navigate.userToken}`
            }
        })
        .then(async (res)=>{
            console.log(res);
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
                }
            });
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
        const trip_id = store().viewTrip.trip_id;
        console.log(" trip id is: " + trip_id);
        axios.get(`http://${url}/api_grouped_trips/get_passenger?id=${trip_id}`,
            {
                headers:{
                    'Authorization': `Bearer ${store().navigate.userToken}`
                }
            }
        )
        .then(async (res)=>{

            let passenger = res.data.passenger;
            let status = res.data.status
            
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
                        status
                    }
                });
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
                        status
                    }
                });
            }
            
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}

export function completeTripAction()
{
    return (dispatch, store)=>
    {
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
            console.log(res.data);

            let passenger =  res.data.passenger;
            let passengerStatus = res.data.passenger_status;

            dispatch({
                type: COMPLETE_TRIP,
                payload: {
                    passenger,
                    passengerStatus
                }
            });

            setTimeout(()=>{
                dispatch(getPassengerAction());
            },250);
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}

export function endTripAction()
{
    return (dispatch, store)=>
    {
        const trip_id = store().viewTrip.trip_id;
        axios.post(`http://${url}/api_grouped_trips/complete`,
        {
            id: trip_id,
        },
        {
            headers:{
                'Authorization': `Bearer ${store().navigate.userToken}`
            }
        }
        )
        .then(async (res)=>{
            console.log(res.data);

            let status = res.data.status;

            dispatch({
                type: END_TRIP,
                payload: {
                    status
                }
            });
        })
        .catch((e)=>{
            console.log(e);
        });
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
        isLoading: { $set: false }
    });
}

function handleAcceptTrip(state,action)
{
    return update(state,{
        status: { $set: action.payload.status }
    });
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

function handleEndTrip(state,action)
{
    return update(state,{
        status: { $set: action.payload.status },
    });
}

const ACTION_HANDLERS = {
    GET_TRIP_DATA: handleGetTripData,
    ACCEPT_TRIP: handleAcceptTrip,
    ON_ROUTE: handleOnRoute,
    GET_PASSENGER: handleGetPassenger,
    COMPLETE_TRIP: handleCompleteTrip,
    END_TRIP: handleEndTrip
}

export function ViewTripReducer (state = initialState, action){
    const handler = ACTION_HANDLERS[action.type];
    // if the handler does not exist, just return the state, no changes 
    return handler ? handler(state,action): state;
}