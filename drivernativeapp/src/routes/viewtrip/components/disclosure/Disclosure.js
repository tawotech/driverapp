import React from 'react'
import {
    Text,
    Pressable,
    VStack,
    HStack
  } from "native-base"

import Toast from 'react-native-simple-toast';

import { Alert, PermissionsAndroid, Platform } from 'react-native' 

const Disclosure = ({
    setShowDisclosure
}) => {

    const onNo = () =>{
        Toast.show('You should allow location permissions before you can use this app', 6000);
    }
    const onYes = async () =>{
        try{
            const apiLevel = Platform.Version;

            if(apiLevel >= 29) // android 11 and 10
            {
                // here ask for both => fine location first, then background location
                const grantedFineLocation = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                const grantedBackgoundLocation = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
                if( grantedFineLocation != 'granted' || grantedBackgoundLocation != 'granted')
                {
                    Toast.show(`You should allow location permissions before you can use this app, Fine Location: ${grantedFineLocation}, Background Location: ${grantedBackgoundLocation}`, 6000);
                    return
                }
            }
            else // android 9 and below
            {
                // only ask for location permission, background location will still be accessible
                const grantedFineLocation = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                if( grantedFineLocation != 'granted' )
                {
                    Toast.show(`You should allow location permissions before you can use this app, Fine Location: ${grantedFineLocation}`, 6000);
                    return;
                }
            }
            setShowDisclosure(false);

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
                    onPress={()=>onNo()}
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