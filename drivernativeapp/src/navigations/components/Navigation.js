import React,{useEffect,useState, useMemo} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthContext } from '../../components/context';
import { NativeBaseProvider, extendTheme} from 'native-base'

const MainStack = createNativeStackNavigator();
const AuthStack= createNativeStackNavigator();

import LoginContainer from '../../routes/login/containers/LoginContainer'
import TripsContainer from '../../routes/trips/containers/TripsContainer';
import ViewTripContainer from '../../routes/viewtrip/containers/ViewTripContainer';
import { colorTheme } from '../../components/context';
const theme = extendTheme({colors: colorTheme})

export default function Navigation({
    loginState,
    logoutAction,
    loginAction,
    retrieveTokenAction
}){
    const authContext = useMemo(()=>({
        login:(email, password)=>{
            loginAction(email, password);
        },
        logout:()=>{
            logoutAction();
        }
    }))

    useEffect(()=>{
        setTimeout(()=>{
            retrieveTokenAction();
        }, 2000);
    },[]);
 
    if (loginState.isLoading)
    {
        return(
            <View style = {{flex: 1, justifyContent: 'center', alignItems: "center"}}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    return(
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                <NativeBaseProvider theme={theme}>
                    { loginState.userToken == null ? 
                        <AuthStack.Navigator>
                            <AuthStack.Screen 
                                name='login' 
                                component = {LoginContainer}
                                options = {{
                                    headerShown:false
                                }}
                            />
                        </AuthStack.Navigator>
                        :
                        <MainStack.Navigator>
                            <MainStack.Screen 
                                name = 'trips' 
                                component = {TripsContainer}
                                options = {{
                                    headerShown:false
                                }}
                            />
                            <MainStack.Screen 
                                name = 'viewTrip' 
                                component = {ViewTripContainer}
                                options = {{
                                    headerShown:false
                                }}
                            />
                        </MainStack.Navigator>
                    }
                </NativeBaseProvider>
            </NavigationContainer>
        </AuthContext.Provider>
    )
}