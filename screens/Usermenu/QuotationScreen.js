import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Card, Badge } from "react-native-elements";

//composants personnalisés
import { Button } from "../../components/Buttons";
import { HeaderBar } from "../../components/Header";

import { useIsFocused } from "@react-navigation/native";

//import d'un switch d'une librairie
import Toggle from "react-native-toggle-element";

import { connect } from "react-redux";
import { REACT_APP_IPSERVER } from "@env";

const QuotationScreen = (props) => {
  const [toggleValue, setToggleValue] = useState(false);

  //quotations correspondent aux devis client (côté client)
  const [quotations, setQuotations] = useState([]);

  //requests correspondent aux demandes client (côté prestataire)
  const [requests, setRequests] = useState([]);

  const isFocused = useIsFocused();

  //ces deux variables correspondent aux deux côtés du switch. Leurs propriétés changent lorsqu'on clique sur l'un ou l'autre (couleur du texte, couleur de fond...)
  var leftComponentDisplay;
  var rightComponentDisplay;

  //permet de trouver l'ensemble des devis côté client et des demandes côté prestataires
  useEffect(() => {
    const findQuotations = async () => {
      const data = await fetch(
        `http://${REACT_APP_IPSERVER}/quotations/find-quotation/${props.user.token}/${props.user.companyId}`
      );
      const body = await data.json();
      setQuotations(body.quotationsToDisplay);
      setRequests(body.requestsToDisplay);
    };
    if (isFocused == true) {
      findQuotations();
    }
  }, [isFocused]);
//isFocused permet de déclencher le useEffect et donc de mettre à jour la liste des devis/demandes à chaque fois qu'on revient sur l'écran "quotationscreen"
  

  if (toggleValue == false) {
    //pour les devis en attente
    leftComponentDisplay = (
      <Text style={{ color: "white", fontWeight: "bold" }}>En cours</Text>
    );
    rightComponentDisplay = (
      <Text style={{ color: "#1A0842", fontWeight: "bold" }}>Passés</Text>
    );
//map sur les demandes récupérées du back. Cela ne s'affiche que pour les prestataires.
    var demandes = requests.map((request, i) => {
      //le statut à afficher, la couleur du badge, le titre du bouton, les boutons changent selon le statut de la demande
      var backgroundRequest;
      var statut;
      var badgeColor;
      var title;
      var button;
      if (
        request.status == "requested" ||
        request.status == "sent" ||
        request.status == "accepted" ||
        request.status == "paid"
      ) {
        if (request.status == "requested") {
          backgroundRequest = "#619B8A";
          statut = "Devis en attente";
          badgeColor = "#808080";
          title = "Voir la demande";
          button = (
            <Button
              title={title}
              style={{ margin: 10 }}
              onPress={() =>
                props.navigation.navigate("SendQuote", { quoteId: request.id })
              }
              //envoi de l'id du devis 
              size="md"
              color="secondary"
            ></Button>
          );
        } else if (request.status == "sent") {
          backgroundRequest = "#619B8A";
          statut = "Devis envoyé";
          badgeColor = "#FFA500";
          title = "Voir le devis";
          button = (
            <Button
              title={title}
              style={{ margin: 10 }}
              size="md"
              color="secondary"
              onPress={() => console.log('click')}
            ></Button>
          );
        } else if (request.status == "accepted") {
          backgroundRequest = "#619B8A";
          statut = "Devis accepté";
          badgeColor = "#FFFF00";
          title = "Voir le devis";
          button = (
            <Button
              title={title}
              style={{ margin: 10 }}
              size="md"
              color="secondary"
              onPress={() => console.log('click')}
            ></Button>
          );
        } else if (request.status == "paid") {
          backgroundRequest = "#619B8A";
          statut = "Devis payé";
          badgeColor = "#00FF00";
          title = "Voir le paiement";
          button = (
            <Button
              title={title}
              style={{ margin: 10 }}
              size="md"
              color="secondary"
              onPress={() => console.log('click')}
            ></Button>
          );
        }
//carte de demande
        return (
          <Card
            key={i}
            containerStyle={{
              padding: 0,
              borderRadius: 20,
              shadowColor: "rgba(0,0,0,0.4)",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,

              elevation: 10,
              backgroundColor: backgroundRequest,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  margin: 10,
                  alignSelf: "center",
                }}
              >
                <Card.Image
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                    borderRadius: 30,
                  }}
                  source={{ uri: request.logo }}
                ></Card.Image>
              </View>
              <View style={{ margin: 10, flexShrink: 1 }}>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  {request.offer}
                </Text>
                <Text style={{ margin: 2 }}>{request.name}</Text>
                <Text>
                  <Badge
                    badgeStyle={{ backgroundColor: badgeColor, margin: 2 }}
                  />
                  {statut}
                </Text>
              </View>
            </View>

            <Card.Divider
              style={{
                backgroundColor: "#FAF0E6",
                alignItems: "flex-end",
                padding: 0,
                marginBottom: 0,
                borderBottomEndRadius: 20,
                borderBottomStartRadius: 20,
              }}
            >
              {button}
            </Card.Divider>
          </Card>
        );
      }
    });
