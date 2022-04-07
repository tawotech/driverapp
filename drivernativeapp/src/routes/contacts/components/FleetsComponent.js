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

const FORMARTED_ROLES = {
    general: "General",
    accident_reporting: "Accident Reporting",
    vehicle_repairs: "Vehicle Repairs",
    queries: "Queries",
    driver_complaints: "Driver Complaints",
    document_issues: "Document Issues"
} 

const FleetsComponent = ({
    fleets
}) =>{

    return(
        <VStack>
            {
                <Center>
                    <Heading>Fleets</Heading>
                </Center>
            }
            {
                Object.keys(fleets).map(function(key, index) {
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
                                fleets[key].map(item =>{
                                    return(

                                        <HStack>
                                            <Text
                                                fontWeight='bold'
                                                color="#535156"
                                            >{`${item.username} ${item.usersurname} - `}</Text>
                                            <Text>
                                                {`${FORMARTED_ROLES[item.special_role]}`}
                                            </Text>
                                        </HStack>
                                        
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
export default FleetsComponent