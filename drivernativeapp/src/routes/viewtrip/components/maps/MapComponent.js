import React from 'react'
import {
    Text,
    VStack,
    Center,
  } from "native-base"
import { Pressable } from 'react-native';

const MapComponent = ({
    openInGoogeMapsAction,
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
                onPress={()=>{
                    //registerListeners();
                    openInGoogeMapsAction();
                }}
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