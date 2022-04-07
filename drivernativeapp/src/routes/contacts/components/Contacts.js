import React, {useEffect} from 'react'

import {
    Center,
    ScrollView,
    VStack,
    Heading,
    Pressable,
    Text
} from "native-base"

import { Linking } from 'react-native';
import ContactsComponent from './ContactsComponent';
import EmergencyContactsComponent from './EmergencyContactsComponent';
import EtapathSitesComponent from './EtapathSitesComponent';
import FleetsComponent from './FleetsComponent';

import { queryUrl } from '../../../components/context';

const Contacts = ({
    getContacts,
    allContacts,
    fleets,
    emergency,
    etapathSites,
    openCallDialogAction,
    openSendEmailAction
}) =>
{
    useEffect(()=>{
        getContacts()
    },[]);

    const openQueryForm = () => {
        try{
            Linking.openURL(queryUrl);
        }catch(e)
        {
            console.log("could not open query form");
        }
    }

    return(
        <Center
            //flex={1}
            w= '100%'
            bg='#E5E5E5'
        >
            {
                <ScrollView
                    width= '100%'
                    height= '100%'

                    _contentContainerStyle={{
                        px: "10px",
                        pt: '2',
                        w: '100%'
                    }}
                >
                    <EtapathSitesComponent
                        etapathSites={etapathSites}
                    />
                    <FleetsComponent
                        fleets={fleets}
                    />
                    <EmergencyContactsComponent
                        emergency = {emergency}
                    />
                    <ContactsComponent
                        allContacts = {allContacts}
                        openCallDialogAction = {openCallDialogAction}
                        openSendEmailAction= {openSendEmailAction}
                    />
                    <VStack>
                        {
                            <Center marginBottom={3}>
                                <Heading>Lodge Query</Heading>
                            </Center>
                        }
                        <Pressable
                            onPress={()=>openQueryForm()}
                            py={3}
                            px={3}
                            bg="#745D95"
                            borderColor = "#FFFFFF"
                            borderWidth={1}
                            borderRadius={8}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <Text
                                fontWeight={"bold"}
                                color={"#FFFFFF"}
                            >Open query form</Text>
                        </Pressable>
                    </VStack>
                    <VStack marginY={5}/>
                </ScrollView>
            }
        </Center>
    )
}
export default Contacts;