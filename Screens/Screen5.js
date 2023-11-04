import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const Screen5 = () => {
  const userInfo = useSelector(state => state.userReducer.userInfo);

  return (
    <View style={Styles.container}>      
      <Text style={Styles.HomeText}>My Unlock</Text>
      <Text style={Styles.HomeText}>이름 : {userInfo.name}</Text>
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