import React, {useState, useContext, useEffect} from 'react'
import {
    Box,
    Text,
    VStack,
    Pressable,
  } from "native-base"

const EndTripComponent = ({
    onOptions
}) =>
{
    return(
        <Pressable
            bg={'#745D95'}
            py='2'
            borderRadius='10'
            borderColor='#745D95'
            borderWidth='1'
            alignItems='center'
            onPress={()=>onOptions({
                type: "endTrip",
                command: "accept"
            })}

        >
            <Text
                color= 'white'
                fontWeight='bold'
            >End Trip</Text>
        </Pressable>
    )

}
export default EndTripComponent