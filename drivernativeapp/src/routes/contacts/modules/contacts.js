/**
 * contains all actions and action handlers
 */

 import update from 'react-addons-update'
 import actionConstants from './actionConstants'
 import axios from 'axios';
 import apiConstants from '../../../api/apiConstants';
 import { Linking } from 'react-native';
 const {url} = apiConstants;

 // login initial state
const initialState = {
    allContacts: [],
    etapathSites: [],
    fleets: [],
    emergency: []
};

 /**
 * Action types
 */

 
const {
    GET_CONTACTS,
    OPEN_CALL_DIALOG_CONTACTS,
    OPEN_SEND_EMAIL
} = actionConstants;

/**
 * Actions
 */

export const getContacts = ()  =>{
    return async (dispatch, store)=>{

        let token = await store().navigate.userToken;

        axios.get(`${url}/api_contacts/index`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async (res)=>{
            const { all_contacts, etapath_sites, fleets, emergency} = res.data;
            dispatch({
                type: GET_CONTACTS,
                payload: {
                    allContacts: all_contacts,
                    etapathSites: etapath_sites,
                    fleets,
                    emergency
                }
            });
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}

export function openCallDialogAction(contact) {
    return (dispatch, store) => {
        const scheme = Platform.OS === 'ios' ? 'telprompt:' : 'tel:';
        const url = `${scheme}${contact}`

        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Cannot open call dialog')
                }
                else {
                    Linking.openURL(url);

                    dispatch({
                        type: OPEN_CALL_DIALOG_CONTACTS,
                        payload: {
                            contactToCall: contact
                        }
                    })
                }
            });
    }
}

export function openSendEmailAction(email) {
    return (dispatch, store) => {
        const scheme = 'mailto:';
        const url = `${scheme}${email}`

        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Cannot open email')
                }
                else {
                    Linking.openURL(url);

                    dispatch({
                        type: OPEN_SEND_EMAIL,
                        payload: {
                            emailToSend: email
                        }
                    })
                }
            });
    }
}

/**
 * Action handlers
 */

function handleGetContacts (state, action,) {
    return update( state,{
        allContacts: { $set: action.payload.allContacts },
        etapathSites: { $set: action.payload.etapathSites },
        fleets: { $set: action.payload.fleets },
        emergency: { $set: action.payload.emergency }
    })
}

function handleOpenCallDialog(state, action) {
    return state;
}

function handleOpenSendEmail(state, action) {
    return state;
}

const ACTION_HANDLERS = {
    GET_CONTACTS: handleGetContacts
}

export function ContactsReducer (state = initialState, action){
    const handler = ACTION_HANDLERS[action.type];
    // if the handler does not exist, just return the state, no changes 
    return handler ? handler(state,action): state;
}