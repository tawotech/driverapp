import React, {useState, useContext, useEffect} from 'react'
import { Linking } from 'react-native'
import {
    Box,
    ScrollView,
    Spinner,
    Center,
    Text,
    Pressable,
    VStack
  } from "native-base"

import { WebView } from 'react-native-webview' 

const MapView = ({
    navigation,
    route
}) =>
{
    const url = route.params.url;
    const url2 = "http://maps.google.com/maps?q=loc:-26.1834,28.0630&navigate=yes"
    const url3= "http://maps.google.com/maps?navigate=yes&daddr=-26.1834,28.0630+to:-26.2748385,27.8359801"
    const url4= "http://maps.google.com/maps/dir/-26.1834,28.0630/-26.2748385,27.8359801&navigate=yes&mode=driving"
    const url5= "google.navigation:q=-26.2748385,27.8359801"

    //-26.180290,28.076225

    const [toggle, setToggle] = useState(false)

    return(
        <>
            <WebView
                source={{ uri: url }}
                onShouldStartLoadWithRequest={request => {
                    let url = request.url;
                    //console.log("requets url is:" + request.url)
                    Linking.openURL(url);
                    return false;
                }}
            />
            <Center
                //flex={1}
                w= '100%'
                bg='#E5E5E5'
                h = "10%"
            >
                <Text>Toggle Open Prompts</Text>
            </Center>
        </>
        
    )
}
export default MapView;