import React, {useState, useContext, useEffect} from 'react'
import {
    Box,
    Text,
    VStack,
    Pressable,
    Center,
    Spinner
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
    skipTripAction
}) =>
{
    const onPressAction = (status,isToggled) =>{
        console.log(isToggled);
        if(isToggled == "right")
        {
            completeTripAction();
        }
        else if(isToggled == "left")
        {
            skipTripAction();
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
            <Text>{` ${passengerBound == 'inbound' ? passengerLocation : passengerDestination}`}</Text>
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
                        leftText={"Skip"}
                        rightText={passengerBound == 'inbound' ? 'Confirm pickup' : 'Confirm dropoff'}
                    />
                </Center>
                
                /*
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
                </Pressable>*/
            }
        </VStack>
    )

}
export default ConfirmationComponent