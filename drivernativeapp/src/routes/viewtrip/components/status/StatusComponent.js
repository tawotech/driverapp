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
import SwipeButton from '../../../../components/SwipeButton'
import { declineTripAction } from '../../modules/viewTrip'

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
    endTripAction,
    passengerIsLoading,
    declineTripAction,
    navigation,
    skipTripAction
}) =>
{
    const onPressAction = (status, next = null)=>{
        console.log("status is: " + status + "toggle is: " + next)
        if(status == 'scheduled' && next == 'right')
        {
            acceptTripAction();
        }
        else if(status == "scheduled" && next == "left")
        {
            declineTripAction(navigation);
        }
        else if ( status == 'accepted')
        {
            onRouteAction();
        }
    }

    const getStatusDisplay = ()=>{
        let display = 'Unknown Status'
        if(status == "on_route" || status == "trips_completed")
        {
            return(<></>);
        }
        else if(status == 'scheduled')
        {
            display = 'Accept Trip';
            
            return (<SwipeButton onToggle={onPressAction} 
                        status = {status}
                        leftText={"Decline"}
                        rightText={"Accept"}
                    />)
        }
        else if ( status == 'accepted')
        {
            display = 'Start Trip'
        }
        else if( status == 'complete')
        {
            display = 'Completed'
        }
        return  (
            <Pressable
                onPress={()=>onPressAction(status)}
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
            {
                getStatusDisplay()
            }
            {
                (status == 'on_route') &&
                <ConfirmationComponent
                    status={status}
                    getPassengerAction={getPassengerAction}
                    passenger={passenger}
                    passengerBound={passengerBound}
                    passengerLocation={passengerLocation}
                    passengerDestination={passengerDestination}
                    passengerName={passengerName}
                    passengerSurname={passengerSurname}
                    completeTripAction={completeTripAction}
                    passengerIsLoading = {passengerIsLoading}
                    skipTripAction = {skipTripAction}
                />
            }
            {
                (status == 'trips_completed') &&
                <EndTripComponent endTripAction={endTripAction}/>
            }
        </VStack>
    )

}
export default StatusComponent