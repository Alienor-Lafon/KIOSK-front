import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ScrollView, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { HeaderBar } from '../components/Header';
import Text from "../components/Text";
import { ListItem, Avatar } from 'react-native-elements';
import { REACT_APP_IPSERVER } from '@env'


const MessagesScreen = (props) => {
    const isFocused = useIsFocused();
    const [conversations, setConversations] = useState([])

    //ce code permet de couper les messages trop longs
    // if (conversation.message.message.length > 35) {
    //     conversation.message.message = conversation.message.message.slice(0, 35) + "..."
    // }
    
    useEffect(() => {
        const findConversations = async () => {
            const data = await fetch(`http://${REACT_APP_IPSERVER}/conversations/${props.user.companyId}/${props.user.type}/${props.user.token}`)
            const body = await data.json();
            setConversations(body.conversationsToDisplay)
        }; 
        isFocused && findConversations();
    }, [isFocused]);
    //permet de déclencher le useEffect et de mettre à jour les conversations du user lorsqu'on retourne sur l'écran "messagesscreen"

    //boucle sur ce qu'on récupère du back.
    var conversationsList = conversations.map((conversation, i) => {
        return (
            <ListItem containerStyle={{
                justifyContent: 'space-around'

        }}
        //envoi de l'id de la conversation vers chat afin de récupérer les messages qui y correspondent
            onPress={() => props.navigation.navigate('Chat', {convId: conversation.id})}
            key={i}
        >
            <Avatar rounded size="small" imageProps={{resizeMode: 'contain'}} title={conversation.companyName.substring(0, 2)}
                source={{ uri: conversation.logo }}></Avatar>
            <ListItem.Content>

                    <ListItem.Title
                        style={{ color: "#1A0842", fontSize: 20, fontWeight: "bold", marginBottom: 5 }}
                    ><Text style={{ fontWeight: "bold" }}>{conversation.companyName}</Text></ListItem.Title>
                    <ListItem.Subtitle style={{ color: "#1A0842", fontSize: 12 }}><Text>{conversation.message}</Text></ListItem.Subtitle></ListItem.Content>
                <Text style={{ color: "#1A0842", fontSize: 12 }}><Text>{conversation.date}</Text></Text>
            </ListItem>)

    })
    return (
        <View><HeaderBar
            title="Messages"
            navigation={props.navigation}
            user={props.user}
        >

        </HeaderBar>
            <ScrollView showsVerticalScrollIndicator={false}>
                {conversationsList}
            </ScrollView></View>


    );
};

function mapStateToProps(state) {
    return { user: state.user }
}
export default connect(mapStateToProps, null)(MessagesScreen)