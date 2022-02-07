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
import SwipeButton from '../../../../../components/SwipeButton'

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
    onOptions
}) =>
{
    const onPressAction = (status,isToggled) =>{
        if(isToggled == true)
        {
            completeTripAction();
        }
    }

    if(passengerIsLoading == true)
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
            <Text
                isTruncated
            >{` ${passengerBound == 'inbound' ? passengerLocation : passengerDestination}`}</Text>
            {
                <Text
                    color= 'green.700'
                    fontWeight='bold'
                    underline
                >{`${passengerName} ${passengerSurname}`}</Text>
            }

            {
                <Center
                    alignItems={'center'}
                    width= '100%'
                >
                    <SwipeButton onToggle={onPressAction} 
                        status = {status}
                        headingText={passengerBound == 'inbound' ? 'Swipe right to confirm pickup' : 'Swipe right to confirm dropoff'}
                    />
                </Center>
            }
            <Center
                position='absolute'
                right = '0'
                pr={2}
                pt={1}
            >
                <Pressable
                    onPress={()=>onOptions({
                        type: "passenger",
                        name: passengerName,
                        surname: passengerSurname,
                        location: passengerLocation,
                        destination: passengerDestination
                    })}
                >
                    <HamburgerIcon 
                        size = '6'
                        color= '#ADABB0'
                    />
                </Pressable>

            </Center>
        </VStack>
    )

}
export default ConfirmationComponent