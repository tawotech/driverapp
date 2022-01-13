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
    userToken: null
};

 /**
 * Action types
 */

const {
    LOGIN,
    LOGOUT,
    RETRIEVE_TOKEN
} = actionConstants;

const {url} = apiConstants;

export const loginAction = (email, password)=>{     
    return (dispatch, store)=>{
        let userToken = '';
        axios.post(`http://${url}/sessions`,{
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
            console.log(e);
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
    console.log("in handle login");
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

const ACTION_HANDLERS = {
    LOGIN: handleLogin,
    LOGOUT: handleLogout,
    RETRIEVE_TOKEN: handleRetrieveToken
}

export function NavigationReducer (state = initialState, action){
    const handler = ACTION_HANDLERS[action.type];
    // if the handler does not exist, just return the state, no changes 
    return handler ? handler(state,action): state;
}