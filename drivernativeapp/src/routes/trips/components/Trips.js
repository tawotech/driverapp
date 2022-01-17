import React, {useState, useContext, useEffect} from 'react'
import { AuthContext } from '../../../components/context';
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
    SectionList
  } from "native-base"

const Trips = ({
    navigation,
    getGroupedTripsAction,
    completeTrips,
    incompleteTrips,
    vehicle
}) =>
{
    const {logout} =  useContext(AuthContext);
    useEffect(()=>{
        getGroupedTripsAction();
    },[]);

    return(
        <Box
            bg='#E5E5E5'
        >
            {
                /*<Button 
                    title =  'logout' 
                    onPress = {()=> logout()}
                />*/
            }   
            <Header showBackIcon = {false}/>
            <SectionList
                px = "20px"
                pb = "10px"
                h= '90%'
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

            >
            </SectionList>
        </Box>
    )
}
export default Trips;