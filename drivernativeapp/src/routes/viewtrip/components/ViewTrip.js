import React, {useState, useEffect,useRef} from 'react'
import {
    ScrollView,
    Spinner,
    Center,
  } from "native-base"

import TripComponent from '../../trips/components/TripComponent';
import PassengersComponent from './passengers/PassengersComponent';
import MapComponent from './maps/MapComponent';
import StatusComponent from './status/StatusComponent'
import Options from './options/Options';
import { AppState, Alert, PermissionsAndroid } from 'react-native';
import OverlayPermissionModule from "rn-android-overlay-permission";
import Disclosure from './disclosure/Disclosure'

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
    const [showDisclosure, setShowDisclosure ] = useState(false);


    const onOptions = (data) =>{
        // toggle show options
        setOptionsData(data);
        setShowOptions(true);
    }

    const { tripId }  = route.params; 
    useEffect(()=>{
        getTripDataAction(tripId);
    },[]);

    useEffect(()=>{
        if (Platform.OS === "android") {
            OverlayPermissionModule.isRequestOverlayPermissionGranted((status) => {
                console.log("overLay status : " + status );
              if (status) {
                Alert.alert(
                  "Permissions",
                  "Overlay Permission",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => OverlayPermissionModule.requestOverlayPermission(),
                    },
                  ],
                  {cancelable: true}
                  //{ cancelable: false }
                );
              }
            });
        }    
    },[]);

    const checkLocationPermission = async () =>{
        try{
            let permitedFineLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            let permitedBackgroundLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);

            if (permitedFineLocation == false || permitedBackgroundLocation == false ){
                //console.log("showing disclosure");
                setShowDisclosure(true);
            }
        }catch(e){
            console.log("error checking android permission");
        }
        
    }

    useEffect(()=>{
       checkLocationPermission();
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
                            trip_type = {trips[0].trip_type}
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
                            time = {time}
                            trips = {trips}
                            order = {order}
                            openCallDialogAction = {openCallDialogAction}
                        />
                    }
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
            {
                showDisclosure &&
                <Disclosure
                    setShowDisclosure={setShowDisclosure}
                />
            }
        </Center>
    )
}
export default ViewTrip;