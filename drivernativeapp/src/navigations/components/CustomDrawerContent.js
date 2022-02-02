import React,{useContext} from 'react'
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
  } from '@react-navigation/drawer';

  import { SafeAreaView } from 'react-native-safe-area-context';

import {
    View, 
    Text,
    VStack,
    HStack,
    Center,
    Pressable,
} from 'native-base'

import Header from '../../components/Header';
import { AuthContext } from '../../components/context';


const CustomDrawerContent = () =>
{
    const {logout} =  useContext(AuthContext);

    return(
        <SafeAreaView
            style={{
                flex:1
            }}
        >
            <DrawerContentScrollView
            >
                <Center
                    marginTop = '10'
                >
                    <Pressable>
                        <Text
                            fontSize = {20}
                            fontWeight = "bold"
                            color ='#535156'
                        >Today's Trips</Text>
                    </Pressable>
                   
                </Center>
                <Center
                    marginTop ={5}
                >
                    <Text
                        fontSize = {20}
                        fontWeight = "bold"
                        color ='#535156'
                    >Terms and Conditions</Text>
                </Center>
                <Center
                    marginTop ={5}
                >
                    <Pressable
                        onPress = {()=>logout()}
                    >
                        <Text
                            fontSize = {20}
                            fontWeight = "bold"
                            color ='#535156'
                        >Logout</Text>
                    </Pressable>
                </Center>
            </DrawerContentScrollView> 
            <HStack 
                borderTopWidth = '2'
                borderColor = '#EEEDF0'
                py = '10'
            >
                <Center
                    pl ='10'
                >
                    <Text>Icon</Text>
                </Center>
                <Center
                    pl ='5'
                >
                    <Text>Tawona Mushinga</Text>
                </Center>
            </HStack>
        </SafeAreaView>
                   
    )
}

export default CustomDrawerContent
