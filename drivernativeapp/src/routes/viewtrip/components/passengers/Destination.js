import React, {useState, useContext, useEffect} from 'react'
import {
    Text,
    VStack,
    HStack,
    Center,
    Box
  } from "native-base"



const Destination = ({
    destination
}) =>
{
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
            </VStack>

            <Box
                w='95%'
            >
                <Text
                    color='#535156'
                >{destination}</Text>
            </Box>
        </HStack>
    )
}
export default Destination;