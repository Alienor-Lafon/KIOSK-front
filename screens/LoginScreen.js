import { REACT_APP_IPSERVER } from "@env";
import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { Input, Image } from "react-native-elements";
import { Button, ButtonText } from "../components/Buttons";
import { useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";


const LoginScreen = (props) => {

  const [isLogin, setIsLogin] = useState(false);
  const [signInErrorMessage, setSignInErrorMessage] = useState(false); // erreurs prêtes mais pas affichées
  const { handleSubmit, setValue } = useForm(); // hook de gestion des formulaires

  // callback déclenché que quand bouton cliqué
  const onSubmit = useCallback(async (formData) => { // formData pour utilisation useForm (diff de upload fichiers)
// console.log(formData);
    // si un email et un password sont bien entrés : on les envoie en post pour connexion
    if (formData.email.length > 0 && formData.password.length > 0) { 
      let user = await fetch(`http://${REACT_APP_IPSERVER}/users/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${formData.email}&password=${formData.password}`,
      });
      let res = await user.json(); // recup infos user
      if (res.result) { // si le back renvoi true = le user existe :
// console.log("found");
        setIsLogin(true);
        props.storeUser(res.user); // on charge infos user dans store
        AsyncStorage.setItem("user", JSON.stringify(res.user)); // et aussi dans local storage
        props.navigation.navigate("TabNavigation"); // et on passe sur la tabnavigation
      } else {
// console.log("not found");
        setSignInErrorMessage(res.message); // si user pas trouvé on renvoie le message du back correspondant
      }
    } else { // si ni un email ni un passwword ne sont entrés :
      let error = []; // on créé un tableau d'erreur
      if (signInEmail.length === 0) {
        error.push("email"); // où on push cette string si email pas entré
      }
      if (signInPassword.length === 0) {
        error.push("password"); // ou cette string si password pas entré
      }
      setSignInErrorMessage(error.join(", ") + " missing"); // l'état est setté avec le tableau d'erreur
    }
  }, []);

// callback déclenché que quand texte change dans input :
  const onChangeField = useCallback(
    (name) => (text) => {
      setValue(name, text);
    },[]);


  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background-login.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo-light-2.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.form}>
          <Text style={styles.text}>Connexion</Text>
          <Input
            autoCompleteType="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            placeholder="Votre email pro"
            onChangeText={onChangeField("email")}
            inputStyle={styles.inputText}
            label="Adresse email pro"
            inputContainerStyle={styles.input}
            labelStyle={styles.label}
            placeholderTextColor="#DCDCDC"
          />
          <Input
            secureTextEntry
            autoCompleteType="password"
            placeholder="Entrez votre mot de passe"
            onChangeText={onChangeField("password")}
            label="Mot de passe"
            inputStyle={styles.inputText}
            inputContainerStyle={styles.input}
            labelStyle={styles.label}
            placeholderTextColor="#DCDCDC"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            size="md"
            color="primary"
            title="Connexion"
            onPress={handleSubmit(onSubmit)}
          />
          <ButtonText
            color="light"
            title="Annuler"
            onPress={() => props.navigation.navigate("Bienvenue")}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  image: {flex: 1, justifyContent: "space-between"},
  logoContainer: {alignItems: "center"},
  buttonContainer: {alignItems: "center", marginBottom: 33},
  logo: {width: 200, height: 34.9, marginTop: 114},
  form: {alignItems: "center", marginHorizontal: 45},
  input: {borderBottomColor: "#FAF0E6"},
  inputText: {color: "#fff"},
  label: {color: "#fff", fontWeight: "normal"},
  text: {
    color: "white",
    fontSize: 22,
    lineHeight: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 60
  }
});

// composant conteneur / parent pour stocker le user dans le store :
function mapDispatchToProps(dispatch) {
  return {
    // fonction de dispatch attendant d'être appelée (props.storeUser()) avec un paramètre dans composant de présentation / enfant :
    storeUser: function (user) {
      dispatch({ type: "storeUser", user }); // appel le reducer qui répondra à action.type === storeUser
    },
  };
}

// on exporte le composant de présentation, mais aussi le composant conteneur au store (connect) :
export default connect(null, mapDispatchToProps)(LoginScreen);
