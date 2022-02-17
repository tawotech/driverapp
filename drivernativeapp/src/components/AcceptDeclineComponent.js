import React from 'react'
import {
    HStack,
    Text,
    Pressable
  } from "native-base"


const AccepDeclineComponent = ({
    accetText,
    declineText,
    onOptions,
    type
}) =>
{
    return (
        <HStack
            alignItems={"center"}
            justifyContent={"space-between"}
            w="100%"
        >
            <Pressable
                py={4}
                px={2}
                bg="#745D95"
                borderRadius={8}
                alignItems={"center"}
                justifyContent={"center"}
                w="48%"
                onPress = {()=>onOptions({
                    type,
                    command: "accept"
                })}
            >
                <Text
                    fontWeight={"bold"}
                    color={"#FFFFFF"}
                >{accetText}</Text>
            </Pressable>

            <Pressable
                py={4}
                px={2}
                w="48%"
                borderRadius={8}
                alignItems={"center"}
                justifyContent={"center"}
                borderColor={"#EA5F5F"}
                borderWidth={1}
                onPress={()=>onOptions({
                    type,
                    command: "decline"
                })}
            >
                <Text
                    fontWeight={"bold"}
                    color={"#EA5F5F"}
                >{declineText}</Text>
            </Pressable>
        </HStack>
    )

}

export default AccepDeclineComponent;