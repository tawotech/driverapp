import React, {useContext, useState} from 'react'
//import { View, Text, TextInput, Button } from "react-native";
import { AuthContext } from '../../../components/context';

import {
    Box,
    Text,
    Heading,
    VStack,
    FormControl,
    Input,
    HStack,
    Center,
    Pressable
  } from "native-base"


const Login = ({navigation}) =>
{

    const [data, setData] = useState({
        email: 'tawomusash@gmail.com',
        password: 'Musash8606'
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
                    etapath
                </Heading>
                <VStack space={3} mt="5">
                    <FormControl>
                        <Input 
                            size ='md'
                            placeholder='email'
                            value= {data.email}
                            borderColor={"#ADABB0"}
                            color={"#9B999E"}
                            onChangeText={(text)=> onEmailChanged(text)}
                        />
                    </FormControl>
                    <FormControl>
                        <Input 
                            size ='md'
                            placeholder='password'
                            type="password"
                            borderColor={"#ADABB0"}
                            borderWidth={"1"}
                            color={"#9B999E"}
                            value={data.password}
                            onChangeText={(text)=> onPasswordChanged(text)}
                        />
                    </FormControl>
                    <Pressable 
                        mt="2" 
                        //colorScheme = "purple.400"
                        bg = {'brand.900'}
                        alignItems={"center"}
                        rounded = "sm"
                        py={3}
                        onPress={()=>login(data.email, data.password)}
                    >
                        <Text 
                            color={"white"}
                            fontWeight={"bold"}
                        >
                            Login
                        </Text>
                    </Pressable>
                </VStack>
            </Box>
        </Center>
        

    )
}
export default Login;