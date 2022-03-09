import React, { useEffect, useState } from 'react'
import {
    Box,
    Text,
    VStack,
    HStack,
    Pressable
  } from "native-base"
import InnerStatusComponent from './InnerStatusComponet'

const MONTH_OF_THE_YEAR = ["JAN","FEB","MAR","APR", "MAY", "JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const DAY_OF_WEEK = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

const TripComponent = ({
    company,
    time,
    tag,
    dateStamp,
    id,
    viewTrip,
    clickable,
    firstPassenger,
    status,
    total_distance,
    numPassengers
}) =>{

    const [dateMonth,setDateMonth] = useState({
        date: 0,
        month: 0,
        day: 0
    })

    useEffect(()=>{
        let tripDate = new Date(dateStamp);
        let _month = tripDate.getMonth();
        let _date = tripDate.getDate();
        let _day = tripDate.getDay()
        setDateMonth({
                month: _month,
                date: _date,
                day: _day
        });

    },[]);

    const formatedTime = (time) =>{
        let _time = time.substring(0, time.length - 2);
        let _suffix = time.substring(time.length-2, time.length);
        return [_time,_suffix];
    }

    return(
        <Pressable
            onPress={()=> viewTrip(id)}
            disabled = {(clickable == true) ? false : true }
        >
            <HStack
                borderRadius='10'
                bg ='#FFFFFF'
                marginBottom='2'
            >
                <VStack 
                    bg='#745D95'
                    py='2'
                    px = '2'
                    borderLeftRadius='10'
                >
                    
                    <Text
                        fontSize='sm'
                        fontWeight='bold'
                        color='#FFFFFF'
                    >{`${DAY_OF_WEEK[dateMonth.day]}, ${dateMonth.date} ${MONTH_OF_THE_YEAR[dateMonth.month]}`}</Text>
                    <Text
                        color='#FFFFFF'
                        fontWeight='bold'
                    >{`${formatedTime(time)[0]}`}
                        <Text
                            fontSize={"xs"}
                        >
                            {` ${formatedTime(time)[1]}`}
                        </Text>
                    </Text>
                    <InnerStatusComponent status={status}/>
                </VStack>
                <HStack
                    pl='2'
                    py='2'
                >
                    <VStack>
                        <Box
                            marginBottom={2}
                        >
                            <Text
                                color='#ADABB0'
                                fontWeight={"bold"}   
                            >Distance</Text>
                            <Text
                                color='#535156'
                                fontWeight='bold'
                            >{total_distance}</Text>
                        </Box>

                        <Box>
                            <Text
                                color='#ADABB0'
                                fontWeight={"bold"}      
                            >Passengers</Text>
                            <Text
                                color='#535156'
                                fontWeight='bold'
                            >{numPassengers}</Text>
                        </Box>
                       
                    </VStack>
                    <VStack
                        marginLeft={4}
                    >
                        <Box
                            marginBottom={2}
                        >
                            <Text
                                color='#ADABB0'
                                fontWeight={"bold"}      
                            >Company</Text>
                            <Text
                                color='#535156'
                                fontWeight='bold'
                                isTruncated
                            >{company}</Text>
                        </Box>
                        
                        <Box>
                            <Text
                                color='#ADABB0'  
                                fontWeight={"bold"}    
                            >First Pickup</Text>
                            <Text
                                color='#535156'
                                fontWeight='bold'
                            >{`${firstPassenger}`}</Text>
                        </Box>
                    </VStack>
                </HStack>
            </HStack>
        </Pressable>
    )
}
export default TripComponent