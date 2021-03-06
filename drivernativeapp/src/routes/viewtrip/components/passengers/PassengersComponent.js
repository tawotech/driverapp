import React, {useState, useContext, useEffect} from 'react'
import {
    VStack
  } from "native-base"

import Passenger from './Passenger'
import Destination from './Destination'
import Origin from './Origin'

const PassengersComponent = ({
    time,
    trips,
    order,
    openCallDialogAction
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
                (trips[0].trip_type != "inbound") &&
                <Origin origin={trips[0].location}/>
            }
            {
                order.split(",").map((id,index)=>{
                    let trip = trips.filter((trip)=>(trip.id == id));
                    if(trip.length == 0) return (<></>);
                    
                    return(
                        <Passenger 
                            time = {time}
                            key = {index}
                            trip = {trip[0]}
                            index = {index}
                            numTrips = {trips.length}
                            openCallDialogAction = {openCallDialogAction}
                        />
                    )
                })
            }
            {
                (trips[0].trip_type == "inbound") &&
                <Destination destination = {trips[0].destination}/>
            }
        </VStack>
    )

}
export default PassengersComponent