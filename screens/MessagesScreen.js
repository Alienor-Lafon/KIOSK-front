import React from 'react';
import { View, Text } from 'react-native';
import {HeaderBar} from '../components/Header'

const MessagesScreen = (props) => {
    
    return (
            <HeaderBar
            title = "Messages"
            onPress={() => onBackPress()}
            leftComponent
            locationIndication
            location="Paris">
                
            </HeaderBar>
           
      
    );
};

export default MessagesScreen;