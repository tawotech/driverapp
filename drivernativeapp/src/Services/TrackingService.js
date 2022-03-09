import { getDistance } from 'geolib';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import apiConstants from '../api/apiConstants';
const { url } = apiConstants;

// inititilise location tracking
export const registerListeners = async ( startLocation, endLocation, trip_id) =>{
    try {
        let permited = await PermissionsAndroid.check(
                (Platform.Version < 29) ? PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION : PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
            );
        if (permited == false)
        {
            const granted = await PermissionsAndroid.request( 
                (Platform.Version < 29) ? PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION : PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
            );
        }

        permited = await PermissionsAndroid.check(
                (Platform.Version < 29) ? PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION : PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
            );


        if( permited == true )
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
                        trip_id
                    });

                    Geolocation.watchPosition(
                        (success)=>{
                            
                            const { latitude, longitude } = success.coords;
                            calculateDistanceTravelled({latitude, longitude});
                        },
                        (error)=>{
                            console.log(error);
                        },
                        {   
                            enableHighAccuracy: true, 
                            distanceFilter: 50,
                            forceLocationManager: true,
                            interval: 100
                        }
                    );
                },
                (error)=>{
                    console.log(error);
                },
                {
                    enableHighAccuracy: true, 
                    distanceFilter: 50,
                    forceLocationManager: true,
                }
            );
        }
        else
        {
            console.log("Device location access required: " + permited);
        }
        
    } catch (error) {
        console.log(error);
    }
}

export const removeListeners = () =>{
    // stop observing
    Geolocation.stopObserving();
}

export async function calculateDistanceTravelled(currentLocation)
{
    // get tracking state state
    let trackingState = await getTrackingState();

    if(trackingState != null && trackingState.endedTracking == true)
    {
        stopTrackingService();
        return;
    }

    // check for startLocation proximity
    if(trackingState != null && trackingState.startedTracking == false)
    {
        const startProximity = await getDistance(trackingState.startLocation,currentLocation);
        //console.log("start proximity: " + startProximity);

        if(startProximity < 100) // set proximity check to 100 meters
        {
            // set started tracking to true
            trackingState.startedTracking = true;
            // keep track of the prevLocation
            trackingState.prevLocation = currentLocation;
            //console.log("tracking state: " + JSON.stringify(trackingState));

        }
    }

    if (trackingState != null && trackingState.startedTracking == true && trackingState.endedTracking == false)
    {
        const { distanceTravelled, prevLocation } = trackingState;

        const pointToPointDist = await getDistance(prevLocation,currentLocation); 
        let newDistanceTravelled = distanceTravelled + pointToPointDist;

        // update state
        trackingState.distanceTravelled = newDistanceTravelled;
        trackingState.prevLocation = currentLocation;
        //console.log("distance: " + newDistanceTravelled)
        // check for endLocation proximity
        const endProximity = await getDistance(trackingState.endLocation,currentLocation);
        //console.log("end proximity: " + endProximity);
        if(endProximity < 100)
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
        let actual_total_distance = `${trackingState.distanceTravelled/1000} km`;
        let trip_id = trackingState.trip_id;

        axios.post(`${url}/api_grouped_trips/set_actual_total_distance`,
        {
            id: trip_id,
            actual_total_distance
        },
        {
            headers:{
                'Authorization': `Bearer ${userToken}`
            }
        }
        )
        .then(async (res)=>{

            // remove
            removeListeners();
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

