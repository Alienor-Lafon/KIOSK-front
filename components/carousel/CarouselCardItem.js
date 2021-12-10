import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH);

const CarouselCardItem = ({ item, index }) => {
  return (
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
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    margin: 10
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