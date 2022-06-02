import Geolocation from 'react-native-geolocation-service';
import { Alert, PermissionsAndroid, Vibration} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import apiConstants from '../api/apiConstants';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { getPreciseDistance } from 'geolib';
const { url } = apiConstants;
import * as WidgetService from './WidgetService' 
import { showPassengerArrived } from '../routes/viewtrip/modules/viewTrip';
var proximityDispatch = null;
//const store =  require('../store/createStore');
//import store from '../store/createStore'
//const {dispatch} = store;
const ONE_SECOND_IN_MS = 1000;
var checkProximityWatchId = null;
const stopCheckProximity = () =>{
    Geolocation.clearWatch(checkProximityWatchId);
}

export const startCheckProximity = async ()  =>  {
    try {
        
        let permitedFineLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if( permitedFineLocation == true)
        {
            
            checkProximityWatchId = Geolocation.watchPosition(
                async(success)=>{
                    
                    const { latitude, longitude } = success.coords;
                    let proximityState = await getProximityState();
                    let currentLocation = {
                        latitude,
                        longitude
                    }
                    let trips = proximityState.trips;

                    if (trips.length != 0)
                    {
                        let proximities = [];
                        
                        await trips.forEach (async (trip)=>{
                            let distance = 0;
                            if(trip.trip_type == 'inbound')
                            {
                                distance =  await getPreciseDistance({
                                        latitude:  trip.location_latitude,
                                        longitude: trip.location_longitude
                                    },
                                    currentLocation);
                            }
                            else
                            {
                                distance =  await getPreciseDistance({
                                    latitude:  trip.destination_latitude,
                                    longitude: trip.destination_longitude
                                },
                                currentLocation);
                            }

                            console.log("trip id: => " + trip.id + "distance: => " + distance);

                            proximities.push({
                                trip,
                                distance
                            });

                        });

                        let updatedTrips = [];
                        proximities.forEach((proximity)=>{
                            if(proximity.distance < 200)
                            {
                                // how promt
                                console.log("arrived to passenger");
                                WidgetService.showArrivedPassenger();
                                Vibration.vibrate(2 * ONE_SECOND_IN_MS)
                                proximityDispatch(showPassengerArrived(true));
                            }
                            else
                            {
                                updatedTrips.push(proximity.trip);
                            }
                        });

                        proximityState.trips = updatedTrips;
                        setProximityState(proximityState);
                    }
                    else
                    {
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
        Alert.alert("Device location", "Error: starting -- start check proximity-- passenger proximity service ");
    }
}

export async function start({trip_id, dispatch})
{    
    proximityDispatch = dispatch;
    console.log("starting passenger proximity service ~~~!!!");
    if (ReactNativeForegroundService.is_running())
    {
        if(ReactNativeForegroundService.is_task_running("PassengerProximityService"))
        {
            // remove the task
            await ReactNativeForegroundService.remove_task("PassengerProximityService");
        }

        //initialise proximity state
        await initialiseState(trip_id);
        // add new task with the new parameters
        await ReactNativeForegroundService.add_task(() =>{
            checkStartProximity();
        }, 
        {
            delay: 500,
            onLoop: false,
            taskId: "PassengerProximityService",
            onError: (e) => console.log(`Error logging passenger proximity service:`, e),
        });
    }
    else
    {
        //initialise proximity state
        await initialiseState(trip_id);

        // add new task with the new parameters
        await ReactNativeForegroundService.add_task(() =>{
            startCheckProximity();
        }, 
        {
            delay: 500,
            onLoop: false,
            taskId: "PassengerProximityService",
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
    await removeProximityState();
    await stopCheckProximity()

    //console.log("is running tracking service " + ReactNativeForegroundService.is_task_running("TrackingService"));

    if(ReactNativeForegroundService.is_task_running("PassengerProximityService"))
    {
        // remove the task
        await ReactNativeForegroundService.remove_task("PassengerProximityService");
    }

    let tasks = await ReactNativeForegroundService.get_all_tasks();
    //console.log("proximity service: " + JSON.stringify(Object.keys(tasks)));

    if(tasks && Object.keys(tasks).length == 0)
    {
        console.log("stopping in passenger proximity service");
        ReactNativeForegroundService.stop();
    }
}

// set tracking state
export const setProximityState = (proximityState) =>{
    try{
        AsyncStorage.setItem("proximityState", JSON.stringify(proximityState));
    }
    catch(e)
    {
        console.log("error setting proximity state");
        console.log(e);
    }
}

// get tracking state
export const getProximityState = async () =>{
    let proximityState = null;
    try{
        proximityState = await AsyncStorage.getItem("proximityState");
        proximityState = JSON.parse(proximityState);
    }
    catch(e)
    {
        console.log("error getting proximity state");
        console.log(e);
    }
    return proximityState;
}

export const removeProximityState = async () =>{
    try{
        AsyncStorage.removeItem("proximityState");
    }
    catch(e)
    {
        console.log("error removing proximity state");
        console.log(e);
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
    const response = await axios.get(`${url}/api_grouped_trips/show?id=${trip_id}`,
                        {
                            headers:{
                                'Authorization': `Bearer ${userToken}`
                            }
                        });
    console.log(response.data.trips);

    await setProximityState({
        trips: response.data.trips
    });
}

