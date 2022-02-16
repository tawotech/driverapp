import React, {useState, useContext, useEffect} from 'react'
import {
    Box,
    Text,
    VStack,
    Pressable,
    Center,
    Spinner,
    HamburgerIcon
} from "native-base"

import AcceptDeclineComponent from '../../../../../components/AcceptDeclineComponent'

const ConfirmationComponent = ({
    getPassengerAction,
    passenger,
    passengerBound,
    passengerName,
    passengerSurname,
    passengerDestination,
    passengerLocation,
    completeTripAction,
    passengerIsLoading,
    status,
    onOptions,
    allTripsOnRoute
}) =>
{
    const onOptionsInterceptor = (data) =>{
        let formateData = {
            name: passengerName,
            surname: passengerSurname,
            location: passengerLocation,
            destination: passengerDestination,
            passengerBound: passengerBound,
            ...data
        }
        onOptions(formateData);
    }

    if(passengerIsLoading == true)
    {
        return(
            <Center>
                <Spinner size="large"/>
            </Center>
        )
    }

    console.log("passnger bound: " + passengerBound + " allTripsOnRoute: " + allTripsOnRoute);

    if(passengerBound == "outbound" && allTripsOnRoute != "true")
    {
        return(
            <VStack
                key ={passenger}
                borderRadius='10'
                w="100%"
            >
                <Text
                    color= '#ADABB0'
                    fontWeight='bold'
                >On route to site:</Text>
                <Text
                    color= '#535156'
                    fontWeight='bold'
                    isTruncated
                >{passengerLocation}</Text>
                {
                    <Center
                        w="100%"
                        mt ={2}
                    >
                        <Pressable
                            py={2}
                            px={2}
                            bg="#745D95"
                            borderRadius={8}
                            alignItems={"center"}
                            justifyContent={"center"}
                            w="100%"
                            onPress={()=> onOptions({
                                type: "allTripsOnRoute",
                                command: "accept"
                            })}
                        >
                            <Text
                                fontWeight={"bold"}
                                color={"#FFFFFF"}
                            >Confirm passengers pickup</Text>
                        </Pressable>
                    </Center>
                    
                }

            </VStack>
        )
    }

    return(
        <VStack
            key ={passenger}
            borderRadius='10'
            w="100%"
        >
            <Text
                color= '#ADABB0'
                fontWeight='bold'
            >On route to:
            </Text>
            <Text
                isTruncated
                color="#535156"
                fontWeight={"bold"}
            >{` ${passengerBound == 'inbound' ? passengerLocation : passengerDestination}`}</Text>
            {
                <Text
                    color= '#745D95'
                    fontWeight='bold'
                    underline
                >{`${passengerName} ${passengerSurname}`}</Text>
            }
            {
                <Center
                    w="100%"
                    mt ={2}
                >
                    <AcceptDeclineComponent
                        accetText={ passengerBound == 'inbound' ? 'Confirm pickup' : 'Confirm dropoff'}
                        declineText={"Decline"}
                        type ={"passenger"}
                        onOptions={onOptionsInterceptor}
                    />
                </Center>
                
            }
        </VStack>
    )

}
export default ConfirmationComponent