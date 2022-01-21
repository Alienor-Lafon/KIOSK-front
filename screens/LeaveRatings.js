import { REACT_APP_IPSERVER } from '@env';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Input, AirbnbRating } from 'react-native-elements';
import { HeaderBar } from '../components/Header'
import  CompanyCard  from '../components/CompanyCard'
import { Button, ButtonText } from "../components/Buttons";


const LeaveRatingsScreen = (props) => {

    const [ rate, setRate ] = useState(0);
    const [ feedback, setFeedback ] = useState("");
    const [ companyId, setCompanyId ] = useState(
        props.route.params && props.route.params.companyId // paramètres envoyés depuis la page précédente avec props.navigation.navigate
        ? props.route.params.companyId
        : null);

    // useEffect d'initialisation de la page Company :
    useEffect(() => {
// console.log(props.route && props.route.params && props.route.params.companyId);
        // fonction pour chargement des infos de la compagnie loggée :
        async function loadDataCie() {
            // appel route get pour récupérer données company (avec labels & offers) + ratings :
            var rawDataCie = await fetch(`http://${REACT_APP_IPSERVER}/companies/${companyId}/${props.user.token}`);
            var dataCie = await rawDataCie.json();
// console.log("dataCie", dataCie.company);
            if (dataCie.result) {
                setCompanyId(dataCie.company); // set état company avec toutes data
            }
        }
        loadDataCie();
        }, []);

    const sendRating = async () => {
// console.log("dans fonction sendRating");
        const saveRate = await fetch(`http://${REACT_APP_IPSERVER}/ratings/${props.user.token}`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 
                `feedback=${feedback}&
                rating=${rate}&
                dateRating=${new Date()}&
                clientId=${props.user.companyId}&
                providerId=${companyId._id}&
                userId=${props.user._id}`
        })
        var dataRate = await saveRate.json() // récupère la nouvelle évaluation
// console.log("dataRate", dataRate);
        props.navigation.navigate("Rating"); // renvoie vers page Rating
        setFeedback(dataRate.newRatingSaved.feedback) // set état feedback écrit nouvel avis
// console.log("dataRate.newRatingSaved.feedback", dataRate.newRatingSaved.feedback);
// console.log("dans fonction sendRating BIS");
};

    if (companyId) {

        return (
    
    <View style={{flex:1}}>

        <HeaderBar
            onBackPress={() => props.navigation.goBack()}
            leftComponent
            title="Votre avis"
            navigation={props.navigation} // voir propriété navigation du composant HeaderBar
            user={props.user} // infos du store du user
        >
        </HeaderBar>

            <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:"white"}}>

                <KeyboardAvoidingView behavior="position" 
                    // contentContainerStyle={{alignItems: "center", paddingLeft:20, paddingRight: 20}}
                >

                    <View style={{flex:1, paddingBottom:80, backgroundColor:"white"}}>
                        <View style={{ top:10, paddingLeft:15, paddingRight: 15}}>
                            <CompanyCard
                                navigation={props.navigation}
                                dataCompany={companyId}
                            />
                        </View>

                        <View style={{top:40, paddingLeft:15, paddingRight: 15}}>
                            <Input
                                value={feedback}
                                label={`Décrivez votre expérience avec ${companyId.companyName}`}
                                placeholder='En quelques mots'
                                onChangeText={(value) => setFeedback(value)}
                            />
                        </View>

                        <View style={{height:50, justifyContent:"center", top:50, paddingLeft:15, paddingRight: 15}}>
                            <AirbnbRating
                                type="custom"
                                selectedColor="#F47805"
                                unSelectedColor="#F4780533"
                                reviewColor="#F47805"
                                defaultRating={0}
                                count={5}
                                size={30}
                                showRating={false}
                                onFinishRating={(rating) => setRate(rating)}
                            />
                        </View>

                        <View style={{top:50, paddingHorizontal:15, paddingVertical:20, alignItems:"center"}}>
                            <View style={{paddingBottom:10}}>
                                <Button 
                                    title="Poster l'avis"
                                    size="md"
                                    color="primary"
                                    onPress={() => sendRating()}
                                >
                                </Button>
                            </View>
                            <ButtonText 
                                title="Annuler" 
                                onPress={() => props.navigation.goBack()}
                            >
                            </ButtonText>
                        </View>

                    </View>

                </KeyboardAvoidingView>

            </ScrollView>

    </View>

    )

    } else {
        return null
    }

};

// composant conteneur / parent pour récupèrer le user stocké dans le store / state :
function mapStateToProps(state) {
    return { user: state.user }  // utilisé ensuite via props.user
};

// on exporte le composant de présentation, mais aussi le composant conteneur au store (connect) :
export default connect(mapStateToProps, null)(LeaveRatingsScreen);


