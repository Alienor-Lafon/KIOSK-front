import React, { useState } from "react";
import { Platform } from "react-native";

import Text from "./Text";


import { useIsFocused } from "@react-navigation/native";

import Constants from "expo-constants";

import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Avatar, Overlay, ListItem } from "react-native-elements";
//création d'un composant (parent) avatar avec options de taille (petit et moyen)

const AvatarRound = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleOverlay = () => {
    setIsVisible(!isVisible);
  };
  var navigate = (screen) => {
    setIsVisible(!isVisible);
    props.navigation.navigate(screen);
  };

  const isFocused = useIsFocused();

  //options de taille dans les composants recevant l'avatar
  let size;
  if (props.size === "md") {
    size = 50;
  } else {
    size = 25;
  }

  //au clic sur déconnexion, retirer le user du storage local
  function handlePressDeconnexion() {
    AsyncStorage.removeItem("user");
    //props.storeUserReset();
    props.navigation.navigate("Bienvenue");
  }

  return (
    <Avatar
      rounded
      onPress={() => toggleOverlay()}
      size={size}
      source={props.source}
    >
      <Overlay
        style={{ flex: 1 }}
        overlayStyle={{
          position: "absolute",
          top: Platform.OS === "ios" ? Constants.statusBarHeight + 55 : 55,
          right: 10,
          borderRadius: 10,
          backgroundColor: "#FAF0E6",
          elevation: 4,
          shadowOpacity: 0.29,
          shadowRadius: 4.65,
          borderWidth: 0.5,
          borderColor: "#E8E9E9",
        }}
        isVisible={isVisible}
        onBackdropPress={toggleOverlay}
        backdropStyle={{ backgroundColor: "transparent" }}
        //menu déroulant qui s'affiche au press sur l'avatar
      >
        <ListItem
          containerStyle={{ backgroundColor: "#FAF0E6" }}
          onPress={() => navigate("UserProfile")}
        >
          <ListItem.Title style={{ color: "#1A0842" }}>
            <Text>Profil</Text>
          </ListItem.Title>
        </ListItem>
        <ListItem
          containerStyle={{ backgroundColor: "#FAF0E6" }}
          onPress={() => navigate("Favorites")}
        >
          <ListItem.Title style={{ color: "#1A0842" }}>
            <Text>Favoris</Text>
          </ListItem.Title>
        </ListItem>
        <ListItem
          containerStyle={{ backgroundColor: "#FAF0E6" }}
          onPress={() => navigate("Quotation")}
        >
          <ListItem.Title style={{ color: "#1A0842" }}>
            <Text>Devis</Text>
          </ListItem.Title>
        </ListItem>
        <ListItem
          containerStyle={{ backgroundColor: "#FAF0E6" }}
          onPress={() => navigate("CompanyProfile")}
        >
          <ListItem.Title style={{ color: "#1A0842" }}>
            <Text>Entreprise</Text>
          </ListItem.Title>
        </ListItem>
        <ListItem containerStyle={{ backgroundColor: "#FAF0E6" }}>
          <ListItem.Title
            style={{ color: "#1A0842" }}
            onPress={() => handlePressDeconnexion()}
          >
            <Text>Déconnexion</Text>
          </ListItem.Title>
        </ListItem>
      </Overlay>
    </Avatar>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    storeUser: function (user) {
      dispatch({ type: "storeUser", user });
    },
    storeUserReset: function () {
      dispatch({ type: "storeUserReset" });
    },
  };
}

export default connect(null, mapDispatchToProps)(AvatarRound);
