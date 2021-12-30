import React, { useState, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView} from "react-native";
import { Text } from 'react-native-elements';
import { HeaderBar } from "../../components/Header";
import OfferCardLight from "../../components/OfferCardLight";
import { Button, ButtonText } from "../../components/Buttons";
import { REACT_APP_IPSERVER } from '@env';
import { connect } from 'react-redux';

const SendQuoteScreen = (props) => {

  const[reqQuoteId, setReqQuoteId] = useState(props.route.params.quoteId)
  //réponses aux questions récupérées de la base de données
  const[answers, setAnswers]= useState([]);
  //devis provenant de la base de données
  const[quotation, setQuotation] = useState(null);
  //offre correspondant au devis
  const[offer, setOffer] = useState({})
  //statut du devis
  const [quoteStatus, setQuoteStatus] = useState("");


  //permet de retrouver les infos du devis demandé
  useEffect(() => {
    const findQuotationInfo = async () => {
      const data = await fetch(`http://${REACT_APP_IPSERVER}/quotations/quotation-info/${props.user.token}/${reqQuoteId}`)
      const body = await data.json();
      setAnswers(body.answers)
      setQuotation(body.quotationFromBack)
      setOffer(body.offer)

    }; findQuotationInfo();

  }, []);


  //route de modification d'un devis au click sur "envoyé". Permet surtout de changer le statut du devis et d'avoir la date d'envoi.
  var sendQuotation = async () => {

    const saveReq = await fetch(`http://${REACT_APP_IPSERVER}/quotations/send-quotation`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `quoteId=${reqQuoteId}&token=${props.user.token}&date=${new Date()}`

    })
    const fromBack = await saveReq.json()
    setQuoteStatus(fromBack.quotationToSend.status)

  }
//se déclenche au click sur "envoyer"
  const sendQuote = () => {
    sendQuotation();
    props.navigation.goBack();
    
  }

//map sur les réponses aux questions renvoyées par le back
var answersToDisplay = answers.map((answer, i)=>{
  return(
  <View style={{margin:15}}>
    <Text h4 style={{color: "#1A0842", fontWeight:"bold"}} >{answer.question}</Text>
  <Text style={{color: "#1A0842"}}>{answer.answer}</Text></View>)
})


  return (<View style={{ flex: 1, backgroundColor: "white" }}>
    <HeaderBar
      onBackPress={() => props.navigation.goBack()}
      leftComponent
      title="Envoyer le devis"
      navigation={props.navigation}
      user={props.user}
    >

    </HeaderBar>

    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: "flex-start", margin:10}}>
      <View style={{alignSelf:"center"}}><OfferCardLight
      dataOffre={offer} navigation={props.navigation}></OfferCardLight></View>

    <Text h3 style={{color: "#1A0842", fontWeight:"bold"}}>Récapitulatif de la demande : </Text>
    {answersToDisplay}
    


        <View style={{marginBottom:10}}><Button
          title="Envoyer le devis"

          size="md"
          color="primary"
          onPress={() => sendQuote()}
        ></Button>
        <ButtonText title="Annuler"
          onPress={() => props.navigation.goBack()}
        ></ButtonText></View>

      
    </ScrollView>
  </View>
  )
}

function mapStateToProps(state) {
  return { user: state.user }
}
export default connect(mapStateToProps, null)(SendQuoteScreen)

