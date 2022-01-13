import React, {useState, useContext} from 'react'
import { View, Text, Button} from "react-native";
import { AuthContext } from '../../../components/context';

const Trips = ({navigation}) =>
{
    const {logout} =  useContext(AuthContext);

    return(
        <View>
            <Text
                style = {{
                    marginBottom: 10
                }}
            >
                Trips Page
            </Text>
            <Button 
                title =  'logout' 
                onPress = {()=> logout()}
            />   
        </View>
    )
}
export default Trips;