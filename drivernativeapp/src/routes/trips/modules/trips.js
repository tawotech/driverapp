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
    vehicle: null
};

 /**
 * Action types
 */

const {
    GET_GROUPED_TRIPS
} = actionConstants;

/**
 * Actions
 */
export const getGroupedTripsAction = () =>{
    return (dispatch, store)=>{
        axios.get(`http://${url}/api_dashboard/index`,{
            headers:{
                'Authorization': `Bearer ${store().navigate.userToken}`
            }
        })
        .then(async (res)=>{
            dispatch({
                type: GET_GROUPED_TRIPS,
                payload: {
                    vehicle: res.data.current_user.vehicle,
                    completeTrips: res.data.complete_trips,
                    incompleteTrips: res.data.incomplete_trips
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
function handleGetGroupedTrips (state,action){
    return update(state,{
        vehicle:{ $set: action.payload.vehicle},
        completeTrips:{ $set: action.payload.completeTrips},
        incompleteTrips:{ $set: action.payload.incompleteTrips}
    })
}
const ACTION_HANDLERS = {
    GET_GROUPED_TRIPS: handleGetGroupedTrips
}

export function TripsReducer (state = initialState, action){
    const handler = ACTION_HANDLERS[action.type];
    // if the handler does not exist, just return the state, no changes 
    return handler ? handler(state,action): state;
}