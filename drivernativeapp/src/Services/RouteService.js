import Geolocation from 'react-native-geolocation-service';
import { Alert, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import apiConstants from '../api/apiConstants';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
const { url } = apiConstants;
// inititilise location tracking
var watchId = null;

export const registerListeners = async ( trip_id) =>{
    try {

        let permitedFineLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if( permitedFineLocation == true)
        {
            // get initial location
            Geolocation.getCurrentPosition(
                (success)=>{

                    //console.log (" started calcuating route =====> ");

                    const { latitude, longitude } = success.coords;
                    // set initial tracking state, current location as previous location
                    setRouteState({
                        route: [`${latitude},${longitude}`],
                        trip_id
                    });

                    watchId = Geolocation.watchPosition(
                        (success)=>{
                            
                            const { latitude, longitude } = success.coords;
                            recordRouteTravelled({latitude, longitude});
                        },
                        (error)=>{
                            console.log(error);
                        },
                        {   
                            enableHighAccuracy: true, 
                            distanceFilter: 75,
                            forceLocationManager: false,
                            interval: 10000,
                            fastestInterval: 5000
                        }
                    );
                },
                (error)=>{
                    console.log(error);
                },
                {
                    enableHighAccuracy: true, 
                    distanceFilter: 50,
                    forceLocationManager: false,
                }
            );
        }
        else
        {
            Alert.alert("Device location", "App location permission is not granted, please go to your settings and grant <allow all the time> to enable distance tracking");
        }
        
    } catch (error) {
        console.log(error);
    }
}

export const removeListeners = () =>{
    // stop observing
    Geolocation.clearWatch(watchId);
    // clear previous listeners  if any
    Geolocation.stopObserving();
}

export async function recordRouteTravelled(currentLocation)
{
    // get tracking state state
    let routeState = await getRouteState();

    if(routeState != null)
    {
        //console.log("Route location: " + `${currentLocation.latitude},${currentLocation.longitude}`);
        routeState.route.push(`${currentLocation.latitude},${currentLocation.longitude}`);
        setRouteState(routeState);
    }
}

export async function startRecordingRouteAction(trip_id)
{
    const routeState = await getRouteState();
    if(routeState == null)
    {
        if (ReactNativeForegroundService.is_running() && ReactNativeForegroundService.is_task_running("RoutingService"))
        {
            // if service is running and task is running remove the task
            await ReactNativeForegroundService.remove_task("RoutingService");

            // add new task with the new parameters
            await ReactNativeForegroundService.add_task(() =>{
                registerListeners(trip_id);
            }, 
            {
                delay: 2000,
                onLoop: false,
                taskId: "RoutingService",
                onError: (e) => console.log(`Error logging routing service:`, e),
            });

        }
        else
        {
            await ReactNativeForegroundService.add_task(() =>{
                registerListeners(trip_id);
            }, 
            {
                delay: 2000,
                onLoop: false,
                taskId: "RoutingService",
                onError: (e) => console.log(`Error logging routing service:`, e),
            });

            ReactNativeForegroundService.start({
                id: 144,
                title: "Etapath Location Service",
                message: "Accessing your location!",
                visibility: "private"
            });
        }
    }


    
}

// set tracking state
export const setRouteState = (routeState) =>{
    try{
        AsyncStorage.setItem("routeState", JSON.stringify(routeState));
    }
    catch(e)
    {
        console.log("error setting route state");
        console.log(e);
    }
}

// get tracking state
export const getRouteState = async () =>{
    let routeState = null;
    try{
        routeState = await AsyncStorage.getItem("routeState");
        routeState = JSON.parse(routeState);
    }
    catch(e)
    {
        console.log("error getting route state");
        console.log(e);
    }
    return routeState;
}

export const removeRouteState = async () =>{
    try{
        AsyncStorage.removeItem("routeState");
    }
    catch(e)
    {
        console.log("error removing route state");
        console.log(e);
    }
}

export const resetRouteService = async () =>{
    //console.log("resetting route service");
    try {
        await removeListeners();
        await removeRouteState();
    }
    catch(e){
        console.log("failed to reset route service");
        console.log(e);
    }
    
}

export const stopRouteService = async () =>{
    
    // remove route listeners
    removeListeners();

    // update actual distance travelled on the  database
    const routeState = await getRouteState();
    const userToken =  await getUserToken();

    if(userToken != null && routeState != null)
    {
        let trip_id = routeState.trip_id;
        let route = routeState.route.join('|');

        axios.post(`${url}/api_grouped_trips/set_route`,
        {
            id: trip_id,
            route
        },
        {
            headers:{
                'Authorization': `Bearer ${userToken}`
            }
        }
        )
        .then(async (res)=>{
            removeRouteState();
            ReactNativeForegroundService.stop();
        })
        .catch((e)=>{
            console.log(e);
        });
    }
}

const getUserToken = async () =>{
    let userToken = null;
    try{
        userToken = await AsyncStorage.getItem('userToken');
    }
    catch(e){
        console.log(e);
    }

    return userToken;
} 

