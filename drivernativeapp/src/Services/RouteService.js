import Geolocation from 'react-native-geolocation-service';
import { Alert, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import apiConstants from '../api/apiConstants';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { getPreciseDistance } from 'geolib';
const { url } = apiConstants;
// inititilise location tracking
var recordingWatchId = null;
var checkStartProximityWatchId = null;
var checkEndProximityWatchId = null;

const stopCheckStartProximity = () => {
    Geolocation.clearWatch(checkStartProximityWatchId);
}

const stopCheckEndProximity = () => {
    Geolocation.clearWatch(checkEndProximityWatchId);
}

const stopRecording = () =>{
    Geolocation.clearWatch(recordingWatchId);
}

export const checkStartProximity = async ()  =>  {
    //console.log("Route service: starting check proximity ====>");
    try {
        
        let permitedFineLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if( permitedFineLocation == true)
        {
            
            checkStartProximityWatchId = Geolocation.watchPosition(
                async(success)=>{
                    
                    const { latitude, longitude } = success.coords;
                    let routeState = await getRouteState();
                    let currentLocation = {
                        latitude,
                        longitude
                    }
                    const startProximity = await getPreciseDistance(routeState.startLocation,currentLocation);
                    //console.log("route service: start proximity: " + startProximity);

                    if(startProximity < 150) // 150 meters
                    {
                        stopCheckStartProximity();
                        startRecording();
                        checkEndProximity();
                        routeState.startTime = Date.now();
                        routeState.started = true;
                        await setRouteState(routeState);
                    }
                },
                (error)=>{
                    console.log(error);
                },
                {   
                    enableHighAccuracy: true, 
                    forceLocationManager: true,
                    interval: 5000, // 5 seconds
                    fastestInterval: 4000, // 4 seconds
                    distanceFilter: 0,
                }
            );
        }
        else
        {
            Alert.alert("Device location", "App location permission is not granted, please go to your settings and grant <allow all the time> to enable distance tracking");
        }
    } catch (error) {
        Alert.alert("Device location", "Error: starting --checkStartCheckProximity");
    }
}

export const checkEndProximity = async ()  =>  {
    try {
        
        let permitedFineLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if( permitedFineLocation == true)
        {
            checkEndProximityWatchId = Geolocation.watchPosition(
                async(success)=>{
                    
                    const { latitude, longitude } = success.coords;
                    let routeState = await getRouteState();
                    let currentLocation = {
                        latitude,
                        longitude
                    }
                    const endProximity = await getPreciseDistance(routeState.endLocation,currentLocation);
                    //console.log("route service: end proximity: " + endProximity);

                    if(endProximity < 150) // 100 meters
                    {
                        await stopCheckEndProximity();
                        await stopRecording();
                        routeState.ended=true;
                        await setRouteState(routeState);
                        await sendRouteData();
                        stop();
                    }
                },
                (error)=>{
                    console.log(error);
                },
                {   
                    enableHighAccuracy: true, 
                    forceLocationManager: true,
                    interval: 5000, // 5 seconds
                    fastestInterval: 4000, // 4 seconds
                    distanceFilter: 0,
                }
            );
        }
        else
        {
            Alert.alert("Device location", "App location permission is not granted, please go to your settings and grant <allow all the time> to enable distance tracking");
        }
    } catch (error) {
        Alert.alert("Device location", "Error: starting --checkStartCheckProximity");
    }
}

export const  startRecording = async () =>{
    try {

        let permitedFineLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if( permitedFineLocation == true)
        {
            recordingWatchId = Geolocation.watchPosition(
                (success)=>{
                    const { latitude, longitude } = success.coords;
                    recordRouteTravelled({latitude, longitude});
                },
                (error)=>{
                    console.log(error);
                },
                {   
                    enableHighAccuracy: true, 
                    distanceFilter: 30, //30 meters
                    forceLocationManager: true,
                    interval: 5000, // 5 seconds
                    fastestInterval: 4000, // 4 seconds
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

export async function recordRouteTravelled(currentLocation)
{
    // get tracking state state
    let routeState = await getRouteState();
    //console.log("Route service location: " + `${currentLocation.latitude},${currentLocation.longitude}`);
    routeState.route.push(`${currentLocation.latitude},${currentLocation.longitude}`);
    await setRouteState(routeState);
}



export async function start(trip_id)
{    
    if (ReactNativeForegroundService.is_running())
    {
        if(ReactNativeForegroundService.is_task_running("RoutingService"))
        {
            // remove the task
            await ReactNativeForegroundService.remove_task("RoutingService");
        }

        //initialise route state
        await initialiseState(trip_id);
        // add new task with the new parameters
        await ReactNativeForegroundService.add_task(() =>{
            checkStartProximity();
        }, 
        {
            delay: 500,
            onLoop: false,
            taskId: "RoutingService",
            onError: (e) => console.log(`Error logging routing service:`, e),
        });
    }
    else
    {
        //initialise route state
        await initialiseState(trip_id);

        // add new task with the new parameters
        await ReactNativeForegroundService.add_task(() =>{
            checkStartProximity();
        }, 
        {
            delay: 500,
            onLoop: false,
            taskId: "RoutingService",
            onError: (e) => console.log(`Error logging routing service:`, e)
        });

        ReactNativeForegroundService.start({
            id: 144,
            title: "Etapath Location Service",
            message: "Accessing your location!",
            visibility: "private"
        });
    
    }
}

export const stop = async () =>{
    await stopCheckEndProximity();
    await stopCheckStartProximity();
    await stopRecording();

    let routeState = await getRouteState();

    if(routeState != null && routeState.started == true && routeState.ended == false)
    {
        // if the end proximity trigger did not fire, send route date
        //console.log("end poximity for route did not trigger");
        await sendRouteData()
    }
    await removeRouteState();

    //console.log("is running tracking service " + ReactNativeForegroundService.is_task_running("TrackingService"));

    if(ReactNativeForegroundService.is_task_running("RoutingService"))
    {
        // remove the task
        await ReactNativeForegroundService.remove_task("RoutingService");
    }

    let tasks = await ReactNativeForegroundService.get_all_tasks();
    //console.log("route service: " + JSON.stringify(Object.keys(tasks)));

    if(tasks && Object.keys(tasks).length == 0)
    {
        //console.log("stopping in route service");
        ReactNativeForegroundService.stop();
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

export const sendRouteData = async () =>{
    
    // update actual distance travelled on the  database
    const routeState = await getRouteState();
    const userToken =  await getUserToken();
    //console.log("setting trip route now ====> " + JSON.stringify(routeState));

    if(userToken != null && routeState != null)
    {
        let trip_id = routeState.trip_id;
        let route = routeState.route.join('|');
        let duration = "0hr 0min";
        if(routeState.startTime != null)
        {
           duration = await getDuration(routeState.startTime);
        }
        const response = await axios.post(`${url}/api_grouped_trips/set_route`,
                                {
                                    id: trip_id,
                                    route,
                                    duration
                                },
                                {
                                    headers:{
                                        'Authorization': `Bearer ${userToken}`
                                    }
                                });
        //console.log("Trip route has been set ===================> ");

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

const getDuration  = (startTime) =>{
    let diff = (Math.abs(Date.now() - startTime))/(60*60* 1000);

    let hours = Math.floor(diff);
    let minutes = Math.round((diff - hours) * 60); // convert to minutes
    return `${hours}hr ${minutes}min`
}

const initialiseState = async (trip_id) => {
    const userToken =  await getUserToken();
    const response = await axios.post(`${url}/api_grouped_trips/trip_route_data`,
                        {
                            id: trip_id,
                        },
                        {
                            headers:{
                                'Authorization': `Bearer ${userToken}`
                            }
                        });

    await setRouteState({
        trip_id,
        route: [],
        startLocation: response.data.start_location,
        endLocation: response.data.end_location,
        startTime: null,
        started: false,
        ended: false
    });
}

