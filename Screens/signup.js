import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Signup = () => {

  const navigation = useNavigation();

  const getType = async () => {
    await AsyncStorage.getItem('type', (error, result) => {
      type = result
    });
    console.log("signup화면 type : ", type);
    if (type === "counselor") {
      navigation.navigate("Home", { screen: 'Home' });
    }
    else if (type === "counselee") {
      navigation.navigate("Home", { screen: 'Home' });
    }
  };

  useEffect(() => {
    getType();
  }, []);

  return (
    <View style={Styles.container}>      
      <Text style={Styles.HomeText}>User Select</Text>
      <TouchableOpacity
          onPress={() => navigation.navigate("Home", { screen: 'Home' })} //추후 상담자 화면 연결
          style={Styles.NextBottom}
        >
          <Text style={Styles.BottomText}>상담자</Text>
      </TouchableOpacity>
      <TouchableOpacity
          onPress={() => navigation.navigate("Main", { screen: 'Screen1' })}
          style={Styles.NextBottom}
        >
          <Text style={Styles.BottomText}>내담자</Text>
      </TouchableOpacity>
    </View>
  )
}


export default Signup;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  HomeText: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 240
  },
  NextBottom: {
    backgroundColor: "#A9C3D0",
    padding: 10,
    marginTop: "8%",
    width: "50%",
    alignSelf: "center",
    borderRadius: 10,
  },
  BottomText: {
    fontSize: 15,
    color: 'white',
    textAlign: "center",
  }
})