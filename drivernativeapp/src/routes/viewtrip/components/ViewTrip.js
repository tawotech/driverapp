import React, {useState, useContext, useEffect} from 'react'
import Header from '../../../components/Header';
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
}) =>
{

    const [showOptions, setShowOptions] = useState(false);
    const [optionsData, setOptionsData] = useState({});


    const onOptions = (data) =>{
        // toggle show options
        setOptionsData(data);
        setShowOptions(true);
    }

    const onCancel = (data) =>{
        setShowOptions(false);
        if(data.type == "passenger")
        {
            skipTripAction();
        }
        else if (data.type == "trip")
        {
            declineTripAction(navigation);
        }
    }

    const { tripId }  = route.params; 
    useEffect(()=>{
        getTripDataAction(tripId);
    },[]);

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
                        />
                    }
                    {
                        <PassengersComponent 
                            trips = {trips}
                            order = {order}
                            openCallDialogAction = {openCallDialogAction}
                        />
                    }
                    {
                        <MapComponent
                            openInGoogeMapsAction = {openInGoogeMapsAction} 
                        />
                    }
                    
                </ScrollView>

            }
            {
                showOptions && 
                <Options 
                    optionsData={optionsData} 
                    setShowOptions={setShowOptions}
                    onCancel = {onCancel}
                />
            }
        </Center>
    )
}
export default ViewTrip;