import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Switch } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import { HeaderBar } from "../../components/Header";
import OfferCard from "../../components/OfferCardLight";
import CompanyCard from "../../components/CompanyCard";

//import du switch
import Toggle from "react-native-toggle-element";

import { connect } from "react-redux";
import { REACT_APP_IPSERVER } from "@env";

const FavoriteScreen = (props) => {
  const isFocused = useIsFocused();

  const [toggleValue, setToggleValue] = useState(false),
        [favoriteOffers, setFavoriteOffers] = useState([]),
        [favoriteCompanies, setFavoriteCompanies] = useState([]);

  useEffect(() => {
    const loadData = async () => {
        let offersId = props.user.favorites.filter(e => e.offerId);
        console.log("offersId:",offersId);
        setFavoriteOffers([]);
        setFavoriteCompanies([]);
        let offers = [];
        for(let i = 0; i < offersId.length; i++) {
            var rawDataOffer = await fetch(`http://${REACT_APP_IPSERVER}/offers/${offersId[i].offerId}/${props.user.token}`); // (`adresseIPserveur/route appelée/req.params?req.query`)
            var res = await rawDataOffer.json();
            if (res.result) {
                offers.push(res.offer);
            }
        };
        setFavoriteOffers(offers);
        let companiesId = props.user.favorites.filter(e => e.companyId);
        let companies = [];
        for(let i = 0; i < companiesId.length; i++) {
            var rawDataOffer = await fetch(`http://${REACT_APP_IPSERVER}/companies/${companiesId[i].companyId}/${props.user.token}`); // (`adresseIPserveur/route appelée/req.params?req.query`)
            var res = await rawDataOffer.json();
            if (res.result) {
                companies.push(res.company);
            }
        };
        setFavoriteCompanies(companies);
    }
    isFocused && loadData();
  }, [isFocused]);

  console.log(favoriteOffers.length);

  if (!toggleValue && favoriteOffers.length > 0) {
    let leftComponentDisplay = (
      <Text style={{ color: "white", fontWeight: "bold" }}>Offre</Text>
    );
    let rightComponentDisplay = (
      <Text style={{ color: "#1A0842", fontWeight: "bold" }}>Entreprise</Text>
    );
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <HeaderBar
          title="Favoris"
          navigation={props.navigation}
          user={props.user}
        ></HeaderBar>

        <View style={{ alignItems: "center", marginHorizontal: 10 }}>
          <Toggle
            value={toggleValue}
            onPress={(newState) => setToggleValue(newState)}
            leftComponent={leftComponentDisplay}
            thumbButton={{
              width: 175,
              height: 50,
              radius: 30,
              activeBackgroundColor: "#F47805",
              inActiveBackgroundColor: "#F47805",
            }}
            rightComponent={rightComponentDisplay}
            trackBar={{
              width: 350,
              activeBackgroundColor: "#FAF0E6",
              inActiveBackgroundColor: "#FAF0E6",
            }}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>{
        favoriteOffers.map((e, i) => (
          <View key={i}><OfferCard dataOffre={e} navigation={props.navigation} /></View>
        ))
        }</ScrollView>
      </View>
    );
  } else if(toggleValue && favoriteCompanies.length > 0) {  
    let leftComponentDisplay = (
      <Text style={{ color: "#1A0842", fontWeight: "bold" }}>Offre</Text>
    );
    let rightComponentDisplay = (
      <Text style={{ color: "white", fontWeight: "bold" }}>Entreprise</Text>
    );

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <HeaderBar
          title="Favoris"
          navigation={props.navigation}
          user={props.user}
        ></HeaderBar>

        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Toggle
            value={toggleValue}
            onPress={(newState) => setToggleValue(newState)}
            leftComponent={leftComponentDisplay}
            thumbButton={{
              width: 175,
              height: 50,
              radius: 30,
              activeBackgroundColor: "#F47805",
              inActiveBackgroundColor: "#F47805",
            }}
            rightComponent={rightComponentDisplay}
            trackBar={{
              width: 350,
              activeBackgroundColor: "#FAF0E6",
              inActiveBackgroundColor: "#FAF0E6",
            }}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>{favoriteCompanies.map((e, i) => (
          <View key={i}><CompanyCard dataCompany={e} navigation={props.navigation} /></View>
        ))}</ScrollView>
      </View>
    );
  } else {
      return null
  }
};

function mapStateToProps(state) {
  return { user: state.user };
}
export default connect(mapStateToProps, null)(FavoriteScreen);
