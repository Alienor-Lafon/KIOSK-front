import { REACT_APP_IPSERVER } from "@env";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { View, Text, ScrollView } from "react-native";
import { Divider, AirbnbRating, Avatar } from "react-native-elements";
import { HeaderBar } from "../components/Header";


const RatingScreen = (props) => {

  const [ companyId, setCompanyId ] = useState(
    props.route.params && props.route.params.companyId // paramètres envoyés depuis la page précédente avec props.navigation.navigate
    ? props.route.params.companyId
    : null
  );
  const [ token, setToken ] = useState(
    props.user && props.user.token ? props.user.token : null // si user (store) exist + token (store) exist > j'envoie le token du store (ou null)
  );
  const [ ratings, setRatings ] = useState([]);
  const [ avgRate, setAvgRate ] = useState(0);

  // useEffect d'initialisation de la page Rating :
  useEffect(() => {
    // fonction chargement des infos de la compagnie loggée :
    async function loadDataCie() {
      // appel route get pour récupérer évaluations de la company affichée :
      var rawRatings = await fetch(`http://${REACT_APP_IPSERVER}/ratings/${companyId}/${token}`);
      var dataRatings = await rawRatings.json();
//console.log("dataRatings.ratings", dataRatings.ratings); // = ARRAY d'OBJETS
//console.log(dataRatings.ratings.length);
      if (dataRatings.result) {
        setRatings(dataRatings.ratings);
        setAvgRate(dataRatings.avg[0].averageNoteByCie);
// console.log("avg", dataRatings.avg);
// console.log("avg", dataRatings.avg[0].averageNoteByCie)
      }
    }
    loadDataCie();
  }, []);

  // fonction d'affichage de la date :
  const dateFormat = function (date) { // focntion dateFormat qui attend un paramètre
    var newDate = new Date(date); // on récupère la date envoyée au-desssus
    var format =
      newDate.getDate() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getFullYear(); // jour CHIFFRE/mois/année
    return format;
  };

// console.log("état ratings", ratings);

  return (

    <View style={{ flex: 1, backgroundColor: "white" }}>

      <HeaderBar
        title="Avis"
        leftComponent
        user={props.user}
        navigation={props.navigation}  // voir propriété navigation du composant HeaderBar
        onBackPress={() => props.navigation.goBack()} // infos du store du user
      ></HeaderBar>

      <Divider
        style={{
          backgroundColor: "#FAF0E6",
          height: 80,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <View style={{ left: 10 }}>
          <Text style={{ fontSize: 20, color: "#1A0842", marginLeft: 10 }}>
            {ratings.length} commentaires
          </Text>
          <View style={{ display: "flex", flexDirection: "row", left: 8 }}>
            <AirbnbRating
              style={{ left: 10 }}
              selectedColor="#F47805"
              unSelectedColor="#F4780533"
              reviewColor="#F47805"
              defaultRating={avgRate}
              isDisabled
              count={5}
              size={20}
              showRating={false}
            />
            <Text style={{ fontSize: 20, color: "#1A0842", marginLeft: 10 }}>
              {" "}
              {avgRate}
            </Text>
          </View>
        </View>
      </Divider>

      <ScrollView showsVerticalScrollIndicator={false}>
        {ratings.map(function (e, i) {
// console.log("e", e);
          return (
            <View key={i} style={{ paddingBottom: 30 }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  left: 15,
                  marginTop: 20,
                  marginRight: 30
                }}
              >
                {e.userId && e.userId.avatar && (
                  <Avatar rounded source={{ uri: e.userId.avatar }}></Avatar>
                )}
                <View style={{ left: 10 }}>
                  <Text>
                    {e.userId && e.userId.firstName && e.userId.firstName}{" "}{e.userId && e.userId.lastName && e.userId.lastName}
                  </Text>
                  <Text>
                    {e.userId && e.userId.companyName && e.clientId.companyName}{" "} - {" "}{e.dateRating && dateFormat(e.dateRating)}
                  </Text>
                </View>
              </View>
              <View style={{ display: "flex", flexDirection: "column", left: 15 }}>
                <Text style={{ flexShrink: 1, top: 10, marginRight: 30 }}>
                  {e.feedback && e.feedback}
                </Text>
                <View style={{ alignItems: "flex-start", top: 15, marginRight: 30 }}>
                  <AirbnbRating
                    style={{ marginTop: 10 }}
                    selectedColor="#F47805"
                    unSelectedColor="#F4780533"
                    reviewColor="#F47805"
                    defaultRating={e.rating ? e.rating : 3}
                    isDisabled
                    count={5}
                    size={20}
                    showRating={false}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

    </View>
  );
};

// composant conteneur / parent pour récupèrer le user stocké dans le store / state :
function mapStateToProps(state) {
  return { user: state.user };  // utilisé ensuite via props.user
}

// on exporte le composant de présentation, mais aussi le composant conteneur au store (connect) :
export default connect(mapStateToProps, null)(RatingScreen);
