import { REACT_APP_IPSERVER } from "@env";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { View, ImageBackground, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Text from "../components/Text";
import { ButtonText } from "../components/Buttons";
import SubCategoriesListHori from "../components/SubCategoriesListHori";
import { HeaderBar } from "../components/Header";
import CompanyCard from "../components/CompanyCard";
import Searchbar from "../components/SearchBar";

import { useIsFocused } from "@react-navigation/native";


const HomeScreen = (props) => {

  const [dataCompany, setDataCompany] = useState(null);
  const [packs, setPacks] = useState([]);

  // gestion de l'affichage (packs) en fonction de l'écran, et non pixel => responsive
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const isFocused = useIsFocused(); // si le composant est à l'écran, alors on exécute le code

  // useEffect d'initialisation de la Home :
  useEffect(() => {

    // DANS USE : fonction chargement des infos de la compagnie loggée :
    if (isFocused) {
//console.log("props.user", props.user);
      async function loadDataCie() {
        // récupère TOUTES les company en DB :
        var rawDataCieList = await fetch(`http://${REACT_APP_IPSERVER}/companies/all/${props.user.token}`);
        var dataCieList = await rawDataCieList.json();
        // affichage random d'une compagnie : 
        if (dataCieList.result) {
          const random = Math.floor(
            Math.random() * dataCieList.companies.length
          );
          // récupère LA company random : (!!! ici cieId en dur)
          var rawDataCie = await fetch(`http://${REACT_APP_IPSERVER}/companies/61b72b8f3ef976a3b8be1b12/${props.user.token}`);
          var dataCie = await rawDataCie.json();
// console.log("dataCie", dataCie);
          if (dataCie.result) {
            setDataCompany(dataCie.company); // set état company avec toutes data
          }
        }
      }
      loadDataCie();
    }

    // DANS USE : fonction chargement de TOUTES les catégories :
    var setcategorieslist = async function () {
      const data = await fetch(`http://${REACT_APP_IPSERVER}/recherche/getcategories`);
      const body = await data.json();
      var categorieslist = body.categorieList;
      props.setcategoriesList(categorieslist); // appel de la fonction du dispacth
    };
    setcategorieslist(); // appel fonction ligne 55

    // DANS USE : fonction chargement des infos de TOUS les packs :
    async function loadDataPacks() {
      // appel route get pour récupérer données de tous les packs :
      var rawDataPacks = await fetch(`http://${REACT_APP_IPSERVER}/recherche/getPacks`);
      var dataPacks = await rawDataPacks.json();
      if (dataPacks.result) {
        setPacks([...dataPacks.dataPack]); // je récupère le tableau de l'état Packs et je rajoute les packs (car .push pas popssible sur état)
      }
//console.log("dataPacks", dataPacks);
    }
    loadDataPacks();
  }, []);

//console.log("état packs", packs);

  return (

    <View style={{ flex: 1, backgroundColor: "white" }}>

      {/* View pour NAVBAR */}
      <View>
        <HeaderBar
          title="Kiosk"
          navigation={props.navigation} // voir propriété navigation du composant HeaderBar
          user={props.user} // infos du store du user
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* View pour la barre de recherche */}
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Searchbar navigation={props.navigation}></Searchbar>
        </View>

        {/* View pour List categorie horizontale */}
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15
            }}
          >
            <View style={{ marginHorizontal: 15 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                Nos catégories
              </Text>
            </View>
            <View style={{ marginHorizontal: 15 }}>
              <ButtonText
                color="primary"
                title="Voir plus"
                onPress={() => props.navigation.navigate("Rechercher")}
              />
            </View>
          </View>

          <SubCategoriesListHori
            navigation={props.navigation}
          ></SubCategoriesListHori>
        </View>

        {/* View pour l'entreprise de la semaine */}
        <View style={{ marginTop: 10 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15
            }}
          >
            <View style={{ marginHorizontal: 15 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                L'entreprise à découvrir
              </Text>
            </View>
          </View>

          <View>
            {dataCompany && (
              <CompanyCard
                navigation={props.navigation}
                dataCompany={dataCompany}
              ></CompanyCard>
            )}
          </View>
        </View>

        {/* NOS PACKS */}
        <View style={{ marginTop: 20, marginBottom: 30 }}>
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginHorizontal: 15 }}>
              Nos packs
            </Text>

            <View
              style={{
                width: "100%",
                paddingBottom: 10,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                alignContent: "space-around",
                top: 20,
                paddingVertical: 10
              }}
            >
              {packs
                ? packs.map((e, i) => (
                    <View key={i} style={{ marginBottom: "3%" }}>
                      <ImageBackground
                        source={{uri: `http://${REACT_APP_IPSERVER}/images/assets/${e.packImage}`}}
                        imageStyle={{ borderRadius: 20 }}
                        style={{
                          margin: 3,
                          height: 200,
                          width: windowWidth / 2.4,
                          justifyContent: "center"
                        }}
                      >
                        <Text
                          style={{
                            color: "#FFFFFF",
                            textAlign: "center",
                            paddingHorizontal: 10
                          }}
                          onPress={() =>
                            props.navigation.navigate("ResultsPacks", {
                              packId: e._id,
                              packName: e.packName,
                            })
                          }
                        >
                          {e.packName}
                        </Text>
                      </ImageBackground>
                    </View>
                  ))
                : null}
            </View>

          </View>
        </View>

      </ScrollView>

    </View>
  );
};

// composant conteneur / parent pour récupèrer le user stocké dans le store / state :
function mapStateToProps(state) {
  return {
    user: state.user,  // utilisé ensuite via props.user
    recherche: state.recherche
  };
}

// composant conteneur / parent pour stocker le user dans le store :
function mapDispatchToProps(dispatch) {
  return {
    // fonction de dispatch attendant d'être appelée (props.setCategoriesList()) avec un paramètre dans composant de présentation / enfant : 
    setcategoriesList: function (categorieslist) {
      dispatch({ type: "setcategoriesList", categorieslist }); // appel le reducer qui répondra à action.type === setcategoriesList
    },
  };
}

// on exporte le composant de présentation, mais aussi les composants conteneurs au store (connect) :
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
