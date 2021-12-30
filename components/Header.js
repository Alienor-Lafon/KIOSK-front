import React from "react";

//import du header, du texte et de listItem de react native elements

import { Header } from "react-native-elements";
import { TouchableOpacity, View} from "react-native";

//import des icons depuis fontawesome et ionicons
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

//import du composant "avatarRound" créé dans le répertoire "components" pour l'utiliser en tant que right component du header
import AvatarRound from "./avatar";
import Text from "./Text";

const HeaderBar = (props) => {
  const { onBackPress } = props;

  var leftComponentDisplay;
  if (props.leftComponent) {
    leftComponentDisplay = (
      <TouchableOpacity onPress={() => onBackPress()}>
        <AntDesign name="left" size={24} color="#1A0842" />
      </TouchableOpacity>
    );
  }
  //condition pour afficher le composant de gauche (la flèche de retour) dans les composants qui recoivent le header, il est aussi possible d'ajuster le "onBackPress" dans ces mêmes composants

  var locationIndication;
  if (props.locationIndication) {
    locationIndication = (
      <Text style={{ color: "#1A0842", fontSize: 10 }}>
        <Ionicons name="ios-location-sharp" size={10} color="#1A0842" />
        {props.location}
      </Text>
    );
  }

  //comdition pour afficher le sous titre location "locationIndication" qui se situe en dessous du titre de la page dans les composants recevant le header. Il est aussi possible d'ajuster le lieu "location "

  return (
    <View>
      <Header
        elevated={false}
        barStyle="dark-content"
        statusBarProps={{ backgroundColor: "#ffffff" }}
        leftComponent={leftComponentDisplay}
        leftContainerStyle={{
          justifyContent: "center",
        }}
        rightContainerStyle={{
          justifyContent: "center",
        }}
        centerContainerStyle={{
          justifyContent: "center",
        }}
        centerComponent={
          <View style={{ alignItems: "center" }}>
            <Text
              numberOfLines={1}
              style={{ color: "#1A0842", fontSize: 22, fontWeight: "bold" }}
            >
              {props.title}
            </Text>
            {locationIndication}
          </View>
        }
        containerStyle={{
          backgroundColor: "#ffffff",
        }}
        rightComponent={
          <AvatarRound
            navigation={props.navigation}
            size="md"
            source={{ uri: props.user?.avatar ? props.user.avatar : "" }}
          ></AvatarRound>
        }
      />
    </View>
  );
};

export { HeaderBar };
