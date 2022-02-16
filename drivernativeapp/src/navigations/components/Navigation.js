import React,{useEffect,useState, useMemo} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from "@react-navigation/drawer"
import { ActivityIndicator, View,Text } from 'react-native';

import { AuthContext } from '../../components/context';
import { NativeBaseProvider, extendTheme} from 'native-base'

const MainStack = createNativeStackNavigator();
const AuthStack= createNativeStackNavigator();
const Drawer = createDrawerNavigator();

import LoginContainer from '../../routes/login/containers/LoginContainer'
import TripsContainer from '../../routes/trips/containers/TripsContainer';
import ViewTripContainer from '../../routes/viewtrip/containers/ViewTripContainer';
import { colorTheme } from '../../components/context';
import CustomDrawerContent from './CustomDrawerContent';
import Header from '../../components/Header';
import TermsAndConditionsContainer from '../../routes/termsandconditions/containers/TermsAndConditionsContainer';
const theme = extendTheme({colors: colorTheme});


const Navigation = ({
    loginState,
    logoutAction,
    loginAction,
    retrieveTokenAction,
    name,
    surname,
    startDate,
    status
}) => {
    const authContext = useMemo(()=>({
        login:(email, password)=>{
            loginAction(email, password);
        },
        logout:()=>{
            logoutAction();
        }
    }));

    function root(){
        return(
            <Drawer.Navigator
                initialRouteName='trips'
                drawerContent={(props)=> <CustomDrawerContent {...props} 
                    surname = {surname} 
                    name = {name} 
                    startDate = {startDate}
                    />}
                screenOptions={{
                    drawerPosition:"right"
                }}
            >
                <Drawer.Screen 
                    name="trips" 
                    component={TripsContainer}
                    options={{
                        headerShown: true,
                        header: props => <Header 
                            {...props}
                            status={"alwayShow"}
                        />
                    }} 
                />
            </Drawer.Navigator>
        );
    }

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
            {
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
                            <MainStack.Navigator
                                initialRouteName='trips'
                            >
                                <MainStack.Screen 
                                    name = 'root' 
                                    component = {root}
                                    options = {{
                                        headerShown: false,
                                    }}
                                />
                                <MainStack.Screen 
                                    name = 'viewTrip' 
                                    component = {ViewTripContainer}
                                    options = {{
                                        headerShown:true,
                                        header: props => <Header 
                                            {...props} showBackIcon={true}
                                            status={status} 
                                        />
                                    }}
                                />
                                {
                                    <MainStack.Screen 
                                        name = 'terms' 
                                        component = {TermsAndConditionsContainer}
                                        options = {{
                                            headerShown:true,
                                            header: props => <Header {...props} showBackIcon={true} />
                                        }}
                                    />
                                }
                                {
                                    /*<MainStack.Screen 
                                        name = 'viewTrip' 
                                    name = 'viewTrip' 
                                        name = 'viewTrip' 
                                        component = {ViewTripContainer}
                                        options = {{
                                            headerShown:true,
                                            header: props => <Header navigation={props.navigation} showBackIcon={true}/>
                                        }}
                                    />*/
                                }
                            </MainStack.Navigator>
                        }
                    </NativeBaseProvider>
                </NavigationContainer>
            }
        </AuthContext.Provider>
    )
}

export default Navigation