//devis côté client
    var devis = quotations.map((quotation, i) => {
//comme pour les demandes, le statut, la couleur du badge...etc, changent en fonction du statut de la demande
      var statut;
      var badgeColor;
      var title;
      var button;

      if (
        quotation.status == "requested" ||
        quotation.status == "sent" ||
        quotation.status == "accepted" ||
        quotation.status == "paid"
      ) {
        if (quotation.status == "requested") {
          statut = "Devis en attente";
          badgeColor = "#808080";
        } else if (quotation.status == "sent") {
          statut = "Devis envoyé";
          badgeColor = "#FFA500";
          title = "Voir le devis";
          button = (
            <Button
              title={title}
              style={{
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 5,
                marginRight: 5,
              }}
              size="md"
              color="primary"
              onPress={() => console.log('click')}
            ></Button>
          );
        } else if (quotation.status == "accepted") {
          statut = "Devis accepté";
          badgeColor = "#FFFF00";
          title = "Voir le devis";
          button = (
            <Button
              title={title}
              style={{
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 5,
                marginRight: 5,
              }}
              size="md"
              color="primary"
              onPress={() => console.log('click')}
            ></Button>
          );
        } else if (quotation.status == "paid") {
          statut = "Devis payé";
          badgeColor = "#00FF00";
          title = "Voir le paiement";
          button = (
            <Button
              title={title}
              style={{
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 5,
                marginRight: 5,
              }}
              size="md"
              color="primary"
              onPress={() => console.log('click')}
            ></Button>
          );
        }
//carte de devis
        return (
          <Card
            key={i}
            containerStyle={{
              padding: 0,
              borderRadius: 20,
              shadowColor: "rgba(0,0,0,0.4)",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,

              elevation: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  margin: 10,
                  alignSelf: "center",
                }}
              >
                <Card.Image
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                    borderRadius: 30,
                  }}
                  source={{ uri: quotation.logo }}
                ></Card.Image>
              </View>
              <View style={{ margin: 10, flexShrink: 1 }}>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  {quotation.offer}
                </Text>
                <Text style={{ margin: 2 }}>{quotation.name}</Text>
                <Text>
                  <Badge
                    badgeStyle={{ backgroundColor: badgeColor, margin: 2 }}
                  />
                  {statut}
                </Text>
              </View>
            </View>

            <Card.Divider
              style={{
                backgroundColor: "#FAF0E6",
                flexDirection: "row",
                justifyContent: "flex-end",
                padding: 0,
                marginBottom: 0,
                borderBottomEndRadius: 20,
                borderBottomStartRadius: 20,
              }}
            >
              <Button
                title="Contacter"
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: 5,
                  marginRight: 5,
                }}
                size="md"
                color="secondary"
                onPress={() => console.log('click')}
              />
              {button}
            </Card.Divider>
          </Card>
        );
      }
    });
