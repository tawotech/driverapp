import React, { useState } from 'react'
import {
    Text,
    Pressable,
    VStack,
    HStack,
    Select,
    Input,
    ScrollView
  } from "native-base"

const Query = ({
    showQueryAction,
    sendQueryAction
}) => {

    const [showQueryForm, setShowQueryForm] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [issueDescription, setIssueDescription] = useState(" ");

    const querySubjects = [
        { label: 'Safety Issue', value: 'Safety Issue' },
        { label: 'Vehicle Issue', value: 'Vehicle Issue' },
        { label: 'Medical Emergency', value: 'Medical Emergency' },
        { label: 'Lost Item', value: 'Lost Item' },
        { label: 'Driver Conduct Issue', value: 'Driver Conduct Issue' },
        { label: 'Other Passenger Issue', value: 'Other Passenger Issue' },
        { label: 'Route Issue', value: 'Route Issue' },
        { label: 'Time Issue', value: 'Time Issue' },
        { label: 'Accident Report', value: 'Accident Report' },
        { label: 'Site Manager Issue', value: 'Site Manager Issue' },
        { label: 'App Issue', value: 'App Issue' },
        { label: 'Account Issue', value: 'Account Issue' },
    ];

    const onSubmit = () =>{
        // call a REST action to submit to the server
        // acesss selected subbject and description
        sendQueryAction({ issueDescription, selectedSubject});
    }

    return(
    <>
        <Pressable
            onPress={()=>{}}
            w={"100%"}
            h={"100%"}
            position={"absolute"}
            alignItems={"center"}
            justifyContent={"center"}
            bg="#000000"
            opacity={0.40}
        />
        {
            ( showQueryForm == false )&&
            <VStack
                //h = "50%"
                bg={"gray.50"}
                w = '80%'
                borderRadius={"10px"}
                position={"absolute"}
                alignItems={"center"}
                justifyContent={"center"}
                borderColor={'gray.300'}
                borderWidth={1}
                px={4}
                py={4}
            >
                <Text
                    color = "#535156"
                    fontWeight={"bold"}
                    fontSize={20}
                >{"Were there any issues with your trip?"}</Text>
                {
                    <HStack
                        mt="5"
                        alignItems={"center"}
                        justifyContent={"space-around"}
                        width={"100%"}
                    >   
                        <Pressable
                            py={2}
                            px={2}
                            bg={"#745D95"}
                            borderColor = {"#FFFFFF"}
                            borderWidth={1}
                            borderRadius={8}
                            alignItems={"center"}
                            justifyContent={"center"}
                            w="40%"
                            onPress={()=>setShowQueryForm(true)}
                        >
                            <Text
                                color = {"#FFFFFF"}
                                fontWeight={"bold"}
                            >Yes</Text>
                        </Pressable>

                        <Pressable
                            py={2}
                            px={2}
                            w="40%"
                            bg={"#745D95"}
                            borderRadius={8}
                            alignItems={"center"}
                            justifyContent={"center"}
                            borderColor={"#FFFFFF"}
                            borderWidth={1}
                            onPress={()=>showQueryAction(false)}
                        >
                            <Text
                                color = "#FFFFFF"
                                fontWeight={"bold"}
                            >No</Text>
                        </Pressable>
                    </HStack>
                }
            </VStack> 
        }
        {
            (showQueryForm ==true) &&
            <ScrollView
                width= '100%'
                height= '100%'
                position={"absolute"}
                bg="#FFFFFF"
                _contentContainerStyle={{
                    mx: "10%",
                    mt: '2',
                    w: '80%'
                }}
            >
                <Text>Please complete and submit your issue.</Text>
                <Select 
                    selectedValue={selectedSubject}
                    //minWidth="200" 
                    width="100%"
                    bg={"#745D95"}
                    color={"#FFFFFF"}
                    fontWeight={"bold"}
                    //accessibilityLabel="Choose Service" 
                    placeholder="Select Query Subject" 
                    placeholderTextColor={"#FFFFFF"}
                    _selectedItem={{
                        bg: "#745D95",
                        color: "#FFFFFF"
                    }}
                    mt={4}
                    mb={4}
                    onValueChange={itemValue => setSelectedSubject(itemValue)}
                >
                    {
                        querySubjects.map((subject,index)=>{
                            return( 
                            <Select.Item 
                                key={index}
                                label={subject.label} 
                                value={subject.value}
                            />)
                        })
                    }
                </Select>

                <Input 
                    placeholder="Enter Query Description" 
                    w="100%" 
                    maxWidth="100%"
                    fontSize={15}
                    onChangeText={(text)=>setIssueDescription(text)}
                />

                {
                    <HStack
                        mt="5"
                        alignItems={"center"}
                        justifyContent={"space-around"}
                        width={"100%"}
                    >   
                        <Pressable
                            py={2}
                            px={2}
                            bg={"#745D95"}
                            borderColor = {"#FFFFFF"}
                            borderWidth={1}
                            borderRadius={8}
                            alignItems={"center"}
                            justifyContent={"center"}
                            w="40%"
                            onPress={()=>onSubmit()}
                        >
                            <Text
                                color = {"#FFFFFF"}
                                fontWeight={"bold"}
                            >Submit</Text>
                        </Pressable>

                        <Pressable
                            py={2}
                            px={2}
                            w="40%"
                            bg={"#745D95"}
                            borderRadius={8}
                            alignItems={"center"}
                            justifyContent={"center"}
                            borderColor={"#FFFFFF"}
                            borderWidth={1}
                            onPress={()=>setShowQueryForm(false)}
                        >
                            <Text
                                color = "#FFFFFF"
                                fontWeight={"bold"}
                            >Cancel</Text>
                        </Pressable>
                    </HStack>
                }
            </ScrollView>
        }
    </>
    )
}

export default Query;