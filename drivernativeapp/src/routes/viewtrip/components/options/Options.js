import React from 'react'
import {
    Text,
    Pressable,
    VStack,
    HStack
  } from "native-base"

const Options = ({
    optionsData, 
    setShowOptions,
    skipTripAction,
    declineTripAction,
    acceptTripAction,
    completeTripAction,
    navigation,
    allTripsOnRouteAction,
    endTripAction
}) => {

    const onYes = () =>{
        if(optionsData.type == "passenger")
        {
            if(optionsData.command == "decline")
            {
                skipTripAction();
            }
            else if(optionsData.command == "accept")
            {
                completeTripAction()
            }
        }
        else if (optionsData.type == "trip")
        {
            if (optionsData.command == "decline")
            {
                declineTripAction(navigation);
            }
            else if (optionsData.command == "accept")
            {
                acceptTripAction();
            }
        }
        else if (optionsData.type == "allTripsOnRoute")
        {
            if (optionsData.command == "accept")
            {
                allTripsOnRouteAction();
            }
        }
        else if(optionsData.type == "endTrip")
        {
            if (optionsData.command == "accept")
            {
                endTripAction();
            }
        }
        setShowOptions(false);
    }

    return(
    <>
        <Pressable
            onPress={()=>setShowOptions(false)}
            w={"100%"}
            h={"100%"}
            position={"absolute"}
            alignItems={"center"}
            justifyContent={"center"}
            bg="#000000"
            opacity={0.40}
        />
        <VStack
            //h = "50%"
            bg={"gray.50"}
            w = '80%'
            borderRadius={"10px"}
            position={"absolute"}
            alignItems={"center"}
            justifyContent={"center"}
            borderColor={'gray.300'}
            borderWidth={1}
            px={4}
            py={4}
        >
            {
                (optionsData.type == "passenger") &&
                <>
                    <Text
                        color = "#535156"
                        fontWeight={"bold"}
                        fontSize={20}
                    >{(optionsData.command == "accept") ? 
                    `You are about to confirm a ${ optionsData.passengerBound == "inbound" ? "pickup" : "dropoff"} are you sure ?` 
                    : `You are about to decline a ${ optionsData.passengerBound == "inbound" ? "pickup" : "dropoff"} are you sure ?` }</Text>
                    
                </>
            }

            {   
                (optionsData.type == "trip") &&
                <Text
                    color = "#535156"
                    fontWeight={"bold"}
                    fontSize={20}
                >{ (optionsData.command == "accept") ? "You are about to accept a trip, are you sure?" : "You are about to decline a trip, are you sure?"}</Text>
            }

            {   
                (optionsData.type == "allTripsOnRoute") &&
                <Text
                    color = "#535156"
                    fontWeight={"bold"}
                    fontSize={20}
                >{"You are about to confirm pickup of passengers, are you sure?"}</Text>
            }

            {   
                (optionsData.type == "endTrip") &&
                <Text
                    color = "#535156"
                    fontWeight={"bold"}
                    fontSize={20}
                >{"You are about to end trip, are you sure?"}</Text>
            }

            <HStack
                mt="5"
                alignItems={"center"}
                justifyContent={"space-around"}
                width={"100%"}
            >   
                <Pressable
                    py={2}
                    px={2}
                    bg={(optionsData.command == "decline") ? "#FFFFFF" : "#745D95"}
                    borderColor = {(optionsData.command == "decline") ? "#EA5F5F" : "#FFFFFF"}
                    borderWidth={1}
                    borderRadius={8}
                    alignItems={"center"}
                    justifyContent={"center"}
                    w="40%"
                    onPress={()=>onYes()}
                >
                    {
                        (optionsData.type == "passenger" || optionsData.type == "trip") &&
                        <Text
                            color = {(optionsData.command == "decline") ? "#EA5F5F" : "#FFFFFF"}
                            fontWeight={"bold"}
                        >{ (optionsData.command == "accept") ? "Yes, confirm" : "Yes, decline"}</Text>
                    }
                    {   
                        (optionsData.type == "allTripsOnRoute" || optionsData.type == "endTrip") &&
                        <Text
                            fontWeight={"bold"}
                            color = "#FFFFFF"
                        >{  (optionsData.type == "endTrip") ? "Yes, end" : "Yes, confirm"}</Text>
                    }
                    
                </Pressable>

                <Pressable
                    py={2}
                    px={2}
                    w="40%"
                    borderRadius={8}
                    alignItems={"center"}
                    justifyContent={"center"}
                    borderColor={"#ADABB0"}
                    borderWidth={1}
                    onPress={()=>setShowOptions(false)}
                >
                    <Text
                        color = "#ADABB0"
                        fontWeight={"bold"}
                    >Cancel</Text>
                </Pressable>
            </HStack>
        </VStack> 
    </>
    )
}

export default Options;