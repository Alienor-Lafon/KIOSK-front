import React from 'react'
import { View, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "../Text";

//définit la largeur du carousel
export const SLIDER_WIDTH = Dimensions.get('window').width;

//définit la largeur de chaque item, elle correspond à la largeur du carousel
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH);

//définit les éléments à l'intérieur de chaque carte du carousel
const CarouselCardItem = ({ item, index }) => {
  return (
    //éléments récupérés de data
    <View style={styles.container} key={index}>
     
      <Text style={styles.header}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <View style={styles.wrapper}>
      {item.categories.map((categorie, i) => (
      <LinearGradient
        style={styles.containerStyle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={["#A1C181", "#619B8A"]}
        key={i}
      >
        <Text style={styles.body}>{categorie}</Text>
      </LinearGradient>
      ))}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    width: ITEM_WIDTH,
    shadowOpacity: 0,
    elevation: 0,
    alignItems : "center",
    justifyContent: "center",
    paddingHorizontal: 40
  },
  wrapper: {
    flexWrap: 'wrap', 
    alignItems: 'flex-start',
    flexDirection:'row'
  },
  containerStyle: {
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
    margin: 2
  },
  header: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    paddingBottom: 25,
    textAlign: "center",
  },
  body: {
    color: "#FFFFFF",
    fontSize: 17,
    lineHeight: 34,
    textAlign: "center",
  }
})

export default CarouselCardItem