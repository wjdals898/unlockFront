import React from "react";
import { View, Text, StyleSheet } from "react-native";


const SettingScreen = () => {

  return (
    <View style={Styles.container}>      
      <Text style={Styles.HomeText}>Settings</Text>
    </View>
  )
}

export default SettingScreen;

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