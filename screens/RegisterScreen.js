import React, { useState, useEffect, useCallback, useRef } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Button, ButtonText } from "../components/Buttons";
import * as ImagePicker from "expo-image-picker";
import { useForm } from "react-hook-form";
import { Input, Image } from "react-native-elements";

import LottieView from "lottie-react-native";

import { REACT_APP_IPSERVER } from "@env"; // mettre à la place de notre url d'ip // varibale d'environnement

const RegisterScreen = (props) => {
  const animation = useRef(null);
  // Initialisation des états
  const [currentStep, setCurrentStep] = useState(1),
    [isLoading, setIsLoading] = useState(false),
    [signUpErrorMessage, setSignUpErrorMessage] = useState(false),
    [imgProfil, setImgProfil] = useState(null);

  const clientType = props.route.params && props.route.params.clientType;

  // Demande de l'autorisation d'accéder à la galerie d'image de l'utilisateur
  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // on récupère l'uri de l'image et on la stocke dans un état
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    setImgProfil(pickerResult.uri);
  };

  // initialisation de useForm()
  const { handleSubmit, setValue } = useForm();

  // fonction qui se déclenche à la validation du formulaire
  const onSubmit = async (formData) => {
    setIsLoading(true);
    animation.current.play();
    if (formData.email.length > 0 && formData.password.length > 0) {
      let bodyCompany = `companyName=${formData.companyName}`;
      if (formData.companyAddress) {
        bodyCompany += `&address=${formData.companyAddress}`;
      }
      if (formData.companySIRET) {
        bodyCompany += `&siret=${formData.companySIRET}`;
      }
      if (clientType) {
        bodyCompany += `&type=${clientType}`;
      }

      // requête pour créer une company via les infos récupérer du formulaire
      let company = await fetch(`http://${REACT_APP_IPSERVER}/companies/`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: bodyCompany,
      });
      let resCompany = await company.json();
      if (resCompany.result) {
        // on créé le body de la prochaine requête (pour créer un user)
        let body = `email=${formData.email}&password=${formData.password}&companyId=${resCompany.company._id}`;
        if (formData.firstName) {
          body += `&firstName=${formData.firstName}`;
        }
        if (formData.lastName) {
          body += `&lastName=${formData.lastName}`;
        }
        if (formData.role) {
          body += `&role=${formData.role}`;
        }
        if (formData.phone) {
          body += `&phone=${formData.phone}`;
        }
        if (clientType) {
          body += `&type=${clientType}`;
        }

        // on check si l'utilisateur a ajouter une image de profil
        if (imgProfil) {
          var data = new FormData();
          data.append("avatar", {
            uri: imgProfil,
            type: "image/jpeg",
            name: "user_avatar.jpg",
          });
          // requête pour héberger l'image de profil
          let resUpload = await fetch(
            `http://${REACT_APP_IPSERVER}/users/avatar`,
            {
              method: "post",
              body: data,
            }
          );
          resUpload = await resUpload.json();

          // on ajoute l'url de l'image héberger au body de la prochaine requête
          if (resUpload.result) {
            body += `&avatar=${resUpload.url}`;
          }
        }

        // requête pour créer un nouvel utilisateur
        let user = await fetch(`http://${REACT_APP_IPSERVER}/users/`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body,
        });
        let res = await user.json();
        if (res.result) {
          setIsLoading(false);
          // on store l'utilisateur dans le store
          props.storeUser(res.user);
          // on navigue vers la page company
          if (clientType === "partner") {
            //props.navigation.navigate('CompanyPage', { companyId: res.user.companyId});
            props.navigation.push("TabNavigation", {
              screen: "Accueil",
              params: {
                screen: "CompanyPage",
                params: { companyId: res.user.companyId },
              },
            });
          } else {
            props.navigation.push("TabNavigation");
          }
        } else {
          setSignUpErrorMessage(res.message);
        }
      } else {
        setSignUpErrorMessage(res.message);
      }
    } else {
      let error = [];
      if (formData.email.length === 0) {
        error.push("email");
      }
      if (formData.password.length === 0) {
        error.push("password");
      }
      setSignUpErrorMessage(error.join(", ") + " missing");
    }
  };
  const onChangeField = useCallback(
    (name) => (text) => {
      setValue(name, text);
    },
    []
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: "space-between",
    },
    logoContainer: {
      alignItems: "center",
    },
    buttonContainer: {
      alignItems: "center",
      marginBottom: 33,
    },
    logo: {
      width: 200,
      height: 34.9,
      marginTop: 114,
    },
    profil: {
      width: 179,
      height: 179,
      marginBottom: 11,
      borderRadius: 100,
    },
    form: {
      alignItems: "center",
      marginHorizontal: 45,
      marginTop: 20,
    },
    input: {
      borderBottomColor: "#FAF0E6",
    },
    inputText: {
      color: "#fff",
    },
    label: {
      color: "#fff",
      fontWeight: "normal",
    },
    text: {
      color: "white",
      fontSize: 22,
      lineHeight: 32,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },
  });

  const Step1 = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.text}>
            Veuillez renseigner vos informations personnelles
          </Text>
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
            placeholder="Choisissez un mot de passe"
            onChangeText={onChangeField("password")}
            label="Mot de passe"
            inputStyle={styles.inputText}
            inputContainerStyle={styles.input}
            labelStyle={styles.label}
            placeholderTextColor="#DCDCDC"
          />
        </View>
      </ScrollView>
    );
  };

  const Step2 = () => {
    return (
      <View style={styles.form}>
        <Text style={styles.text}>
          Veuillez renseigner vos informations personnelles
        </Text>
        <Input
          autoCompleteType="name"
          textContentType="name"
          placeholder="Votre prénom"
          onChangeText={onChangeField("firstName")}
          inputStyle={styles.inputText}
          label="Prénom"
          inputContainerStyle={styles.input}
          labelStyle={styles.label}
          placeholderTextColor="#DCDCDC"
        />
        <Input
          autoCompleteType="name"
          textContentType="familyName"
          placeholder="Votre nom"
          onChangeText={onChangeField("lastName")}
          inputStyle={styles.inputText}
          label="Nom"
          inputContainerStyle={styles.input}
          labelStyle={styles.label}
          placeholderTextColor="#DCDCDC"
        />
        <Input
          autoCompleteType="tel"
          textContentType="telephoneNumber"
          keyboardType="numeric"
          placeholder="Votre numéro de téléphone pro"
          onChangeText={onChangeField("telephoneNumber")}
          inputStyle={styles.inputText}
          label="Téléphone pro"
          inputContainerStyle={styles.input}
          labelStyle={styles.label}
          placeholderTextColor="#DCDCDC"
        />
        <Input
          autoCompleteType="off"
          textContentType="jobTitle"
          placeholder="Votre rôle dans l'entreprise"
          onChangeText={onChangeField("role")}
          inputStyle={styles.inputText}
          label="Rôle"
          inputContainerStyle={styles.input}
          labelStyle={styles.label}
          placeholderTextColor="#DCDCDC"
        />
      </View>
    );
  };

  const Step3 = () => {
    return (
      <View style={styles.form}>
        <Text style={styles.text}>
          Veuillez renseigner vos informations personnelles
        </Text>
        <TouchableOpacity onPress={openImagePickerAsync}>
          {imgProfil ? (
            <Image source={{ uri: imgProfil }} style={styles.profil} />
          ) : (
            <Image
              source={require("../assets/profil-pic.png")}
              style={styles.profil}
            />
          )}
        </TouchableOpacity>
        <ButtonText
          color="light"
          title="Ajouter votre photo de profil"
          onPress={openImagePickerAsync}
        />
      </View>
    );
  };

  const Step4 = () => {
    return (
      <View style={styles.form}>
        <Text style={styles.text}>
          Veuillez renseigner les informations concernant l’entreprise
        </Text>
        <Input
          autoCompleteType="off"
          textContentType="organizationName"
          placeholder="Le nom de l’entreprise"
          onChangeText={onChangeField("companyName")}
          inputStyle={styles.inputText}
          label="Nom"
          inputContainerStyle={styles.input}
          labelStyle={styles.label}
          placeholderTextColor="#DCDCDC"
        />
        <Input
          autoCompleteType="street-address"
          textContentType="fullStreetAddress"
          placeholder="L'adresse du siège social"
          onChangeText={onChangeField("companyAddress")}
          inputStyle={styles.inputText}
          label="Adresse"
          inputContainerStyle={styles.input}
          labelStyle={styles.label}
          placeholderTextColor="#DCDCDC"
        />
        <Input
          autoCompleteType="off"
          textContentType="none"
          placeholder="Le numéro SIRET"
          onChangeText={onChangeField("companySIRET")}
          inputStyle={styles.inputText}
          label="SIRET"
          inputContainerStyle={styles.input}
          labelStyle={styles.label}
          placeholderTextColor="#DCDCDC"
        />
      </View>
    );
  };

  let Step;
  switch (currentStep) {
    case 1: {
      Step = Step1;
      break;
    }
    case 2: {
      Step = Step2;
      break;
    }
    case 3: {
      Step = Step3;
      break;
    }
    case 4: {
      Step = Step4;
      break;
    }
  }

  return (
    <View style={styles.container}>
      <LottieView
        loop
        ref={animation}
        style={[
          {
            position: "absolute",
            top: "25%",
            left: 0,
            zIndex: 10,
            width: "100%",
            height: "50%",
            backgroundColor: "transparent",
          },
          !isLoading && { zIndex: -1, transform: [{ scale: 0 }] },
        ]}
        source={require("../assets/loading.json")}
        // OR find more Lottie files @ https://lottiefiles.com/featured
        // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
      />
      <ImageBackground
        source={require("../assets/background-login.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.image}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/logo-light-2.png")}
              style={styles.logo}
            />
          </View>
          <SafeAreaView>
            <Step />
          </SafeAreaView>

          <View style={styles.buttonContainer}>
            {currentStep === 4 ? (
              <Button
                style={isLoading && { zIndex: -1, transform: [{ scale: 0 }] }}
                size="md"
                color="primary"
                title="Valider"
                onPress={handleSubmit(onSubmit)}
              />
            ) : (
              <Button
                size="md"
                color="primary"
                title="Suivant"
                onPress={() => setCurrentStep(currentStep + 1)}
              />
            )}
            {currentStep === 1 ? (
              <ButtonText
                style={{ margin: 10, padding: 10 }}
                color="light"
                title="Annuler"
                onPress={() => props.navigation.navigate("Bienvenue")}
              />
            ) : (
              <ButtonText
                style={{ margin: 10, padding: 10 }}
                color="light"
                title="Précédent"
                onPress={() => setCurrentStep(currentStep - 1)}
              />
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    storeUser: function (user) {
      dispatch({ type: "storeUser", user });
    },
  };
}

export default connect(null, mapDispatchToProps)(RegisterScreen);
