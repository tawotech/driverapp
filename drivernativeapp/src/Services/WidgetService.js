import { NativeModules,NativeEventEmitter } from 'react-native';
import axios from 'axios';
import apiConstants from '../api/apiConstants'
import AsyncStorage from '@react-native-community/async-storage';
import * as RouteService from './RouteService'
import * as TrackingService from './TrackingService'

/*import { 
    startRecordingRouteAction, 
    stopRouteService
} from './RouteService';*/

export const TRIPS_COMPLETED = "TRIPS_COMPLETED";
export const UPDATE_PASSENGER = "UPDATE_PASSENGER";
export const PICK_ALL_PASSENGERS = "PICK_ALL_PASSENGERS";
export const END_TRIP = "END_TRIP"
export const START_TRACKING = "START_TRACKING"
export const END_TRACKING = "END_TRACKING"


const { CalendarModule } = NativeModules;
const {url} = apiConstants;

var acceptListener;
var declineListener;
var endTripListener;
var widgetStatusListener;
var pickupAllPassengersListener;

export const removeWidgetListeners = () =>
{
    //removeAllListeners(eventType: string): void;
    acceptListener.remove();
    declineListener.remove();
    endTripListener.remove();
    widgetStatusListener.remove();
    pickupAllPassengersListener.remove();
}

export const registerWidgetListeners = () =>{
    //console.log("registering widget listeners");
    const eventEmitter = new NativeEventEmitter(CalendarModule);

    acceptListener = eventEmitter.addListener('EtapathAcceptPassenger', (event) => {
        console.log("accepting passenger now ===>");
        widgetCompleteTripAction();
    });

    declineListener = eventEmitter.addListener('EtapathDeclinePassenger', (event) => {
        //console.log("declining passenger ====>");
        widgetSkipTripAction();
    });

    endTripListener = eventEmitter.addListener('EtapathEndTrip', (event) => {
        //console.log("ending trip ===>")
        widgetEndTripAction();
    });

    pickupAllPassengersListener = eventEmitter.addListener('EtapathPickupAllPassengers', async (event) => {
        try{
            widgetAllTripsOnRouteAction();
        }
        catch(e){
            console.log("error updating passenger after pickup all passengers");
            console.log(e);
        }
    });

    widgetStatusListener = eventEmitter.addListener('EtapathUpdateWidgetStatus', (event) => {
        removeWidgetListeners();
        removeWidgetState();
    });
}

export async function widgetGetPassengerAction()
{
        const userToken = await getUserToken();
        const widgetState = await getWidgetState();

        const { trip_id, trips } = widgetState;

        axios.get(`${url}/api_grouped_trips/get_passenger?id=${trip_id}`,
            {
                headers:{
                    'Authorization': `Bearer ${userToken}`
                }
            }
        )
        .then(async (res)=>{

            let passenger = res.data.passenger;
            let status = res.data.status;
            
            if(status == 'trips_completed' || passenger == null)
            {
                widgetPerformAction(TRIPS_COMPLETED, widgetState);
            }
            else
            {
                let trip = trips.filter((trip)=> trip.id == passenger );
                // update widget state
                widgetState.passenger = passenger;
                widgetState.passengerName = trip[0].name;
                widgetState.passengerSurname = trip[0].surname;
                widgetState.passengerLocation = trip[0].location;
                widgetState.passengerDestination = trip[0].destination;
                widgetState.passengerBound = trip[0].trip_type;

                setWidgetState(widgetState);             
                widgetPerformAction(UPDATE_PASSENGER, widgetState);               
            }
        })
        .catch((e)=>{
            console.log(e);
        });
}

export async function widgetCompleteTripAction()
{
    const widgetState = await getWidgetState();
    const {trip_id, passenger} = widgetState;

    // put in try catch block
    const userToken = await getUserToken();

    axios.post(`${url}/api_grouped_trips/complete_trip`,
    {
        id: trip_id,
        passenger_trip_id: passenger
    },
    {
        headers:{
            'Authorization': `Bearer ${userToken}`
        }
    }
    )
    .then(async (res)=>{

        widgetGetPassengerAction();

        // attempt to start recording route
        //startRecordingRouteAction(trip_id);
    })
    .catch((e)=>{
        console.log(e);
    });
}

export async function widgetSkipTripAction()
{
    const widgetState = await getWidgetState();
    const {trip_id, passenger} = widgetState;

    const userToken = await getUserToken();

        axios.post(`${url}/api_grouped_trips/skip_trip`,
        {
            id: trip_id,
            passenger_trip_id: passenger
        },
        {
            headers:{
                'Authorization': `Bearer ${userToken}`
            }
        }
        )
        .then(async (res)=>{
            widgetGetPassengerAction();

           // attempt to start recording route
            //startRecordingRouteAction(trip_id);
        })
        .catch((e)=>{
            console.log(e);
        });
}

