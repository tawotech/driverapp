import React, {useState, useContext, useEffect} from 'react'
import {
    Text,
    VStack,
    HStack,
    Center
  } from "native-base"



const Origin = ({
    origin
}) =>
{
    return(
        <HStack w= "100%">
            <VStack
                justifyContent='space-between'
                pt='1.5'
                pr = '2'
                w ="5%"
            >
                <Center
                    borderWidth='3'
                    borderRadius= '6'
                    borderColor= '#ADABB0'
                    w='3'
                    h='3'
                />
                {
                    [1,2].map((index)=>(
                        <Center
                            key= {index}
                            h='1'
                            w='0.5'
                            marginTop='1'
                            marginX='1'
                            bg = '#ADABB0'
                        />
                    ))
                }
            </VStack>

            <VStack
                w='95%'
            >
                <Text
                    color='#535156'
                    isTruncated
                >{origin}</Text>
                <Center
                    borderTopWidth='2'
                    borderTopColor='#EEEDF0'
                    marginTop='2'
                    w = '100%'
                />
            </VStack>
        </HStack>
    )
}
export default Origin;