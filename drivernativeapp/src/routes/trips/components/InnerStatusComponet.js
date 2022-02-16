import React, { useEffect, useState } from 'react'
import {
    Text,
    Center
} from "native-base"

const color = (status) =>{
    if(status == "scheduled")
    {
        return ['#0075FF', '#D9E8FA']
    }
    else if(status == "accepted")
    {
        return ['#B99928', '#FFEEB2']
    }
    else if ( status == "on_route" || status == "trips_completed" )
    {
        return ['#53AB67', '#D1FBDA']
    }
    else if (status == "complete")
    {
        return ['#5A5A5A','#E5E5E5']
    }
    else
    {
        return ['#5A5A5A','#E5E5E5']
    }

}

const InnerStatusComponent = ({
    status
}) =>{
    return(
        <Center
            key={status}
            marginTop='2'
            borderRadius='8'
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