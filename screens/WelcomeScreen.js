import { REACT_APP_IPSERVER } from "@env";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Image, StyleSheet, View, ImageBackground, Dimensions } from "react-native";
// Import des composants Button customisés
import { Button, ButtonText } from "../components/Buttons";
// Import du Carousel
import CarouselCards from "../components/carousel/CarouselCards";
// import du module async storage pour local storage
import AsyncStorage from "@react-native-async-storage/async-storage";


const WelcomeScreen = (props) => {

  // variables gestion affichage responsive (pas eu le temps de mettre en place ici) :
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  useEffect(() => {
    // on envoie les données (dont token) du user récupéré du local storage pour charger le store :
    async function getUSerdata(userData) {
      let data = await fetch(`http://${REACT_APP_IPSERVER}/users/getUserData`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${userData.token}`,
      });
      let res = await data.json();
// console.log("user", res.user);
      props.storeUser(res.user); // store chargé avec données uder de la DB
      props.navigation.navigate("TabNavigation"); // changement d'écran vers la TabNavigation
    }

    // on récupère les données du user depuis le local storage :
    AsyncStorage.getItem("user", function (error, data) {
      if (data) {
        var userData = JSON.parse(data); // on parse car les objets/tableaux récupérées sont en string
        getUSerdata(userData); // on appelle la fonction getUSerdata avec le user du local storage en paramètre
      }
    });
  }, []);

  return (

    <ImageBackground
      source={require("../assets/welcomebackground2.png")}
      style={styles.container}
    >
      <Image
        source={require("../assets/logo-light-2.png")}
        style={styles.image}
      />

      <CarouselCards />

      <View style={{ alignItems: "center" }}>
        <Button
          style={{ marginBottom: 10 }}
          size="md"
          color="primary"
          title="S'inscrire"
          onPress={() =>
            props.navigation.navigate("Inscription", { clientType: "client" })
          }
        />
        <ButtonText
          color="light"
          title="Vous avez déjà un compte ?"
          onPress={() => props.navigation.navigate("Connexion")}
        />
        <Button
          style={{ marginTop: 30, marginBottom: 20 }}
          buttonStyle={styles.button}
          size="md"
          color="secondary"
          title="Je suis un prestataire"
          onPress={() =>
            props.navigation.navigate("Inscription", { clientType: "partner" })
          }
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between"
  },
  image: {
    width: 200,
    height: 34.9,
    marginTop: 114,
    alignSelf: "center"
  }
});

// composant conteneur / parent pour récupèrer le user stocké dans le store / state :
function mapStateToProps(state) {
  return { user: state.user }; // utilisé ensuite via props.user
}

// composant conteneur / parent pour stocker le user dans le store :
function mapDispatchToProps(dispatch) {
  return {
    // fonction de dispatch attendant d'être appelée (props.storeUser()) avec un paramètre dans composant de présentation / enfant : 
    storeUser: function (user) {
      dispatch({ type: "storeUser", user }); // appel le reducer qui répondra à action.type === storeUser
    },
  };
}

// on exporte le composant de présentation, mais aussi les composants conteneurs au store (connect) :
export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
