import React from 'react'
import {
    Text,
    Pressable,
    VStack
  } from "native-base"


const MessageBox = ({
    message,
    setShowMessageBox
}) => {

    return(
    <>
        <Pressable
            onPress={()=>setShowMessageBox(false,"")}
            w={"100%"}
            h={"100%"}
            position={"absolute"}
            alignItems={"center"}
            justifyContent={"center"}
            bg="#000000"
            opacity={0.40}
        />
        <VStack
            //h = "50%"
            bg={"gray.50"}
            w = '80%'
            borderRadius={"10px"}
            position={"absolute"}
            alignItems={"center"}
            justifyContent={"center"}
            borderColor={'gray.300'}
            borderWidth={1}
            px={4}
            py={4}
        >
           <Text
                color = "#535156"
                fontWeight={"bold"}
                fontSize ={20}
                marginBottom={5}
            >
               Message
            </Text>
            <Text
                color = "#535156"
                marginBottom={5}
            >
               {message}
            </Text>
            
            <Pressable
                py={2}
                px={2}
                bg="#745D95"
                borderColor = "#FFFFFF"
                borderWidth={1}
                borderRadius={8}
                alignItems={"center"}
                justifyContent={"center"}
                w="40%"
                onPress={()=>setShowMessageBox(false,"")}
            >
                <Text
                    color={"#FFFFFF"}
                >Ok</Text>   
            </Pressable>
        </VStack> 
    </>
    )
}

export default MessageBox;