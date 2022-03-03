import React from 'react'
import {
    HStack,
    Center,
    Image,
    HamburgerIcon,
    ChevronLeftIcon  
  } from "native-base"

import { images } from '../components/context';
import { Pressable } from 'react-native';

const Header = ({navigation, showBackIcon, status, showMenuButton} ) =>
{
    const onGoBack = () =>{
        navigation.navigate("trips");
    }

    const openAppDrawer = ()=>{
        navigation.toggleDrawer();
    }

    return(
        <HStack
            w='100%'
            h= '20'
            bg = '#FFFFFF'
            alignItems={'center'}
            justifyContent={'center'}
            shadow={"9"}
        >
            {
                (showBackIcon && status != "on_route" && status != "trips_completed") &&
                    <Center
                        position='absolute'
                        left='0'
                        pl={5}
                    >
                        <Pressable
                            onPress={()=> onGoBack()}
                        >
                            <ChevronLeftIcon  
                                size = '8'
                                color= '#ADABB0'
                            />
                        </Pressable>

                    </Center>
            }
           
            <Image
                size={8}
                resizeMode={"contain"}
                source={images.locationIcon}
                alt="Alternate Text"
            />
            
            {
                status != "on_route" && status != "trips_completed" && showMenuButton == true &&
                <Center
                    position='absolute'
                    right = '0'
                    pr={5}
                >
                    <Pressable
                        onPress={()=>openAppDrawer()}
                    >
                        <HamburgerIcon 
                            size = '8'
                            color= '#ADABB0'
                        />
                    </Pressable>

                </Center>
            }
        </HStack>
        
    )
}
export default Header;