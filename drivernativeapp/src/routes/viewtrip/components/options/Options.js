import React, {useState, useContext, useEffect} from 'react'
import {
    Box,
    ScrollView,
    Spinner,
    Center,
    Text,
    Pressable,
    VStack,
    CloseIcon
  } from "native-base"

const Options = ({optionsData, setShowOptions, onCancel}) => {

    console.log(optionsData);
    return(
    <>
        <Pressable
            onPress={()=>setShowOptions(false)}
            w={"100%"}
            h={"100%"}
            position={"absolute"}
            alignItems={"center"}
            justifyContent={"center"}
        />
        <VStack
            h = "50%"
            bg={"gray.50"}
            w = '80%'
            borderRadius={"10px"}
            position={"absolute"}
            alignItems={"center"}
            justifyContent={"center"}
            borderColor={'gray.300'}
            borderWidth={1}

        >
            <Pressable
                position={"absolute"}
                top={0}
                right={0}
                marginRight={3}
                marginTop={3}
                onPress={()=>setShowOptions(false)}
            >
                <CloseIcon 
                    size="4"
                    color = {'gray.400'} 
                />
            </Pressable>
            <Center>
                <Text
                    color = "#535156"
                    fontWeight={"bold"}
                    fontSize={20}
                    mb={5}
                > Options Menu</Text>
            </Center>
            {
                (optionsData.type == "passenger") &&
                <>
                    <Text>Cancel Trip for</Text>
                    <Center
                    >
                        <Text
                            color = "#535156"
                            fontWeight={"bold"}
                        > {`${optionsData.name} ${optionsData.surname}`}</Text>
                    </Center>

                    <Center
                    >
                        <Text
                            isTruncated
                        >{optionsData.location}</Text>
                    </Center>
                    <Text
                        color = "#535156"
                        fontWeight={"bold"}
                    >To</Text>
                    <Center
                    >
                        <Text
                            isTruncated
                        >{optionsData.destination}</Text>
                    </Center>
                </>
            }
            
            <Pressable
                mt="5"
                w="80%"
                bg={'red.400'}
                alignItems={'center'}
                py={4}
                borderRadius={10}
                onPress={()=>onCancel(optionsData)}
            >
                <Text
                    color = "white"
                    fontWeight={"bold"}
                >Cancel Trip</Text>
            </Pressable>
        </VStack> 
    </>
    )
}

export default Options;