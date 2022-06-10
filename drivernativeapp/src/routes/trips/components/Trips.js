import React, {useState, useContext, useEffect} from 'react'
import TripComponent from './TripComponent';
import Options from './options/Options';
import NotificationPopup from './notifications/NotificationPopup';
import {
    Box,
    Text,
    Heading,
    VStack,
    FormControl,
    Input,
    HStack,
    Center,
    Pressable,
    FlatList,
    Button,
    SectionList,
    Spinner
  } from "native-base"
import { useFocusEffect } from '@react-navigation/native';


const Trips = ({
    navigation,
    getGroupedTripsAction,
    completeTrips,
    incompleteTrips,
    isLoading,
    assignFcmTokenAction,
    notifications,
    notificationTrip,
    notificationTripIsLoading,
    getNotificationTripDataAction,
    closeTripNotificationAction,
    notificationAcceptTripAction,
    notificationDeclineTripAction
}) =>
{

    useEffect(()=>{
        // assign fcm token, login successful
        assignFcmTokenAction();
    },[]);

    useFocusEffect(
        React.useCallback(()=>{
            getGroupedTripsAction();
        },[]),
    );

    const [showOptions, setShowOptions] = useState(false);
    const [optionsData, setOptionsData] = useState({});

    const viewTrip = (tripId) =>{
        navigation.navigate("viewTrip",{
            tripId
        });
    }

    return(
        <Box
            bg='#E5E5E5'
        >
            <SectionList
                px = "10px"
                pb = "10px"
                h= '100%'
                sections={
                    [
                        {
                            title: "Today's Trips",
                            data: incompleteTrips,
                            number: incompleteTrips.length
                        },
                        {
                            title: "Completed Trips",
                            data: completeTrips,
                            number: completeTrips.length
                        }
                    ]
                }
                keyExtractor={(item)=> item.trip_id}
                renderItem={({item})=>{  
                    return(
                        <TripComponent
                            time = {item.time}
                            company = {item.company}
                            dateStamp = {item.date}
                            id = {item.trip_id}
                            tag = {item.tag}
                            viewTrip = {viewTrip}
                            clickable={true}
                            firstPassenger = {item.first_passenger}
                            status = {item.status}
                            total_distance={item.total_distance}
                            numPassengers = { item.num_trips}
                            trip_type = {item.trip_type}
                        />
                    )
                   
                }}
                renderSectionHeader={({ section: { title, number } }) => (
                    <HStack
                        py='5'
                        alignItems={"center"}
                        justifyContent={"center"}
                    >
                        <Heading
                            color='#6E6C71'
                        >{title}</Heading>
                        <Heading
                            py={1}
                            px={2}
                            color='#6E6C71'
                            marginLeft={2}
                            bg={"gray.300"}
                            borderRadius={10}
                            fontSize={"sm"}
                            //bg={'#E2E2E2'}
                        >{number}</Heading>
                    </HStack>
                )}
                refreshing={isLoading}
                onRefresh={()=>getGroupedTripsAction()}
            />
            {
                (notifications.length != 0) &&
                <NotificationPopup
                    notification={notifications[0]}
                    notificationTrip={notificationTrip}
                    notificationTripIsLoading={notificationTripIsLoading}
                    getNotificationTripDataAction={getNotificationTripDataAction} 
                    setShowOptions={setShowOptions}
                    setOptionsData={setOptionsData}
                    closeTripNotificationAction={closeTripNotificationAction}
                />
            }
            {
                showOptions &&
                <Options
                    setShowOptions={setShowOptions}
                    optionsData={optionsData}
                    declineTripAction={()=>notificationDeclineTripAction()}
                    acceptTripAction={()=>notificationAcceptTripAction()}
                />
            }

        </Box>
    )
}
export default Trips;