import React, { useEffect, useState } from 'react'
import {
    Box,
    Text,
    VStack,
    HStack,
    Pressable,
    Center,
    Heading
  } from "native-base"

const EmergencyContactsComponent = ({
    emergency
}) =>{
    return(
        <VStack>
            {
                <Center
                    marginBottom={2}
                >
                    <Heading>Emergency Contacts</Heading>
                </Center>
            }
            <VStack
                paddingX={3}
                bg='#FFFFFF'
                borderRadius={10}
                paddingY={2}
            >
                {
                    emergency.map(function(item) {
                        return(
                            <Text
                                fontWeight='bold'
                                color="#535156"
                            >{`${item.username}  ${item.usersurname}`}</Text>
                        );
                    })
                }
            </VStack>
        </VStack>
    )
}
export default EmergencyContactsComponent