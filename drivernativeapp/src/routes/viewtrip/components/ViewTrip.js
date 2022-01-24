import React, {useState, useContext, useEffect} from 'react'
import { AuthContext } from '../../../components/context';
import Header from '../../../components/Header';
import {
    Box,
    ScrollView,
    Spinner,
    Center
  } from "native-base"

import TripComponent from '../../trips/components/TripComponent';
import PassengersComponent from './passengers/PassengersComponent';
import MapComponent from './maps/MapComponent';
import StatusComponent from './status/StatusComponent'

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
    endTripAction
}) =>
{
    const { tripId }  = route.params; 
    useEffect(()=>{
        getTripDataAction(tripId);
    },[]);

    const {logout} =  useContext(AuthContext);

    if (isLoading)
    {
        return(
            <Center  justifyContent='center' alignItems= "center">
                <Spinner size="lg"/>
            </Center>
        )
    }

    return(
        <Center
            //flex={1}
            //w= '100%'
            bg='#E5E5E5'
        >
            {
                /*<Button 
                    title =  'logout' 
                    onPress = {()=> logout()}
                />*/
            }   
            { 
                <Header 
                    navigation={navigation} 
                    showBackIcon = {true}
                /> 
            }
            <ScrollView
                _contentContainerStyle={{
                    px: "10px",
                    pt: '2',
                    h: '95%'
                }}
            >
                <TripComponent
                    time = {time}
                    company = {company}
                    dateStamp = {date}
                    id = {trip_id}
                    tag = {tag}
                    clickable={false}
                /> 
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
                />
                <PassengersComponent 
                    trips = {trips}
                    order = {order}
                />
                <MapComponent/>
            </ScrollView>

        </Center>
    )
}
export default ViewTrip;