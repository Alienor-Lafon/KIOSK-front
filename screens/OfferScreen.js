import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { Card, ListItem, Overlay } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

import Text from "../components/Text";

import { LinearGradient } from 'expo-linear-gradient';

import { AntDesign } from '@expo/vector-icons';

import { Button, ButtonText } from '../components/Buttons';
import { HeaderBar } from '../components/Header';

import { REACT_APP_IPSERVER } from '@env'; // mettre à la place de notre url d'ip avec http:// devant = varibale d'environnement

import { connect } from 'react-redux';

import CompanyCard from '../components/CompanyCard';

import LottieView from "lottie-react-native";


const OfferScreen = (props) => {
    const animation = useRef(null);
    var data = "";
    var displayOfferImg; // aller chercher une image dans le téléhone du presta
    var displayDescOffer; // input
    var displayLabels; // affichage en list des labels à ajouter
    var displayOffers; // aller cherche une offre en DB ?

    const [offer, setOffer] = useState(null),
        [company, setCompany] = useState(null),
        [offerId, setOfferId] = useState(props.route.params && props.route.params.offerId ? props.route.params.offerId : null ), // recupère paramètre de pros.navigation.navigate
        [token, setToken] = useState(null),
        [visible, setVisible] = useState(false),
        [inputOverlay, setInputOverlay] = useState(''),
        [valueToChange, setValueToChange] = useState(null),
        [image, setImage] = useState(null),
        [isLiked, setIsLiked] = useState(false);



    const styles = StyleSheet.create({
        container: {
            padding: 0,
            backgroundColor: 'transparent',
            borderWidth: 0,
            shadowColor: 'rgba(0,0,0, 0.0)', // Remove Shadow for iOS
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0, // Remove Shadow for Android
            margin: 0,
            width: '100%'
        },
    })


    useEffect(() => {
        // setToken(props.user.token);
        //setOfferId(props.route.params.offerId);
        async function loadDataOffer() {
            // appel route put pour modifier données offer
            var rawDataOffer = await fetch(`http://${REACT_APP_IPSERVER}/offers/${offerId}/${token}`); // (`adresseIPserveur/route appelée/req.params?req.query`)
            var res = await rawDataOffer.json();
            if (res.result) {
                setOffer(res.offer);
                setCompany(res.company);
                setImage(res.offer.offerImage);
                setToken(props.user.token);
            }
        }
        loadDataOffer();

        // get like status in store user
        var user = props.user;
        var userLikes = user.favorites;
        setIsLiked(userLikes.some(e => e.offerId && e.offerId === offerId));
    }, []);

    const toggleOverlay = (value) => {
        setVisible(!visible);
        setValueToChange(value);
        if (value === 'description') {
            offer.description && setInputOverlay(offer.description);
        }
        if (value === 'engagement') {
            setInputOverlay('');
        }
    };

    // Demande de l'autorisation d'accéder à la galerie d'image de l'utilisateur
    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        // on récupère l'uri de l'image et on la stocke dans un état
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if(pickerResult.uri) {
            setImage(pickerResult.uri);
            var data = new FormData();
            data.append('image', {
                uri: pickerResult.uri,
                type: 'image/jpeg',
                name: 'image_header.jpg'
            });
            // requête pour héberger l'image de profil
            let resUpload = await fetch(`http://${REACT_APP_IPSERVER}/image`, {
                method: 'post',
                body: data
            })
            resUpload = await resUpload.json();

            // on ajoute l'url de l'image héberger au body de la prochaine requête
            if (resUpload.result) {
                let body = `token=${token}&image=${resUpload.url}`;
                const dataRaw = await fetch(`http://${REACT_APP_IPSERVER}/offers/${offerId}`, { // renvoie jsute result, donc true ou flase
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: body
                })
                var res = await dataRaw.json(); // true ou false
                if (res.result) {
                    setOffer(res.offer);
                }
            }
        }
    }

    const handleContactClick = async () => {
        let body = `token=${token}&receiverId=${company._id}&senderId=${props.user.companyId}`;
        const dataRaw = await fetch(`http://${REACT_APP_IPSERVER}/conversations/new`, { // renvoie jsute result, donc true ou flase
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        })
        var res = await dataRaw.json(); // true ou false
        if (res.result) {
            props.navigation.navigate('Chat', {convId: res.conversation._id});
        }
    }

    const handleCommitmentDelete = async (commitmentId) => {
        let body = `token=${token}&commitmentId=${commitmentId}`;
        const dataRaw = await fetch(`http://${REACT_APP_IPSERVER}/offers/${offerId}`, { // renvoie jsute result, donc true ou flase
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        })
        var res = await dataRaw.json(); // true ou false
        if (res.result) {
            setOffer(res.offer);
        }
    }

    const handleOverlaySubmit = async () => {
        setVisible(!visible);
        let body = `token=${token}`;
        if (valueToChange === 'description') {
            body += `&description=${inputOverlay}`
        }
        if (valueToChange === 'engagement') {
            body += `&commitment=${inputOverlay}`
        }
        const dataRaw = await fetch(`http://${REACT_APP_IPSERVER}/offers/${offerId}`, { // renvoie jsute result, donc true ou flase
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        })
        var res = await dataRaw.json(); // true ou false
        if (res.result) {
            setOffer(res.offer);
        }
    }

    const handleLikeClick = async () => {
        !isLiked ? animation.current.play(0, 40) : animation.current.play(40, 75);
        let body = `token=${token}&offerId=${offerId}&userId=${props.user._id}`;
        const dataRaw = await fetch(`http://${REACT_APP_IPSERVER}/offers/like`, { // renvoie jsute result, donc true ou flase
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        })
        var res = await dataRaw.json(); // true ou false
        if (res.result) {
            props.storeUser(res.user);
        }
    }

    if (image) {
        displayOfferImg =
            <ImageBackground
                source={{ uri: image }}
                style={{ height: 200 }} /* ATTENTION SIZING IMAGE A REVOIR */
            >
                <TouchableOpacity style={{ 
                        backgroundColor: '#fff', 
                        position: "absolute",
                        top: "37%",
                        right: 10,
                        zIndex: 10,
                        width: 56,
                        height: 56,
                        borderRadius: 50,
                        shadowColor: "rgba(0,0,0,0.4)",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5
                    }}
                    onPress={() => handleLikeClick()}
                >
                <LottieView
                    ref={animation}
                    loop={false}
                    progress={isLiked ? 0.5 : 0}
                    style={[
                    {
                        marginTop: 2,
                        backgroundColor: "transparent",
                    }
                    ]}
                    source={require("../assets/like.json")}
                    // OR find more Lottie files @ https://lottiefiles.com/featured
                    // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
                />
                </TouchableOpacity>
                { props.user && props.user.type === "partner" && (
                <View style={{ position: "absolute", bottom: "5%", right: "5%" }}>
                    <ButtonText
                        color="light"
                        title="Modifier"
                        onPress={() => openImagePickerAsync()}
                    />
                </View>
                )}
            </ImageBackground>
    } else {
        displayOfferImg =
            <ImageBackground
                source={require('../assets/image_company_blank.png')}
                style={{ height: 200 }} /* ATTENTION SIZING IMAGE A REVOIR */
            >
                { props.user && props.user.type === "partner" && (
                <View style={{ position: "absolute", bottom: "5%", right: "5%" }}>
                    <ButtonText
                        color="light"
                        title="Ajouter"
                        onPress={() => openImagePickerAsync()}
                    />
                </View>
                )}
            </ImageBackground>
    };

    if (offer && offer.description) {
        displayDescOffer =
            <Card key={1} containerStyle={styles.container}>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Card.Title style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontWeight: "bold" }}>Ce que nous proposons</Text>
                    </Card.Title>
                    { props.user && props.user.type === "partner" && (
                    <ButtonText
                        color="secondary"
                        title="Modifier"
                        onPress={() => toggleOverlay('description')}
                    />
                    )}
                </View>
                <Text style={{ marginHorizontal: 10, marginBottom: 10 }}>{offer.description}</Text>
            </Card>

    } else {
        displayDescOffer =
            <Card key={1} containerStyle={styles.container}>
                <Card.Title style={{ marginHorizontal: 10, textAlign: "left" }}
                ><Text style={{ fontWeight: "bold" }}>Ce que nous proposons</Text></Card.Title>
                { props.user && props.user.type === "partner" && (
                <View style={{ backgroundColor: "#FAF0E6", height: 160, justifyContent: "center", alignItems: "center" }}>
                    <ButtonText
                        color="secondary"
                        title="Ajouter une description"
                        onPress={() => toggleOverlay('description')}
                    />
                </View>
                )}
            </Card>
    };

    if (offer && offer.commitments.length > 0) {
        displayLabels =
            <Card key={1} containerStyle={styles.container}>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Card.Title style={{ marginHorizontal: 10 }}
                    ><Text style={{ fontWeight: "bold" }}>Nos engagements</Text></Card.Title>
                    { props.user && props.user.type === "partner" && (
                    <ButtonText
                        color="secondary"
                        title="Ajouter"
                        onPress={() => toggleOverlay('engagement')}
                    />
                    )}
                </View>
                <View>
                    {offer.commitments.map((l, i) => (
                        <ListItem key={i}>
                            <AntDesign name="check" size={24} color="black" />
                            <ListItem.Content>
                                <ListItem.Title><Text>{l.commitment}</Text></ListItem.Title>
                            </ListItem.Content>
                            { props.user && props.user.type === "partner" && (
                            <AntDesign onPress={() => handleCommitmentDelete(l._id)} name="delete" size={24} color="black" />
                            )}
                        </ListItem>
                    ))}
                </View>
            </Card>
    } else {
        displayLabels =
            <Card key={1} containerStyle={styles.container}>
                <Card.Title style={{ marginHorizontal: 10, textAlign: "left" }}
                ><Text style={{ fontWeight: "bold" }}>Nos engagements</Text></Card.Title>
                { props.user && props.user.type === "partner" && (
                <View style={{ backgroundColor: "#FAF0E6", height: 160, justifyContent: "center", alignItems: "center" }}>
                    <ButtonText
                        color="secondary"
                        title="Ajouter des engagements"
                        onPress={() => toggleOverlay('engagement')}
                    />
                </View>
                )}
            </Card>
    };
    if (company) {
        displayOffers = (
            <Card key={1} containerStyle={styles.container}>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Card.Title
                    style={{ marginHorizontal: 10 }}><Text style={{ fontWeight: "bold" }}>Qui sommes-nous ?</Text></Card.Title>
                </View>
                <CompanyCard dataCompany={company} navigation={props.navigation} />
            </Card>
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#fff' }}>
            <Overlay overlayStyle={{ width: "80%", padding: 30, borderRadius: 20 }} isVisible={visible} onBackdropPress={() => toggleOverlay()}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <TextInput
                        placeholder={'Entrez votre ' + valueToChange}
                        value={inputOverlay}
                        multiline={true}
                        onChangeText={(value) => setInputOverlay(value)}
                        style={{ marginVertical: 30 }}
                    />
                    <Button
                        color="primary"
                        size="md"
                        title="Valider"
                        onPress={() => handleOverlaySubmit()}
                    />
                </KeyboardAvoidingView>
            </Overlay>
            <HeaderBar
                title={offer && offer.offerName ? offer.offerName : 'No name'}
                onBackPress={() => props.navigation.goBack()}
                leftComponent
                navigation={props.navigation}
                locationIndication
                user={props.user}
                location={company && company.offices && company.offices.length > 0 && company.offices[0].postalCode+' '+company.offices[0].city+', '+company.offices[0].country}>
            </HeaderBar>

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* IMAGE ENTREPRISE */}
                <View>
                    {displayOfferImg}
                </View>

                {/* CARD INFOS COMPANY */}
                <View style={{ flex: 1, paddingVertical: 10 }}>
                    {displayDescOffer}
                </View>

                {/* CARD LABELS COMPANY */}
                <View style={{ flex: 1, paddingVertical: 10 }}>
                    {displayLabels}
                </View>

                {/* CARD OFFRES COMPANY */}
                <View style={{ flex: 1, paddingBottom: 60 }}>
                    {displayOffers}
                </View>

            </ScrollView>
            
            { company && props.user.companyId != company._id && (
            <LinearGradient
            style={{height: 60, zIndex: 2, position: 'absolute', bottom: 0, left: 0, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 40}}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)']}
            >
                <Button color="primary" title="Demander un devis" size="md" onPress={()=>props.navigation.navigate("QuoteRequest", {providerId : company._id,
                    offerId: offerId})}></Button>
                <Button color="secondary" size="md" title="Contacter" onPress={() => handleContactClick()} />
            </LinearGradient>
            )}

        </View>
    );

};

// on récupère le user stocké dans le store : 
function mapStateToProps(state) {
    return { user: state.user }
};
function mapDispatchToProps(dispatch) {
    return {
      storeUser: function (user) {
        dispatch({ type: "storeUser", user });
      },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(OfferScreen);
