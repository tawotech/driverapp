import React, {useState, useContext, useEffect} from 'react'
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
    ScrollView,
  } from "native-base"

import Passenger from './Passenger'
import Destination from './Destination'

const PassengersComponent = ({
    trips,
    order
}) =>
{
    return(
        <VStack
            w="100%"
            borderRadius='10'
            bg='#FFFFFF'
            px='2'
            py='2'
        >
            {
                order.split(",").map((id,index)=>{
                    let trip = trips.filter((trip)=>(trip.id == id))
                    return(
                        <Passenger 
                            key = {index}
                            trip = {trip[0]}
                            index = {index}
                            numTrips = {trips.length}
                        />
                    )
                })
            }
            <Destination destination = {trips[0].destination}/>
        </VStack>
    )

}
export default PassengersComponent