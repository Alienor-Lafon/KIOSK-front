import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

//import de composants personnalisés
import { Button, ButtonText } from "../../components/Buttons";

import { Input, Image } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";

import { REACT_APP_IPSERVER } from "@env";


const CompanyProfileScreen = (props) => {
  const [logo, setLogo] = useState("");
  const[companyName, setCompanyName]= useState("");
  const[siret, setSiret] = useState("");
  

  //route pour récupérer les infos de l'entreprise entrées en base de données à l'inscription
  useEffect(() => {
    const findCompanyInfo = async () => {
      const data = await fetch(`http://${REACT_APP_IPSERVER}/companies/profile/${props.user.token}/${props.user.companyId}`)
      const body = await data.json();
      setCompanyName(body.companyName);
      setSiret(body.siret);
      
      setLogo(body.logo)

    }; findCompanyInfo();

  }, []);

//demande d'autorisation pour accéder aux photos du téléphone lorsqu'on veut changer le logo de profil
  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // on récupère l'uri de l'image et on la stocke dans un état
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === false) {
      var data = new FormData();
      data.append("logo", {
        uri: pickerResult.uri,
        type: "image/jpeg",
        name: "company_logo.jpg",
      });
      // requête pour héberger l'image de profil dans cloudinary
      let resUpload = await fetch(`http://${REACT_APP_IPSERVER}/companies/logo`, {
        method: "post",
        body: data,
      });
      resUpload = await resUpload.json();
//récupère l'url de cloudinary depuis le back
      setLogo(resUpload.url);
    } else {
    }
  };

  //fonction qui s'active lorsqu'on souhaite enregistrer les données modifiées du profil (route en put)
  async function handleclickUpdtate() {
    var companyUpdate = await fetch(
      `http://${REACT_APP_IPSERVER}/companies/update-company`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `logo=${logo}&token=${props.user.token}&companyName=${companyName}&siret=${siret}&companyId=${props.user.companyId}`,
      }
    );
    let res = await companyUpdate.json();
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: 'center'
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
    form: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 45,
      //borderWidth: 1,
      marginTop: 40,
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
    profil: {
      width: 179,
      height: 179,
      resizeMode: "contain",
      marginBottom: 11,
      borderRadius: 100
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        ...styles.container,
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <View style={{ ...styles.container}}>
        <ImageBackground
          source={require("../../assets/background-login.png")}
          resizeMode="cover"
          style={styles.image}
        >
            <View style={{ flex: 1 }}>
            <View style={styles.form}>
              <Text style={styles.text}>Profil</Text>
              <TouchableOpacity
                onPress={openImagePickerAsync}
                style={{ marginBottom: 20, alignItems: "center" }}
              >
                {logo ? (
                  <View style={{backgroundColor: "white", borderRadius:100, width: 179,
                  height: 179,
                  marginBottom: 11,}}><Image source={{ uri: logo }} style={styles.profil} /></View>
                ) : (
                  <Image
                    source={require("../../assets/profil-pic.png")}
                    style={styles.profil}
                  />
                )}
                <ButtonText
                  containerStyle={{ marginBottom: 30 }}
                  color="light"
                  title="Modifier votre photo de profil"
                  onPress={openImagePickerAsync}
                />
              </TouchableOpacity>

              
              {/* <Input
                secureTextEntry
                autoCompleteType="password"
                placeholder="Entrez votre mot de passe"
                //onChangeText={onChangeField("password")}
                label="Mot de passe"
                inputStyle={styles.inputText}
                inputContainerStyle={styles.input}
                labelStyle={styles.label}
                placeholderTextColor="#DCDCDC"
              /> */}

              <Input
                autoCompleteType="name"
                textContentType="name"
                placeholder="le nom de l'entreprise"
                onChangeText={(value) => setCompanyName(value)}
                inputStyle={styles.inputText}
                label="Nom"
                inputContainerStyle={styles.input}
                labelStyle={styles.label}
                placeholderTextColor="#DCDCDC"
                
                value={companyName}
              />
              
              {/* <Input
                // autoCompleteType="off"
                // textContentType="jobTitle"
                placeholder="L'adresse du siège social"
                onChangeText={(value) => setAddress(value)}
                inputStyle={styles.inputText}
                label="Adresse"
                inputContainerStyle={styles.input}
                labelStyle={styles.label}
                placeholderTextColor="#DCDCDC"
                value={address}
              /> */}
              <Input
                
                placeholder="Le numéro SIRET"
                onChangeText={(value) => setSiret(value)}
                inputStyle={styles.inputText}
                label="SIRET"
                inputContainerStyle={styles.input}
                labelStyle={styles.label}
                placeholderTextColor="#DCDCDC"
                value={siret}
              />
            </View>

            <View style={styles.buttonContainer}>
              <View style={{flexDirection:"row"}}><Button
                size="md"
                style={{marginRight: 10, marginLeft:10, marginBottom:10}}
                color="primary"
                title="Enregistrer"
                onPress={() => handleclickUpdtate()}
              />{ props.user.type === "partner" && (<Button
                size="md"
                style={{marginRight: 10, marginLeft:10, marginBottom:10}}
                color="secondary"
                title="Page entreprise"
                onPress={() => props.navigation.navigate("CompanyPage", {companyId: props.user.companyId})}
              />)}
              </View>
              <ButtonText
                color="light"
                title="Annuler"
                onPress={() => props.navigation.navigate("Home")}
              />
            </View>
            {/* <View style={{ flex: 1 }} /> */}
            </View>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}


export default connect(mapStateToProps,null)(CompanyProfileScreen);
