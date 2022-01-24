import React, {useState, useContext, useEffect} from 'react'
import {
    Box,
    Text,
    Heading,
    VStack,
    FormControl,
    Input,
    HStack,
    Center,
    Pressable,
    FlatList,
    Button,
    SectionList,
    ScrollView,
  } from "native-base"


import ConfirmationComponent from './confirmation/ConfirmationComponent'
import EndTripComponent from './confirmation/EndTripComponent'

const StatusComponent = ({
    status,
    acceptTripAction,
    onRouteAction,
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
    const onPressAction = ()=>{
        if(status == 'scheduled')
        {
            acceptTripAction();
        }
        else if ( status == 'accepted')
        {
            onRouteAction();
        }
    }

    const getStatusDisplay = ()=>{
        let display = 'Unknown Status'
        if(status == 'scheduled')
        {
            display = 'Accept Trip';
        }
        else if ( status == 'accepted')
        {
            display = 'Start Trip'
        }
        else if( status == 'on_route')
        {
            return(
                <ConfirmationComponent
                    getPassengerAction={getPassengerAction}
                    passenger={passenger}
                    passengerBound={passengerBound}
                    passengerLocation={passengerLocation}
                    passengerDestination={passengerDestination}
                    passengerName={passengerName}
                    passengerSurname={passengerSurname}
                    completeTripAction={completeTripAction}
                />
            )
        }
        else if (status == 'trips_completed')
        {
            return(
                <EndTripComponent endTripAction={endTripAction}/>
            )
        }
        else if( status == 'complete')
        {
            display = 'Completed'
        }

        return  (
            <Pressable
                onPress={()=>onPressAction()}
            >
                <Center
                    bg={'green.100'}
                    py='2'
                    borderRadius='10'
                    borderColor='green.500'
                    borderWidth='1'
                >
                    <Text
                        color= 'green.700'
                    >{display}</Text>
                </Center>
            </Pressable>
        );
    }

    return(
        <VStack
            w="100%"
            borderRadius='10'
            bg='#FFFFFF'
            px='2'
            py='2'
            marginBottom='2'
        >
                {getStatusDisplay()}
            
        </VStack>
    )

}
export default StatusComponent