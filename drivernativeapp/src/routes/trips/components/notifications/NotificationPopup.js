import React, { useEffect } from 'react'
import {
    Text,
    Pressable,
    VStack,
    HStack,
    Spinner,
    Box
  } from "native-base"

import AccepDeclineComponent from '../../../../components/AcceptDeclineComponent'
import TripComponent from '../TripComponent'

const NotificationPopup = ({
    notification,
    notificationTrip,
    notificationTripIsLoading,
    getNotificationTripDataAction,
    setShowOptions,
    setOptionsData,
    closeTripNotificationAction
}) => {

    useEffect(()=>{
        getNotificationTripDataAction(notification.data.id);
    },[notification]);

    const onOptions = (optionsData) =>{
        setOptionsData(optionsData);
        setShowOptions(true);
    }

    return(
    <>
        <Pressable
            onPress={()=>{}}
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
                bg={"gray.50"}
                w = '90%'
                //h = '100%'
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
                >{"You have a new trip!"}</Text>
                {
                    (notificationTripIsLoading == false || notificationTrip == null) ?
                    <Spinner size="lg"/>
                    :
                    <>
                        <TripComponent
                            company={notificationTrip.company}
                            time={notificationTrip.time}
                            tag={notificationTrip.tag}
                            dateStamp= {notificationTrip.date}
                            id={notificationTrip.id}
                            viewTrip={()=>{}}
                            clickable={false}
                            firstPassenger={notificationTrip.first_passenger}
                            total_distance={notificationTrip.total_distance}
                            status={notificationTrip.status}
                            numPassengers={notificationTrip.trips.length}
                            trip_type={notificationTrip.trip_type} 
                        />
                        <AccepDeclineComponent
                            accetText={"Accept trip"}
                            declineText={"Decline trip"} 
                            onOptions={onOptions}
                            type={"trip"}
                        />
                    </>    
                }
                
            </VStack> 
        </Box>
        
    </>
    )
}

export default NotificationPopup;