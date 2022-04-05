/**
 * contains all actions and action handlers
 */

 import update from 'react-addons-update'
 import AsyncStorage from '@react-native-community/async-storage';
 import actionConstants from './actionConstants'
 import apiConstants from '../../api/apiConstants'
 import axios from 'axios';

 // login initial state
const initialState = {
    isLoading: true,
    userToken: null,
    fcmToken: null,
    showMessageBox: false, 
    message: ""
};

 /**
 * Action types
 */

const {
    LOGIN,
    LOGOUT,
    RETRIEVE_TOKEN,
    SAVE_FCM_TOKEN,
    SET_SHOW_MESSAGE_BOX
} = actionConstants;

const {url} = apiConstants;

export const loginAction = (email, password)=>{     
    return (dispatch, store)=>{
        let userToken = '';
        axios.post(`${url}/sessions`,{
            email,
            password
        })
        .then(async (res)=>{
            if(res.data && res.data.jwt != null)
            {
                userToken = res.data.jwt
            }
            try {
                await AsyncStorage.setItem('userToken',userToken);
                dispatch({
                    type: LOGIN,
                    payload:{
                        userToken: userToken == '' ? null : userToken,
                        isLoading: false
                    }
                });
            }
            catch(e){
                console.log(e);
            }
        })
        .catch((e)=>{
            let status = null;
            
            if((e.response && (e.response.status == 401)) || e.status == 401 )
            {
                status = 401;
            }
            dispatch({
                type: SET_SHOW_MESSAGE_BOX,
                payload:{
                    message: status == 401 ? "Incorrect email or password" : e.message,
                    showMessageBox: true
                }
            })
        });
    }
   
}

export const logoutAction = () =>{
    return async (dispatch, store)=>{
        try{
            await AsyncStorage.setItem('userToken','');
        }
        catch(e){
            console.log(e);
        }

        // do not assume setting token to null succeded
        let userToken = '';
        try{
            userToken  = await AsyncStorage.getItem('userToken');
        }
        catch(e)
        {
            console.log(e);
        }
        dispatch({
            type: LOGOUT,
            payload:{
                userToken: userToken == '' ? null : userToken,
                isLoading: false
            }
        });
    }
}

export const saveFcmTokenAction = ({token})=>{
    return async (dispatch, store)=>{
        let fcmToken = '';
        try{
            await AsyncStorage.setItem('fcmToken',token);
        }
        catch(e){
            console.log(e);
        }

        try{
            fcmToken = await AsyncStorage.getItem('fcmToken');
        }
        catch(e){
            console.log(e);
        }

        dispatch({
            type: SAVE_FCM_TOKEN,
            payload:{
                fcmToken
            }
        });
    }
}



export const retrieveTokenAction = (userToken) =>{

    return async (dispatch, store)=>{
        let userToken = '';
        try{
            userToken = await AsyncStorage.getItem('userToken');
        }
        catch(e){
            console.log(e);
        }

        dispatch({
            type: RETRIEVE_TOKEN,
            payload:{
                userToken: userToken == '' ? null : userToken,
                isLoading: false
            }
        });
    }
}

export const setShowMessageBox = (show, message) =>{
    return (dispatch,store)=>{

        dispatch({
            type: SET_SHOW_MESSAGE_BOX,
            payload:{
                showMessageBox: show,
                message
            }
        });
    }
} 


/**
 * 
 * Ation handlers
 */

function handleLogout(state, action){
    return update( state,{
        userToken: { $set: null },
        isLoading: { $set: false }
    })
}

function handleLogin(state, action){
    return update( state,{
        userToken:{ $set: action.payload.userToken },
        isLoading: { $set: false }
    })
}

function handleRetrieveToken(state, action)
{
    return update( state,{
        userToken: { $set: action.payload.userToken } ,
        isLoading: { $set: false }
    })
}

function handleSaveFcmToken(state, action)
{
    return update( state,{
        fcmToken: { $set: action.payload.fcmToken } ,
    })
}

function handleSetShowMessageBox (state,action){
    return update(state,{
        showMessageBox:{ $set: action.payload.showMessageBox},
        message:{ $set: action.payload.message},
    })
}

const ACTION_HANDLERS = {
    LOGIN: handleLogin,
    LOGOUT: handleLogout,
    RETRIEVE_TOKEN: handleRetrieveToken,
    SAVE_FCM_TOKEN: handleSaveFcmToken,
    SET_SHOW_MESSAGE_BOX:handleSetShowMessageBox

}

export function NavigationReducer (state = initialState, action){
    const handler = ACTION_HANDLERS[action.type];
    // if the handler does not exist, just return the state, no changes 
    return handler ? handler(state,action): state;
}