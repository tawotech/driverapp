import { getDistance, getPreciseDistance } from 'geolib';
import Geolocation from 'react-native-geolocation-service';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import apiConstants from '../api/apiConstants';
const { url } = apiConstants;
import { showTracking } from './WidgetService';
// inititilise location tracking

var watchId = null; 

export const registerListeners = async ( startLocation, endLocation, trip_id) =>{
    try {

        let permitedFineLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        let permitedBackgroundLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
            
        if( permitedFineLocation == true && permitedBackgroundLocation == true)
        {
            // get initial location
            Geolocation.getCurrentPosition(
                (success)=>{
                    const { latitude, longitude } = success.coords;
                    // set initial tracking state, current location as previous location
                    setTrackingState({
                        prevLocation: {
                            latitude,
                            longitude
                        },
                        distanceTravelled: 0,
                        startedTracking: false,
                        endedTracking: false,
                        startLocation,
                        endLocation,
                        trip_id,
                        route: []
                    });

                    watchId = Geolocation.watchPosition(
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
            console.log("Device location access required: " + permited);
            Alert.alert("Device location", "App location permission is not granted, please go to your settings and grant <allow all the time> to enable distance tracking");
        }
        
    } catch (error) {
        console.log(error);
    }
}

export const removeListeners = () =>{
    // stop observing
    //Geolocation.stopObserving();
    console.log("watch id is: " + watchId);
    Geolocation.clearWatch(watchId);
}

export async function calculateDistanceTravelled(currentLocation)
{
    // get tracking state state
    let trackingState = await getTrackingState();

    if(trackingState != null && trackingState.endedTracking == true)
    {
        // remove listeners here
        removeListeners();
        stopTrackingService();
        return;
    }

    // check for startLocation proximity
    if(trackingState != null && trackingState.startedTracking == false)
    {
        const startProximity = await getPreciseDistance(trackingState.startLocation,currentLocation);
        //console.log("start proximity: " + startProximity);

        if(startProximity < 400) // set proximity check to 100 meters
        {
            // set started tracking to true
            trackingState.startedTracking = true;
            // keep track of the prevLocation
            trackingState.route.push(`${trackingState.prevLocation.latitude},${trackingState.prevLocation.longitude}`);
            trackingState.prevLocation = currentLocation;
            //console.log("tracking state: " + JSON.stringify(trackingState));
            //Alert.alert("Tracking Service", "Tracking Service has started");
            //console.log("tracking started");
            showTracking(true);

        }
    }

    if (trackingState != null && trackingState.startedTracking == true && trackingState.endedTracking == false)
    {
        const { distanceTravelled, prevLocation } = trackingState;

        const pointToPointDist = await getPreciseDistance(prevLocation,currentLocation); 
        let newDistanceTravelled = distanceTravelled + pointToPointDist;

        // update state
        trackingState.distanceTravelled = newDistanceTravelled;
        trackingState.prevLocation = currentLocation;
        trackingState.route.push(`${currentLocation.latitude},${currentLocation.longitude}`);

        //console.log("distance: " + newDistanceTravelled)
        // check for endLocation proximity
        const endProximity = await getPreciseDistance(trackingState.endLocation,currentLocation);
        //console.log("end proximity: " + endProximity + " distance moved: " +  pointToPointDist + " accumulated " + newDistanceTravelled);
        if(endProximity < 400)
        {
            trackingState.endedTracking = true;
        }
    }


    if(trackingState != null)
    {
        //console.log("setting tracking state");
        setTrackingState(trackingState);
    }
}

export function startCalculatingDistanceAction(startLocation, endLocation, trip_id)
{
    registerListeners(startLocation,endLocation,trip_id);
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

export const stopTrackingService = async () =>{
    
    // update actual distance travelled on the  database
    const trackingState = await getTrackingState();
    const userToken =  await getUserToken();

    if(userToken != null && trackingState != null)
    {
        let actual_total_distance = `${(trackingState.distanceTravelled/1000).toFixed(1)} km`;
        let trip_id = trackingState.trip_id;
        let route = trackingState.route.join('|');

        axios.post(`${url}/api_grouped_trips/set_actual_total_distance`,
        {
            id: trip_id,
            actual_total_distance,
            //route
        },
        {
            headers:{
                'Authorization': `Bearer ${userToken}`
            }
        }
        )
        .then(async (res)=>{

            // remove
            //Alert.alert("Tracking Service", "Tracking Service has end");
            //console.log("tracking ended");
            showTracking(false);

            //removeListeners();
            removeTrackingState();
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

