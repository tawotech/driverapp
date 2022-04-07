import React from 'react'
import {
    Text,
    VStack,
    HStack,
    Center,
  } from "native-base"
import { Pressable } from 'react-native';



const Passenger = ({
    time,
    index,
    numTrips,
    trip,
    openCallDialogAction
}) =>
{

    const separator = ( numTrips,index) =>{
        let remainder = numTrips % (index+1);
        if( remainder <= 1)
        {
            return false
        }

        return true;
    }
    return(
        <HStack w= "100%">
            <VStack
                justifyContent='space-between'
                pt='1.5'
                pr = '2'
                w ="5%"
            >
                <Center
                    borderWidth='3'
                    borderRadius= '6'
                    borderColor= '#ADABB0'
                    w='3'
                    h='3'
                />
                {
                    trip.trip_type == "inbound" ?
                        [1,2,3,4].map((index)=>(
                            <Center
                                key= {index}
                                h='1'
                                w='0.5'
                                marginTop='1'
                                marginX='1'
                                bg = '#ADABB0'
                            />
                        ))
                    :
                        (index != (numTrips-1)) ?
                            [1,2,3,4].map((index)=>(
                                <Center
                                    key= {index}
                                    h='1'
                                    w='0.5'
                                    marginTop='1'
                                    marginX='1'
                                    bg = '#ADABB0'
                                />
                            ))
                        :
                        <></>
                }
            </VStack>

            <VStack
                w='95%'
            >
                <Text
                    color='#535156'
                    isTruncated
                >{ (trip.trip_type == "inbound") ? trip.location : trip.destination}</Text>
                <HStack justifyContent='space-between'>
                    <Text
                        fontWeight='bold'
                        color="#535156"
                    > {`${trip.name} ${trip.surname}`}</Text>
                    <Pressable
                        onPress={()=>openCallDialogAction(trip.contact_number)}
                    >
                        <Text
                            fontWeight='bold'
                            color='#745D95'
                            underline
                        >{`${trip.contact_number}`}</Text>           
                    </Pressable>
                                        
                </HStack>
                <HStack>
                    <Text
                        fontWeight='bold'
                        color="#535156"
                    > Pickup Time: </Text>
                    <Text>{`${(trip.trip_type == "inbound") ? trip.estimate : time}`}</Text>
                </HStack>
                {
                    trip.trip_type == "inbound" ?
                        (index != (numTrips-1)) && 
                        <Center
                            borderTopWidth='2'
                            borderTopColor='#EEEDF0'
                            marginTop='1'
                            w = '100%'
                        />
                    :
        
                        ()=>{
                            if (separator() == true){
                                return(
                                    <Center
                                        borderTopWidth='2'
                                        borderTopColor='#EEEDF0'
                                        marginTop='1'
                                        w = '1 00%'
                                    />
                                )
                            }
                            else
                            {
                                return (<></>)
                            }
                            
                        }
                                
                      
                }
            </VStack>
        </HStack>
    )
}
export default Passenger;