//affichage des cartes de devis et de demande
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <HeaderBar
          title="Vos devis"
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
        <ScrollView showsVerticalScrollIndicator={false}>
          {devis}
          {demandes}
        </ScrollView>
      </View>
    );
  } else {//si le toggle est à true (côté devis et demandes passés)
    leftComponentDisplay = (
      <Text style={{ color: "#1A0842", fontWeight: "bold" }}>En cours</Text>
    );
    rightComponentDisplay = (
      <Text style={{ color: "white", fontWeight: "bold" }}>Passés</Text>
    );
//côté demandes
    if (requests.length == !0) {
      var requestsDone = requests.map((request, i) => {
        if (request.status == "done") {
          //ne concerne que les demandes passées ("done")
          return (
            <Card
              key={i}
              containerStyle={{
                padding: 0,
                borderRadius: 20,
                shadowColor: "rgba(0,0,0,0.4)",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,

                elevation: 10,
                backgroundColor: "#619B8A",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    margin: 10,
                    alignSelf: "center",
                  }}
                >
                  <Card.Image
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                      borderRadius: 30,
                    }}
                    source={{ uri: request.logo }}
                  ></Card.Image>
                </View>
                <View style={{ margin: 10, flexShrink: 1 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                    {request.offer}
                  </Text>
                  <Text style={{ margin: 2 }}>{request.name}</Text>
                  <Text>
                    <Badge badgeStyle={{ backgroundColor: "red", margin: 2 }} />
                    Devis Passé
                  </Text>
                </View>
              </View>

              <Card.Divider
                style={{
                  backgroundColor: "#FAF0E6",
                  alignItems: "flex-end",
                  padding: 0,
                  marginBottom: 0,
                  borderBottomEndRadius: 20,
                  borderBottomStartRadius: 20,
                }}
              >
                <Button
                  title="Voir la facture"
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 5,
                    marginRight: 5,
                  }}
                  size="md"
                  color="secondary"
                  onPress={() => console.log('click')}
                />
              </Card.Divider>
            </Card>
          );
        }
      });
    }
//ne concerne que les devis passés ("done")
    var done = quotations.map((quotation, i) => {
      if (quotation.status == "done") {
        return (
          <Card
            key={i}
            containerStyle={{
              padding: 0,
              borderRadius: 20,
              shadowColor: "rgba(0,0,0,0.4)",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,

              elevation: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  margin: 10,
                  alignSelf: "center",
                }}
              >
                <Card.Image
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                    borderRadius: 30,
                  }}
                  source={{ uri: quotation.logo }}
                ></Card.Image>
              </View>
              <View style={{ margin: 10, flexShrink: 1 }}>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  {quotation.offer}
                </Text>
                <Text style={{ margin: 2 }}>{quotation.name}</Text>
                <Text>
                  <Badge badgeStyle={{ backgroundColor: "red", margin: 2 }} />
                  Devis passé
                </Text>
              </View>
            </View>

            <Card.Divider
              style={{
                backgroundColor: "#FAF0E6",
                flexDirection: "row",
                justifyContent: "flex-end",
                padding: 0,
                marginBottom: 0,
                borderBottomEndRadius: 20,
                borderBottomStartRadius: 20,
              }}
            >
              <Button
                title="Laisser un avis"
                onPress={() => props.navigation.navigate("LeaveFeedback", { companyId: quotation.providerId })}
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: 5,
                  marginRight: 5,
                }}
                size="md"
                color="primary"
              />
              <Button
                title="Voir la facture"
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: 5,
                  marginRight: 5,
                }}
                size="md"
                color="secondary"
                onPress={() => console.log('click')}
              />
            </Card.Divider>
          </Card>
        );
      }
    });
//affichage des devis et demandes
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <HeaderBar
          title="Vos devis"
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
        <ScrollView showsVerticalScrollIndicator={false}>
          {requestsDone}
          {done}
        </ScrollView>
      </View>
    );
  }
};

function mapStateToProps(state) {
  return { user: state.user };
}
export default connect(mapStateToProps, null)(QuotationScreen);
