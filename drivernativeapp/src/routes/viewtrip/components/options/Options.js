import React from 'react'
import {
    Center,
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
    allTripsOnRouteAction
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
        />
        <VStack
            h = "50%"
            bg={"gray.50"}
            w = '80%'
            borderRadius={"10px"}
            position={"absolute"}
            alignItems={"center"}
            justifyContent={"center"}
            borderColor={'gray.300'}
            borderWidth={1}
            px={4}
        >
            <Center>
                <Text
                    color = "#535156"
                    fontWeight={"bold"}
                    fontSize={20}
                    mb={5}
                > Are you sure ?</Text>
            </Center>
            {
                (optionsData.type == "passenger") &&
                <>
                    <Text>{(optionsData.command == "accept") ? `Confirm ${ optionsData.passengerBound == "inbound" ? "pickup" : "dropoff"} for: ` : "Cancel trip for:"}</Text>
                    <Center
                    >
                        <Text
                            color = "#535156"
                            fontWeight={"bold"}
                        > {`${optionsData.name} ${optionsData.surname}`}</Text>
                    </Center>

                    <Center
                    >
                        <Text
                            isTruncated
                        >{optionsData.location}</Text>
                    </Center>
                    <Text
                        color = "#535156"
                        fontWeight={"bold"}
                    >To</Text>
                    <Center
                    >
                        <Text
                            isTruncated
                        >{optionsData.destination}</Text>
                    </Center>
                </>
            }

            {   
                (optionsData.type == "trip") &&
                <Text>{ (optionsData.command == "accept") ? "Accept Trip" : "Decline Trip"}</Text>
            }

            {   
                (optionsData.type == "allTripsOnRoute") &&
                <Text>{"All passengers picked up."}</Text>
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
                    bg="#745D95"
                    borderRadius={8}
                    alignItems={"center"}
                    justifyContent={"center"}
                    w="40%"
                    onPress={()=>onYes()}
                >
                    <Text
                        color = "white"
                        fontWeight={"bold"}
                    >Yes</Text>
                </Pressable>
                <Pressable
                    py={2}
                    px={2}
                    w="40%"
                    borderRadius={8}
                    alignItems={"center"}
                    justifyContent={"center"}
                    borderColor={"#EA5F5F"}
                    borderWidth={1}
                    onPress={()=>setShowOptions(false)}
                >
                    <Text
                        color = "#EA5F5F"
                        fontWeight={"bold"}
                    >No</Text>
                </Pressable>
            </HStack>
            
            
        </VStack> 
    </>
    )
}

export default Options;