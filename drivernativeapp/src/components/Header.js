import React from 'react'
import {
    HStack,
    Center,
    Image,
    HamburgerIcon,
    ChevronLeftIcon  
  } from "native-base"

import { images } from '../components/context';

const Header = ({navigation, showBackIcon} ) =>
{

    return(
        <HStack
            w='100%'
            h= "10%"
            bg = '#FFFFFF'
            alignItems={'center'}
            justifyContent={'center'}
        >
            {
                showBackIcon &&
                <Center
                    position='absolute'
                    left='0'
                    pl={5}
                >
                    <ChevronLeftIcon  
                        size = '8'
                        color= '#ADABB0'
                    />
                </Center>
            }
           
            <Image
                size={8}
                resizeMode={"contain"}
                source={images.locationIcon}
                alt="Alternate Text"
            />
            <Center
                position='absolute'
                right = '0'
                pr={5}
            >
                <HamburgerIcon 
                    size = '8'
                    color= '#ADABB0'
                />
            </Center>
        </HStack>
        
    )
}
export default Header;