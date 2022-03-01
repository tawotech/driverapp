import React, {useState, useContext, useEffect,useRef} from 'react'
import {
    Box,
    ScrollView,
    Spinner,
    Center,
    Text,
    Pressable,
    VStack
  } from "native-base"

import TripComponent from '../../trips/components/TripComponent';
import PassengersComponent from './passengers/PassengersComponent';
import MapComponent from './maps/MapComponent';
import StatusComponent from './status/StatusComponent'
import Options from './options/Options';
import { NativeModules, AppState} from 'react-native';
const { CalendarModule } = NativeModules;

const ViewTrip = ({
    navigation,
    route,
    getTripDataAction,
    tag,
    date,
    time,
    trip_id,
    company,
    status,
    total_distance,
    trips,
    isLoading,
    passengerIsLoading,
    acceptTripAction,
    onRouteAction,
    order,
    getPassengerAction,
    passenger,
    passengerBound,
    passengerLocation,
    passengerDestination,
    passengerName,
    passengerSurname,
    completeTripAction,
    endTripAction,
    openInGoogeMapsAction,
    openCallDialogAction,
    firstPassenger,
    declineTripAction,
    skipTripAction,
    allTripsOnRoute,
    allTripsOnRouteAction,
    refreshTripAction
}) =>
{

    const [showOptions, setShowOptions] = useState(false);
    const [optionsData, setOptionsData] = useState({});


    const onOptions = (data) =>{
        // toggle show options
        setOptionsData(data);
        setShowOptions(true);
    }

    const { tripId }  = route.params; 
    useEffect(()=>{
        getTripDataAction(tripId);
    },[]);

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log("App has come to the foreground!");
            refreshTripAction();
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log("AppState", appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, []);



    
    if (isLoading)
    {
        return(
            <Center  flex = {1}>
                <Spinner size="lg"/>
            </Center>
        )
    }

    return(
        <Center
            //flex={1}
            w= '100%'
            bg='#E5E5E5'
        >
            {
                <ScrollView
                    width= '100%'
                    height= '100%'

                    _contentContainerStyle={{
                        px: "10px",
                        pt: '2',
                        w: '100%'
                    }}
                >
                    {
                        <TripComponent
                            time = {time}
                            company = {company}
                            dateStamp = {date}
                            id = {trip_id}
                            tag = {tag}
                            clickable={false}
                            firstPassenger = {firstPassenger}
                            status={status}
                            total_distance={total_distance}
                            numPassengers={trips.length}
                        />
                    }
                    {
                        <StatusComponent 
                            status = {status}
                            trips = {trips}
                            acceptTripAction = {acceptTripAction}
                            onRouteAction = {onRouteAction}
                            getPassengerAction = {getPassengerAction}
                            passenger={passenger}
                            passengerBound={passengerBound}
                            passengerLocation={passengerLocation}
                            passengerDestination={passengerDestination}
                            passengerName={passengerName}
                            passengerSurname={passengerSurname}
                            trip_id = {trip_id}
                            completeTripAction = {completeTripAction}
                            endTripAction = {endTripAction}
                            passengerIsLoading = {passengerIsLoading}
                            navigation = {navigation}
                            onOptions={onOptions}
                            allTripsOnRoute = {allTripsOnRoute}
                        />
                    }
                    {
                        <MapComponent
                            openInGoogeMapsAction = {openInGoogeMapsAction} 
                            navigation = {navigation}
                            completeTripAction = {completeTripAction}
                            skipTripAction = {skipTripAction}
                            endTripAction = {endTripAction}
                            passengerName={passengerName}
                            passengerSurname={passengerSurname}
                            passengerLocation={passengerLocation}
                            passengerDestination={passengerDestination}
                            passengerBound={passengerBound}
                        />
                    }
                    {
                        <PassengersComponent 
                            trips = {trips}
                            order = {order}
                            openCallDialogAction = {openCallDialogAction}
                        />
                    }
                    <Box
                        borderRadius='10'
                        bg ='#FFFFFF'
                        marginTop='2'
                        py={5}
                        pl={5}
                    >
                        <Text
                            //color='#ADABB0'
                        >{`Distance Travelled: `}
                            <Text
                                color='#535156'
                                fontWeight='bold'
                            > 0 km</Text>
                        </Text>
                    </Box>
                    <Pressable
                        borderRadius='10'
                        bg ='#FFFFFF'
                        marginTop='2'
                        py={5}
                        pl={5}
                        onPress={()=> CalendarModule.createCalendarEvent('testName', 'testLocation')}
                    >
                        <Text
                            //color='#ADABB0'
                        >
                            Invoke native modul
                        </Text>
                    </Pressable>
                </ScrollView>

            }
            {
                showOptions && 
                <Options 
                    optionsData={optionsData} 
                    setShowOptions={setShowOptions}
                    acceptTripAction = {acceptTripAction}
                    declineTripAction = {declineTripAction}
                    skipTripAction = {skipTripAction}
                    completeTripAction = {completeTripAction}
                    navigation = {navigation}
                    allTripsOnRouteAction = {allTripsOnRouteAction} 
                    endTripAction = {endTripAction}
                />
            }
        </Center>
    )
}
export default ViewTrip;