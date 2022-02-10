import React, { useEffect, useState } from 'react'
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
    Button
  } from "native-base"
import InnerStatusComponent from './InnerStatusComponet'

const MONTH_OF_THE_YEAR = ["JAN","FEB","MAR","APR", "MAY", "JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
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
        month: 0
    })

    useEffect(()=>{
        let tripDate = new Date(dateStamp);
        let _month = tripDate.getMonth();
        let _date = tripDate.getDate();
        setDateMonth({
                month: _month,
                date: _date
        });

    },[]);


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
                <InnerStatusComponent status={status}/>
                <VStack 
                    bg='#D8D5DF'
                    py='2'
                    px = '2'
                    borderLeftRadius='10'
                >
                    <Center
                        bg='#745D95'
                        px = '2'
                        py= '2'
                        borderRadius='10'
                    >
                        <Text
                            fontSize='sm'
                            fontWeight='bold'
                            color='#FFFFFF'
                        >{dateMonth.date}</Text>
                        <Text
                            fontSize='sm'
                            fontWeight='bold'
                            color='#FFFFFF'
                        >{MONTH_OF_THE_YEAR[dateMonth.month]}</Text>
                    </Center>
                </VStack>
                <VStack
                    pl='2'
                    py='2'
                >
                    <HStack>
                        <VStack>
                            <Text
                                color='#ADABB0'
                            >TIME</Text>
                            <Text
                                color='#535156'
                                fontWeight='bold'
                            >{time}</Text>
                        </VStack>

                        <VStack
                            pl= '2'
                        >
                            <Text
                                color='#ADABB0'   
                            >COMPANY</Text>
                            <Text
                                color='#535156'
                                fontWeight='bold'
                            >{company}</Text>
                        </VStack>

                    </HStack>
                    <Box pt = '2'>
                        <Text
                            color='#ADABB0'   
                        >TOTAL DISTANCE</Text>
                        <Text
                            color='#535156'
                            fontWeight='bold'
                        >{total_distance}</Text>
                    </Box>
                    {
                        /*<Box pt = '2'>
                            <Text
                                color='#ADABB0'   
                            >REF NUMBER</Text>
                            <Text
                                color='#535156'
                                fontWeight='bold'
                            >{tag}</Text>
                        </Box>*/ 
                    }
                    <Box pt = '2'>
                        <Text
                            color='#ADABB0'   
                        >NUMBER OF PASSENGERS</Text>
                        <Text
                            color='#535156'
                            fontWeight='bold'
                        >{numPassengers}</Text>
                    </Box>
                    <Box pt = '2'>
                        <Text
                            color='#ADABB0'   
                        >FIRST PASSENGER</Text>
                        <Text
                            color='#535156'
                            fontWeight='bold'
                        >{`${firstPassenger}`}</Text>
                    </Box>
                </VStack>
            </HStack>
        </Pressable>
    )
}
export default TripComponent