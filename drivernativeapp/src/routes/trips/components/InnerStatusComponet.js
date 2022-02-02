import React, { useEffect, useState } from 'react'
import {
    Text,
    Center
} from "native-base"

const color = (status) =>{
    if(status == "scheduled")
    {
        return ['blue.500', 'blue.100']
    }
    else if(status == "accepted")
    {
        return ['yellow.500', 'yellow.100']
    }
    else if ( status == "on_route" || status == "trips_completed" )
    {
        return ['green.500', 'green.100']
    }
    else if (status == "complete")
    {
        return ['gray.500','gray.100']
    }
    else
    {
        return ['grey.500','grey.100']
    }

}

const InnerStatusComponent = ({
    status
}) =>{
    return(
        <Center
            key={status}
            position="absolute"
            right ='0'
            top = '0'
            marginTop='2'
            marginRight='2'
            borderRadius='8'
            borderWidth='1'
            borderColor={color(status)}
            bg={color(status)[1]}
            px = '1'
            py = '1'
        >
            {
                status == "scheduled" &&
                <Text
                    color={color(status)[0]}
                >{status}</Text>
            }
            {
                status == "accepted" &&
                <Text
                    color={color(status)[0]}
                >{status}</Text>
            }
            {
                status == "on_route" &&
                <Text
                    color={color(status)[0]}
                >On route</Text>
            }
            {
                (status == "trips_completed") &&
                <Text
                    color={color(status)[0]}
                >On route</Text>
            }
            {
                status == "complete" &&
                <Text
                    color={color(status)[0]}
                >{status}</Text>
            }
        </Center>
    )
}
export default InnerStatusComponent