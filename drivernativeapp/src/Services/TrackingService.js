import { getDistance } from 'geolib';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

// inititilise location tracking
export const registerListeners = async () =>{
    try {
        let permited = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (permited == false)
        {
            const granted = await PermissionsAndroid.request( 
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
        }

        permited = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

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
                        distanceTravelled: 0
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
            console.log("Device location access required");
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

    if (trackingState != null)
    {
        const { distanceTravelled, prevLocation } = trackingState;

        const pointToPointDist = await getDistance(prevLocation,currentLocation); 
        let newDistanceTravelled = distanceTravelled + pointToPointDist;
        console.log("prev: " + prevLocation.latitude +"," + prevLocation.longitude + " current: " + currentLocation.latitude + "," + currentLocation.longitude + " distance: " + newDistanceTravelled );

        // update state
        trackingState.distanceTravelled = newDistanceTravelled;
        trackingState.prevLocation = currentLocation; 
        setTrackingState(trackingState);
    }
}

export function startCalculatingDistanceAction()
{
    console.log("registering tracking listeners");
    registerListeners();
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

export const stopTrackingService = () =>{
    removeListeners();
    removeTrackingState();
}


