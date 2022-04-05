import React from 'react'
import {
    Text,
    Pressable,
    VStack,
    HStack
  } from "native-base"

import { PermissionsAndroid, Platform } from 'react-native' 

const Disclosure = ({
    setShowDisclosure
}) => {

    const onYes = async () =>{
        setShowDisclosure(false);
        try{
            let permissionToAsk = Platform.Version < 29 ? PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION : PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                permissionToAsk
            ]);
        }catch(e){
            console.log(e);
            console.log("error requesting permission")
        }
        
    }

    return(
    <>
        <Pressable
            onPress={()=>setShowDisclosure(false)}
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
            <Text
                color = "#535156"
                fontWeight={"bold"}
                fontSize={20}
            > LOCATION DISCLOSURE</Text>
            <Text
                color = "#535156"
            >
                The Etapath Driver Application requires access to your device's location, even when it is in the background.
                Your device's location will be used to calculate the distance covered by your trips for billing purposes, 
                therefore the app will need to access your location "all the time" to accomodate for instances where you might navigate away from the app during a trip.
                Your location is only accessed by the app while you have passengers in transit.
                Your location is not collected or sent to any third parties by the application.
            </Text>
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
                    borderColor = "#FFFFFF"
                    borderWidth={1}
                    borderRadius={8}
                    alignItems={"center"}
                    justifyContent={"center"}
                    w="40%"
                    onPress={()=>onYes()}
                >
                    <Text>Accept</Text>   
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
                    onPress={()=>setShowDisclosure(false)}
                >
                    <Text
                        color = "#ADABB0"
                        fontWeight={"bold"}
                    >Decline</Text>
                </Pressable>
            </HStack>
        </VStack> 
    </>
    )
}

export default Disclosure;