export async function widgetEndTripAction()
{
    const widgetState = await getWidgetState();
    const {trip_id} = widgetState;
    const userToken = await getUserToken();

    axios.post(`${url}/api_grouped_trips/complete`,
    {
        id: trip_id
    },
    {
        headers:{
            'Authorization': `Bearer ${userToken}`
        }
    }
    )
    .then(async (res)=>{
       // stop route tracking service
       //stopRouteService();
       RouteService.stop();
       TrackingService.stop();
    })
    .catch((e)=>{
        console.log(e);
    });

}

export async function widgetAllTripsOnRouteAction()
{
    const widgetState = await getWidgetState();
    const {trip_id} = widgetState;
    const userToken = await getUserToken();

    axios.post(`${url}/api_grouped_trips/all_trips_on_route`,
    {
        id: trip_id,
        all_trips_on_route: "true"
    },
    {
        headers:{
            'Authorization': `Bearer ${userToken}`
        }
    }
    )
    .then(async (res)=>{
        let widgetState = await getWidgetState();
        widgetPerformAction(UPDATE_PASSENGER, widgetState);
        
        // attempt to start recording route
        //startRecordingRouteAction(trip_id);
    })
    .catch((e)=>{
        console.log(e);
    });
}

// start widget service
export const startWidgetService = (widgetState) =>{

    const {
        passengerBound,
        status,
        allTripsOnRoute
    } = widgetState;

    if(status == "on_route")
    {
        
        let prom = CalendarModule.startService();
        prom.then(async(success)=>{

            initializeWidget(widgetState);
            if(passengerBound == "outbound" && allTripsOnRoute == "false")
            {
                widgetPerformAction(PICK_ALL_PASSENGERS,widgetState);
            }
            else
            {
                widgetPerformAction(UPDATE_PASSENGER,widgetState);
            }
        })
        .catch((error)=>{
            console.log("failed to start widget service");
            console.log(error);
        })
    } 
    else if(status == "trips_completed")
    {
        let prom = CalendarModule.startService();
        prom.then((success)=>{
            //console.log(success);
            initializeWidget(widgetState);
            widgetPerformAction(TRIPS_COMPLETED,widgetState);
        })
        .catch(err=>{
            console.log(err);
        })
    }        
}

const initializeWidget = (widgetState) =>{
    //console.log("initializing widget ======>");
    // register listeners
    registerWidgetListeners();
    // save widget state
    setWidgetState(widgetState);
}

// actions to update widget UI
export const widgetPerformAction = (action, widgetState) =>{
    const {
        passengerName,
        passengerSurname,
        passengerLocation,
        passengerDestination,
        passengerBound,
    } = widgetState;
    
    CalendarModule.performAction(
        action,
        (passengerSurname && passengerName) ? `${passengerName} ${passengerSurname}` : "placeholder name",
        passengerLocation ? passengerLocation : "placeholder location",
        passengerDestination ? passengerDestination : "placeholder destination",
        passengerBound ? passengerBound : "placeholder bound"
    );
}

// show tracking

export const showTracking = async (show) =>{
    let widgetState = await getWidgetState();
    let isOpen = await isWidgetOpen();

    if(widgetState != null && isOpen)
    {
        if(show ==true)
        {
            //console.log(" showing trakinging text on widget ====>" + show);
            widgetPerformAction(START_TRACKING,widgetState);
        }
        else
        {
            widgetPerformAction(END_TRACKING,widgetState);
        }
    }
}

// set widget state
export const setWidgetState = (widgetState) =>{
    try{
        AsyncStorage.setItem("widgetState", JSON.stringify(widgetState));
    }
    catch(e)
    {
        console.log("error setting widget state");
        console.log(e);
    }
}
// get widget state
export const getWidgetState = async () =>{
    let widgetState = null;
    try{
        widgetState = await AsyncStorage.getItem("widgetState");
        widgetState = JSON.parse(widgetState);
    }
    catch(e)
    {
        console.log("error getting widget state");
        console.log(e);
    }
    return widgetState;
}

export const removeWidgetState = async () =>{
    try{
        AsyncStorage.removeItem("widgetState");
    }
    catch(e)
    {
        console.log("error getting widget state");
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

export const isWidgetOpen  = async () =>{

    try {
        let isOpen = await CalendarModule.isWidgetOpen();
        //console.log(" widget is open ====#### ==> : "  + isOpen);
        return isOpen;
    } catch (error) {
        console.log(error);
        console.log("error checking widget status");
        return false;
    }
}