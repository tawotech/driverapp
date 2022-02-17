import React, {useState, useContext, useEffect} from 'react'
import {
    Text,
    VStack,
    HStack,
    Center,
    Box,
  } from "native-base"
import { Pressable,Alert } from 'react-native';

import RNMap from './RNMAP';

const MapComponent = ({
    openInGoogeMapsAction,
    navigation
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
            <Pressable
                onPress={()=>openInGoogeMapsAction(navigation)}
            >
                <Center
                    borderRadius= '10'
                    borderColor='#745D95'
                    borderWidth='1'
                    py='2'
                    px='2'
                    width= '100%'
                >
                    <Text
                        fontWeight={"bold"}
                        color="#745D95"
                    >Open in Google Maps</Text>
                </Center>
            </Pressable>
            {
                // <RNMap/>
            }
        </VStack>
    )
}
export default MapComponent;