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
    completeTrips: [],
    incompleteTrips:[],
    vehicle: null,
    isLoading: false,
    name: null,
    surname: null,
    startDate: null
};

 /**
 * Action types
 */

const {
    GET_GROUPED_TRIPS,
    TRIPS_IS_LOADING
} = actionConstants;

const MONTH_OF_THE_YEAR = ["Jan","Feb","Mar","Apr", "May", "Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


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
export const getGroupedTripsAction = () =>{
    return (dispatch, store)=>{

        dispatch(isLoadingAction(true));

        axios.get(`http://${url}/api_dashboard/index`,{
            headers:{
                'Authorization': `Bearer ${store().navigate.userToken}`
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

const ACTION_HANDLERS = {
    GET_GROUPED_TRIPS: handleGetGroupedTrips,
    TRIPS_IS_LOADING: handleIsLoading
}

export function TripsReducer (state = initialState, action){
    const handler = ACTION_HANDLERS[action.type];
    // if the handler does not exist, just return the state, no changes 
    return handler ? handler(state,action): state;
}