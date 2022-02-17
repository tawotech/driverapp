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
}

 /**
 * Action types
 */

const {

} = actionConstants;


/**
 * Actions
 */


/**
 * Action handlers
 */


const ACTION_HANDLERS = {
    
}

export function MapViewReducer (state = initialState, action){
    const handler = ACTION_HANDLERS[action.type];
    // if the handler does not exist, just return the state, no changes 
    return handler ? handler(state,action): state;
}