import React, {useState, useContext, useEffect} from 'react'
import {
    Text,
    VStack,
    HStack,
    Center,
  } from "native-base"


import MapView from 'react-native-maps'



const RNMap = ({

}) =>
{

    return(
        <Center 
            w = '100%' 
            h ='100%'
            pt = '2'
        >
            <MapView
                provider='google'
                style = {{ 
                    width: '100%',
                    height: '100%'
                }}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
            </MapView>
        </Center>
    )
}
export default RNMap;