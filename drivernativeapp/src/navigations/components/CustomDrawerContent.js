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
    Image
} from 'native-base'

import { AuthContext } from '../../components/context';
import { images } from '../../components/context';


const CustomDrawerContent = ({name, surname, startDate,navigation}) =>
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
                    <Pressable
                        onPress={()=>{
                            navigation.navigate("trips");
                        }}
                    >
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
                    <Pressable
                        onPress={()=>{
                            navigation.navigate("terms");
                        }}
                    >
                        <Text
                            fontSize = {20}
                            fontWeight = "bold"
                            color ='#535156'
                        >Terms and Conditions</Text>
                    </Pressable>
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
                pl = '5'
                justifyContent={"flex-start"}
                alignItems={"center"}
            >
                <Center
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <Image
                        size={16}
                        resizeMode={"contain"}
                        source={images.ellipse}
                        alt="Alternate Text"
                    />
                    <Image
                        size={8}
                        resizeMode={"contain"}
                        source={images.useralt}
                        alt="Alternate Text"
                        position={'absolute'}
                    />
                </Center>
                <View
                    pl ='5'
                >
                    <Text
                        fontWeight={"bold"}
                        fontSize={17}
                    >{`${name} ${surname}`}</Text>
                    <Text
                        fontSize={12}
                        color={'#ADABB0'}
                    >{`Driver since ${startDate}`}</Text>
                </View>
            </HStack>
        </SafeAreaView>
                   
    )
}

export default CustomDrawerContent
