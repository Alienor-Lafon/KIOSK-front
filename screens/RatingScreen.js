import React, { useState, useEffect } from "react";
//Store
import { connect } from "react-redux";
//Var de connexion
import { REACT_APP_IPSERVER } from "@env";
//import de la librairie gifted chat avec ses éléments
import { View, Text, ScrollView } from "react-native";
import { HeaderBar } from "../components/Header";
import { Divider, AirbnbRating, Avatar } from "react-native-elements";

const RatingScreen = (props) => {
  // états infos pour récupérer ratings :
  const [companyId, setCompanyId] = useState(
    props.route.params && props.route.params.companyId
      ? props.route.params.companyId
      : null
  ); // pramaètre envoyé depuis la page précéndete via props.navigattion.navigate
  const [token, setToken] = useState(
    props.user && props.user.token ? props.user.token : null
  ); // si user exist + token exist > j'envoie le token du MAPSTATE ou celui en dur
  const [ratings, setRatings] = useState([]);
  const [avgRate, setAvgRate] = useState(0);

  // useEffect d'initialisation de la page Company :
  useEffect(() => {
    // DANS USE : fonction chargement des infos de la compagnie loggée :
    async function loadDataCie() {
      // appel route put pour modifier données company
      var rawRatings = await fetch(
        `http://${REACT_APP_IPSERVER}/ratings/${companyId}/${token}`
      ); // (`adresseIPserveur/route appelée/req.params?req.query`)
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

  const dateFormat = function (date) {
    var newDate = new Date(date);
    var format =
      newDate.getDate() +
      "/" +
      (newDate.getMonth() + 1) +
      "/" +
      newDate.getFullYear();
    return format;
  };

  // console.log("état ratings", ratings);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <HeaderBar
        title="Avis"
        leftComponent
        user={props.user}
        navigation={props.navigation}
        onBackPress={() => props.navigation.goBack()}
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
            <View style={{ paddingBottom: 30 }} key={i}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  left: 15,
                  marginTop: 20,
                  marginRight: 30,
                }}
              >
                {e.userId && e.userId.avatar && (
                  <Avatar rounded source={{ uri: e.userId.avatar }}></Avatar>
                )}
                <View style={{ left: 10 }}>
                  <Text>
                    {e.userId && e.userId.firstName && e.userId.firstName}{" "}
                    {e.userId && e.userId.lastName && e.userId.lastName}
                  </Text>
                  <Text>
                    {e.userId && e.userId.companyName && e.clientId.companyName}{" "}
                    - {e.dateRating && dateFormat(e.dateRating)}
                  </Text>
                </View>
              </View>
              <View
                style={{ display: "flex", flexDirection: "column", left: 15 }}
              >
                {/* <View style={{marginRight:30, backgroundColor:"blue"}}> */}
                <Text style={{ flexShrink: 1, top: 10, marginRight: 30 }}>
                  {e.feedback && e.feedback}
                </Text>
                {/* </View> */}
                <View
                  style={{ alignItems: "flex-start", top: 15, marginRight: 30 }}
                >
                  <AirbnbRating
                    style={{ marginTop: 10 }}
                    selectedColor="#F47805"
                    unSelectedColor="#F4780533"
                    reviewColor="#F47805"
                    defaultRating={e.rating ? e.rating : 3} //changer avec rating
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

// on récupère le user stocké dans le store :
function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps, null)(RatingScreen);
