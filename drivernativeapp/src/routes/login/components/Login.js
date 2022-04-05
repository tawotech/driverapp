import React, {useContext, useState,useEffect} from 'react'
import { AuthContext } from '../../../components/context';
import { images } from '../../../components/context';

import {
    Box,
    Text,
    Heading,
    VStack,
    FormControl,
    Input,
    Center,
    Pressable,
    Image
  } from "native-base"

import PushNotification from 'react-native-push-notification';
import MessageBox from '../../../components/MessageBox';

const Login = ({
    showMessageBox, 
    message,
    setShowMessageBox
}) =>
{
    const createChannels = () => {
        PushNotification.createChannel({
            channelId: "app-channel",
            channelName: "App Channel"
        })
    }

    useEffect(()=>{
        createChannels();
    },[]);

    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const {login} = useContext(AuthContext);    
    const onEmailChanged = (text)=>{
        setData({
            ...data,
            email: text
        });
    }
    const onPasswordChanged = (text) =>{
        setData({
            ...data,
            password: text
        });
    }

    return(
        <Center flex={1} px={3}>
            <Box safeArea w = {90+'%'}>
                <Heading
                    mt="1"
                    mb="10"
                    color="brand.900"
                    fontWeight="bold"
                    size="xl"
                    textAlign="center"
                >
                    <Image
                        size={8}
                        resizeMode={"contain"}
                        source={images.locationIcon}
                        alt="Alternate Text"
                    />
                    etapath
                </Heading>
                <VStack space={3} mt="5">
                    <FormControl>
                        <Input 
                            size ='xl'
                            placeholder='email'
                            value= {data.email}
                            borderColor={"#ADABB0"}
                            color={"#696969"}
                            onChangeText={(text)=> onEmailChanged(text)}
                            py={4}
                        />
                    </FormControl>
                    <FormControl>
                        <Input 
                            size ='xl'
                            placeholder='password'
                            type="password"
                            borderColor={"#ADABB0"}
                            borderWidth={"1"}
                            color={"#696969"}
                            value={data.password}
                            onChangeText={(text)=> onPasswordChanged(text)}
                            py={4}
                        />
                    </FormControl>
                    <Pressable 
                        mt="5" 
                        //colorScheme = "purple.400"
                        bg = {'brand.900'}
                        alignItems={"center"}
                        rounded = "sm"
                        py={5}
                        onPress={()=>login(data.email, data.password)}
                    >
                        <Text 
                            color={"white"}
                            fontWeight={"bold"}
                            fontSize = "lg"
                        >
                            Login
                        </Text>
                    </Pressable>
                </VStack>
            </Box>
            {
                showMessageBox &&
                <MessageBox
                    setShowMessageBox = {setShowMessageBox}
                    message={message}
                />
            }
        </Center>
        

    )
}
export default Login;