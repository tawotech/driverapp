import React, {useState, useContext, useEffect} from 'react'
import {
    Box,
    Text,
    VStack,
    Pressable,
    Center,
    Spinner
} from "native-base"

const ConfirmationComponent = ({
    getPassengerAction,
    passenger,
    passengerBound,
    passengerName,
    passengerSurname,
    passsengerDestination,
    passengerLocation,
    completeTripAction
}) =>
{
    useEffect(()=>{
        setTimeout(()=>getPassengerAction(),250);
    },[]);

    if(passenger == null)
    {
        return(
            <Center>
                <Spinner size="large"/>
            </Center>
        )
    }

    return(
        <VStack
            key ={passenger}
            bg={'green.100'}
            py='2'
            borderRadius='10'
            borderColor='green.500'
            borderWidth='1'
            alignItems='center'
        >
            <Text
                color= 'green.700'
            >On route to:
            </Text>
            <Text>{` ${passengerBound == 'inbound' ? passengerLocation : passsengerDestination}`}</Text>
            {
                <Text
                    color= 'green.700'
                    fontWeight='bold'
                    underline
                >{`${passengerName} ${passengerSurname}`}</Text>
            }

            <Pressable
                onPress={()=>completeTripAction()}
            >
                <Box
                    bg={'green.700'}
                    py='2'
                    px='2'
                    borderRadius='10'
                    marginTop='3'
                >
                    <Text
                        color= 'white'
                        fontWeight='bold'
                    >{passengerBound == 'inbound' ? 'Confirm pickup' : 'Confirm dropoff'}</Text>
                </Box>
            </Pressable>
        </VStack>
    )

}
export default ConfirmationComponent