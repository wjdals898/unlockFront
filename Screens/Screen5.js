import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Screen5 = () => {

  return (
    <View style={Styles.container}>      
      <Text style={Styles.HomeText}>My Unlock</Text>
    </View>
  )
}

export default Screen5;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  HomeText: {
    fontSize: 35,
    textAlign: "center",
    paddingTop : 30,
  },
})