import React, {useState, useContext, useEffect} from 'react'
import {
    Text,
    VStack,
    HStack,
    Center,
    Box,
  } from "native-base"
import { Pressable,Alert,NativeModules,NativeEventEmitter } from 'react-native';
import RNMap from './RNMAP';
import OverlayPermissionModule from "rn-android-overlay-permission";
const { CalendarModule } = NativeModules;

const MapComponent = ({
    openInGoogeMapsAction,
    navigation,
    completeTripAction,
    skipTripAction,
    endTripAction,
    passengerName,
    passengerSurname,
    passengerLocation,
    passengerDestination,
    passengerBound
}) =>
{

    /*var acceptListener;
    var declineListener;
    var endTripListener;
    var pickupAllPassengersListener
    var widgetStatusListener;

    const removeListeners = () =>
    {
        //removeAllListeners(eventType: string): void;
        acceptListener.remove();
        declineListener.remove();
        endTripListener.remove();
        widgetStatusListener.remove();
        pickupAllPassengersListener.remove();
    }
    const registerListeners = () =>{
        const eventEmitter = new NativeEventEmitter(CalendarModule);

        acceptListener = eventEmitter.addListener('EtapathAcceptPassenger', (event) => {
            console.log("accepting passenger");
            setTimeout(()=> completeTripAction(),100);
        });

        declineListener = eventEmitter.addListener('EtapathDeclinePassenger', (event) => {
            console.log("declining passenger");
            setTimeout(()=> skipTripAction(),100);
        });

        endTripListener = eventEmitter.addListener('EtapathEndTrip', (event) => {
            console.log("ending trip")
            setTimeout(()=> endTripAction(),100);
        });

        pickupAllPassengersListener = eventEmitter.addListener('EtapathPickupAllPassengers', (event) => {
            console.log("pickup all passengers");
            CalendarModule.performAction(
                "UPDATE_PASSENGER",
                `${passengerName} ${passengerSurname}`,
                passengerLocation,
                passengerDestination,
                passengerBound
            );
        });

        widgetStatusListener = eventEmitter.addListener('EtapathUpdateWidgetStatus', (event) => {
            console.log(JSON.stringify(event));
            removeListeners();
        });
    }*/
    

    useEffect(()=>{
        if (Platform.OS === "android") {
            OverlayPermissionModule.isRequestOverlayPermissionGranted((status) => {
                console.log("overLay status : " + status );
              if (status) {
                Alert.alert(
                  "Permissions",
                  "Overlay Permission",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => OverlayPermissionModule.requestOverlayPermission(),
                    },
                  ],
                  { cancelable: false }
                );
              }
            });
        }    
    });

    return(
        <VStack
            borderRadius= '10'
            background='#FFFFFF'
            marginY='2'
            py = '2'
            px = '2'
        >
            <Pressable
                onPress={()=>{
                    //registerListeners();
                    openInGoogeMapsAction();
                }}
            >
                <Center
                    borderRadius= '10'
                    borderColor='#745D95'
                    borderWidth='1'
                    py='2'
                    px='2'
                    width= '100%'
                >
                    <Text
                        fontWeight={"bold"}
                        color="#745D95"
                    >Open in Google Maps</Text>
                </Center>
            </Pressable>
            {
                // <RNMap/>
            }
        </VStack>
    )
}
export default MapComponent;