import { REACT_APP_IPSERVER } from '@env'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';

import { Card } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';
import { HeaderBar } from '../components/Header'
import OfferCardLight from '../components/OfferCardLight';


const PacksResultsScreen = (props) => {

    const [ packOffers, setPackOffers ] = useState([]);
    const [ packId, setPackId ] = useState(props?.route.params?.packId ? props.route.params.packId : null)

    // useEffect d'initialisation de la page PacksResulScreen :
    useEffect(() => {
        // on récupère les infos en DB des offres correspondantes au Pack ciblé :
        async function loadDataPacksOffers() {
            // appel route get pour récupérer les offres :
            var rawDataPackOffer = await fetch(`http://${REACT_APP_IPSERVER}/recherche/getPacks/${packId}`); // (`adresseIPserveur/route appelée/req.params?req.query`)
            var dataPackOffer = await rawDataPackOffer.json();
            if (dataPackOffer.result) {
                setPackOffers(dataPackOffer.packOffers) // set de l'état avec les offres renvoyées du back / DB
            }
// console.log("dataPackOffer", dataPackOffer);
// console.log("dataCategory.categoriePack._id", dataCategory.categoriePack._id);
        }
        loadDataPacksOffers();
    }, []);

    return (
    
    <View style={{ flex: 1, backgroundColor: "white" }}>

        <HeaderBar
            title={props.route.params.packName}
            onBackPress={() => props.navigation.goBack()}
            leftComponent
            navigation={props.navigation} // voir propriété navigation du composant HeaderBar
            user={props.user} // infos du store du user
        ></HeaderBar>

        <ScrollView showsVerticalScrollIndicator={false}>

            <View>
            
                <Card key={1} containerStyle={styles.container} >

                    {
                    packOffers && packOffers.offers ? packOffers.offers.map((e, i) => (
                    <View key={i}>
                        <OfferCardLight dataOffre={e} navigation={props.navigation} />
                    </View>
                    ))
                    : null 
                    }

                </Card>

            </View>

        </ScrollView>

    </View>

    )
};

const styles = StyleSheet.create({
    container: {
        padding: 0,
        backgroundColor: 'transparent',
        borderWidth: 0,
        shadowColor: 'rgba(0,0,0, 0.0)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        marginBottom: 0,
        padding: 0
    }
});

// composant conteneur / parent pour récupèrer le user stocké dans le store / state :
function mapStateToProps(state) {
    return { user: state.user } // utilisé ensuite via props.user
};

// on exporte le composant de présentation, mais aussi le composant conteneur au store (connect) :
export default connect(mapStateToProps, null)(PacksResultsScreen);