import React, {useState, useContext, useEffect} from 'react'
import {
    Box,
    Text,
    VStack,
    Pressable,
  } from "native-base"

const EndTripComponent = ({
    getPassengerAction,
    passenger,
    passengerBound,
    passengerName,
    passengerSurname,
    passsengerDestination,
    passengerLocation,
    completeTripAction,
    endTripAction
}) =>
{
    return(
        <VStack
            bg={'green.100'}
            py='2'
            borderRadius='10'
            borderColor='green.500'
            borderWidth='1'
            alignItems='center'
        >
            <Pressable
                onPress={()=>endTripAction()}
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
                    >End Trip</Text>
                </Box>
            </Pressable>
        </VStack>
    )

}
export default EndTripComponent