import { getDistance, getPreciseDistance } from 'geolib';
import Geolocation from 'react-native-geolocation-service';
import { Alert, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import apiConstants from '../api/apiConstants';
const { url } = apiConstants;
import { showTracking } from './WidgetService';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";

var trackingWatchId = null;
var checkStartProximityWatchId = null;
var checkEndProximityWatchId = null;

const stopCheckStartProximity = () => {
    Geolocation.clearWatch(checkStartProximityWatchId);
}

const stopCheckEndProximity = () => {
    Geolocation.clearWatch(checkEndProximityWatchId);
}

const stopTracking = () =>{
    Geolocation.clearWatch(trackingWatchId);
}

export const checkStartProximity = async ()  =>  {
    console.log("Tracking service: starting check proximity ====>");
    try {
        
        let permitedFineLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if( permitedFineLocation == true)
        {
            
            checkStartProximityWatchId = Geolocation.watchPosition(
                async(success)=>{
                    
                    const { latitude, longitude } = success.coords;
                    let trackingState = await getTrackingState();
                    let currentLocation = {
                        latitude,
                        longitude
                    }
                    const startProximity = await getPreciseDistance(trackingState.startLocation,currentLocation);
                    console.log("Tracking service: start proximity: " + startProximity);

                    if(startProximity < 400) // 400 meters
                    {
                        stopCheckStartProximity();
                        // set prev location in routing state

                        trackingState.prevLocation = currentLocation;
                        await setTrackingState(trackingState);
                        startTracking();
                        checkEndProximity();
                        showTracking(true);
                    }
                },
                (error)=>{
                    console.log(error);
                },
                {   
                    enableHighAccuracy: true, 
                    forceLocationManager: true,
                    interval: 500,
                    fastestInterval: 200
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
                    let trackingState = await getTrackingState();
                    let currentLocation = {
                        latitude,
                        longitude
                    }
                    const endProximity = await getPreciseDistance(trackingState.endLocation,currentLocation);
                    console.log("Tracking service: end proximity: " + endProximity);

                    if(endProximity < 400) // 400 meters
                    {
                        await stopCheckEndProximity();
                        await stopTracking();
                        await sendTrackingData();
                        showTracking(false);
                        stop();
                    }
                },
                (error)=>{
                    console.log(error);
                },
                {   
                    enableHighAccuracy: true, 
                    forceLocationManager: true,
                    interval: 500,
                    fastestInterval: 200
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


export const startTracking = async () =>{
    try {

        let permitedFineLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if(permitedFineLocation == true)
        {
            trackingWatchId = Geolocation.watchPosition(
                (success)=>{
                    
                    const { latitude, longitude } = success.coords;
                    calculateDistanceTravelled({latitude, longitude});
                },
                (error)=>{
                    console.log(error);
                },
                {   
                    enableHighAccuracy: true, 
                    distanceFilter: 75,
                    forceLocationManager: true,
                    interval: 10000,
                    fastestInterval: 5000
                }
            );
        }
        else
        {
            Alert.alert("Tracking service", "App location permission is not granted, please go to your settings and grant <allow all the time> to enable distance tracking");
        }
        
    } catch (error) {
        console.log(error);
    }
}


export async function calculateDistanceTravelled(currentLocation)
{
    // get tracking state state
    let trackingState = await getTrackingState();
    const { distanceTravelled, prevLocation } = trackingState;

    const pointToPointDist = await getPreciseDistance(prevLocation,currentLocation); 
    let newDistanceTravelled = distanceTravelled + pointToPointDist;

    // update state
    trackingState.distanceTravelled = newDistanceTravelled;
    trackingState.prevLocation = currentLocation;

    setTrackingState(trackingState);
}

export async function start(trip_id)
{
    if (ReactNativeForegroundService.is_running())
    {
        await stop();

        //initialise tracking state
        await initialiseState(trip_id);

        // add new task with the new parameters
        await ReactNativeForegroundService.add_task(() =>{
            checkStartProximity();
        }, 
        {
            delay: 500,
            onLoop: false,
            taskId: "TrackingService",
            onError: (e) => console.log(`Error logging:`, e),
        });

    }
    else
    {
        //initialise tracking state
        await initialiseState(trip_id);

        await ReactNativeForegroundService.add_task(() =>{
            checkStartProximity();
        }, 
        {
            delay: 500,
            onLoop: false,
            taskId: "TrackingService",
            onError: (e) => console.log(`Error logging:`, e),
        });

        ReactNativeForegroundService.start({
            id: 144,
            title: "Etapath Location Service",
            message: "Accessing your location!",
            visibility: "private"
        });
    }
        
}

// set tracking state
export const setTrackingState = (trackingState) =>{
    try{
        AsyncStorage.setItem("trackingState", JSON.stringify(trackingState));
    }
    catch(e)
    {
        console.log("error setting tracking state");
        console.log(e);
    }
}

// get tracking state
export const getTrackingState = async () =>{
    let trackingState = null;
    try{
        trackingState = await AsyncStorage.getItem("trackingState");
        trackingState = JSON.parse(trackingState);
    }
    catch(e)
    {
        console.log("error getting tracking state");
        console.log(e);
    }
    return trackingState;
}

export const removeTrackingState = async () =>{
    try{
        AsyncStorage.removeItem("trackingState");
    }
    catch(e)
    {
        console.log("error removing traking state");
        console.log(e);
    }
}

export const sendTrackingData = async () =>{
    
    // update actual distance travelled on the  database
    const trackingState = await getTrackingState();
    const userToken =  await getUserToken();

    if(userToken != null && trackingState != null)
    {
        let actual_total_distance = `${(trackingState.distanceTravelled/1000).toFixed(1)} km`;
        let trip_id = trackingState.trip_id;

        const response =  await axios.post(`${url}/api_grouped_trips/set_actual_total_distance`,
        {
            id: trip_id,
            actual_total_distance,
        },
        {
            headers:{
                'Authorization': `Bearer ${userToken}`
            }
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
    await setTrackingState({
        trip_id,
        distanceTravelled: 0,
        prevLocation: null,
        startLocation: response.data.start_location,
        endLocation: response.data.end_location
    });
}

export const stop = async () =>{
    await removeTrackingState();
    await stopCheckEndProximity();
    await stopCheckStartProximity();
    await stopTracking();

    console.log("is running route service" +  ReactNativeForegroundService.is_task_running("RouteService"));
    if(ReactNativeForegroundService.is_task_running("TrackingService"))
    {
        // remove the task
        await ReactNativeForegroundService.remove_task("TrackingService");
    }

    let tasks = await ReactNativeForegroundService.get_all_tasks();
    console.log("Tracking service: " + JSON.stringify(Object.keys(tasks)));
    if(tasks && Object.keys(tasks).length == 0)
    {
        ReactNativeForegroundService.stop();
    }
}
