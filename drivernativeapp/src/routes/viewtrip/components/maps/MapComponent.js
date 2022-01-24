import React, {useState, useContext, useEffect} from 'react'
import {
    Text,
    VStack,
    HStack,
    Center,
    Box,
  } from "native-base"
import { Pressable } from 'react-native';

import RNMap from './RNMAP';

const MapComponent = ({

}) =>
{
    return(
        <VStack
            borderRadius= '10'
            background='#FFFFFF'
            marginY='2'
            py = '2'
            px = '2'
        >
            <Pressable>
                <Center
                    borderRadius= '10'
                    borderColor='#ADABB0'
                    borderWidth='1'
                    py='2'
                    px='2'
                    width= '50%'
                >
                    <Text>Open in Google Maps</Text>
                </Center>
            </Pressable>
            {
                // <RNMap/>
            }
        </VStack>
    )
}
export default MapComponent;