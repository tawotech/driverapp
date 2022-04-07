import React, { useEffect, useState } from 'react'
import {
    Box,
    Text,
    VStack,
    HStack,
    Pressable,
    Center,
    Heading,
  } from "native-base"

const EtapathSitesComponent = ({
    etapathSites
}) =>{

    return(
        <VStack>
            {
                <Center>
                    <Heading>Etapath Sites</Heading>
                </Center>
            }
            {
                Object.keys(etapathSites).map(function(key, index) {
                    return(
                        <VStack
                            marginY={3}
                            paddingX={3}
                            bg='#FFFFFF'
                            borderRadius={10}
                            paddingY={2}
                        >
                            
                            {
                                <Box
                                    marginBottom={2}
                                >
                                    <Text
                                        fontWeight={"bold"}
                                    >{key}</Text>
                                </Box>
                                
                            }
                            {
                                etapathSites[key].map(item =>{
                                    return(
                                        <Text
                                            fontWeight='bold'
                                            color="#535156"
                                        >{`${item.username} ${item.usersurname}`}</Text>
                                    )
                                })
                            }
                        </VStack>
                    );
                })
            }
        </VStack>
    )
}
export default EtapathSitesComponent