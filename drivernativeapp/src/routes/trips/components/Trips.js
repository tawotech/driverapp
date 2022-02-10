import React, {useState, useContext, useEffect} from 'react'
import Header from '../../../components/Header';
import TripComponent from './TripComponent';
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
    vehicle,
    isLoading,
    assignFcmTokenAction
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

    const viewTrip = (tripId) =>{
        navigation.navigate("viewTrip",{
            tripId
        });
    }

    /*if(isLoading == true)
    {
        return(
            <Center flex = {1}>
                <Spinner size="large"/>
            </Center>
        )
    }*/

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
                            data: incompleteTrips
                        },
                        {
                            title: "Completed Trips",
                            data: completeTrips
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
                        />
                    )
                   
                }}
                renderSectionHeader={({ section: { title } }) => (
                    <Center
                        py='5'
                    >
                        <Heading
                            color='#6E6C71'
                        >{title}</Heading>
                    </Center>
                )}
                refreshing={isLoading}
                onRefresh={()=>getGroupedTripsAction()}
            >
            </SectionList>
        </Box>
    )
}
export default Trips;