import React, { useEffect, useState } from 'react'
import {
    Box,
    Text,
    VStack,
    HStack,
    Pressable,
    Heading,
    Center,
    Divider
  } from "native-base"

const ContactsComponent = ({
    allContacts,
    openCallDialogAction,
    openSendEmailAction
}) =>{

    return(
        <VStack
            paddingY={3}
        >
            {
                <Center
                    paddingBottom={2}
                >
                    <Heading>Contacts</Heading>
                </Center>
            }
            <VStack
                paddingX={3}
                bg='#FFFFFF'
                borderRadius={10}
                paddingY={2}
            >
                {
                    allContacts.map(function(item,index) {
                        return(

                            <VStack>
                                <Text
                                    fontWeight='bold'
                                    color="#535156"
                                >{`${item.username} ${item.usersurname}   `}</Text>
                                <HStack
                                    justifyContent={"space-between"}
                                >
                                    <Pressable
                                        onPress={()=>openSendEmailAction(item.email)}
                                    >
                                        <Text
                                            fontWeight='bold'
                                            color='#745D95'
                                            underline
                                        >{`${item.email}`}</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={()=>openCallDialogAction(item.contact_number)}
                                    >
                                        <Text
                                            fontWeight='bold'
                                            color='#745D95'
                                            underline
                                        >{`${item.contact_number}`}</Text>
                                    </Pressable>
                                </HStack>
                                {
                                    (index != allContacts.length-1) &&
                                    <Divider marginY={2}/>
                                }
                            </VStack>
                            
                        );
                    })
                }
            </VStack>
            
        </VStack>
    )
}
export default ContactsComponent