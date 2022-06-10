import React from 'react'
import {
    Text,
    Pressable,
    VStack,
    HStack,
    Box
  } from "native-base"

const Options = ({
    optionsData, 
    setShowOptions,
    declineTripAction,
    acceptTripAction,
}) => {

    const onYes = () =>{
        
        if (optionsData.type == "trip")
        {
            if (optionsData.command == "decline")
            {
                declineTripAction();
            }
            else if (optionsData.command == "accept")
            {
                acceptTripAction();
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
        <Box
            position={"absolute"}
            alignItems={"center"}
            justifyContent={"center"}
            w={'100%'}
            h={'100%'}
            alignSelf={"center"}    

        >
            <VStack
                //h = "50%"
                bg={"#FFFFFF"}
                w = '80%'
                borderRadius={"10px"}
                alignItems={"center"}
                justifyContent={"center"}
                borderColor={'gray.300'}
                borderWidth={1}
                px={4}
                py={4}
            >
                <Text
                    color = "#535156"
                    fontWeight={"bold"}
                    fontSize={20}
                >{ (optionsData.command == "accept") ? "You are about to accept a trip, are you sure?" : "You are about to decline a trip, are you sure?"}</Text>

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
                        <Text
                            color = {(optionsData.command == "decline") ? "#EA5F5F" : "#FFFFFF"}
                            fontWeight={"bold"}
                        >{ (optionsData.command == "accept") ? "Yes, confirm" : "Yes, decline"}</Text>
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
        </Box>
    </>
    )
}

export default Options;