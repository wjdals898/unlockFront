import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";

const MainScreen = ({route, navigation}) => {
  const { personId } = route.params;
  const { listItems } = route.params;
  //const navigation = useNavigation();
  handlePressPicture = () => {
    console.log("Go to picture ");
    navigation.navigate("PictureScreen");
  };

  handlePressVideo = () => {
    console.log("Go to video ");
    navigation.navigate("VideoScreen");
  };

  handlePressUpload = () => {
    console.log("Go to gallery");
    navigation.navigate("UploadScreen", {personId: personId, listItems: listItems});
  };


  return (
    <View style={styles.mainMenu}>
      {/* <Pressable onPress={this.handlePressVideo} style={styles.btn}>
        <Text style={styles.txt}>Video</Text>
      </Pressable> */}
      <Pressable onPress={this.handlePressUpload} style={styles.btn}>
        <Text style={styles.txt}>Upload</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  mainMenu: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  btn: {
    backgroundColor: "#A9C3D0",
    padding: 0,
    borderRadius: 8,
    margin: 10,
    height: 40,
  },
  txt: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 20,
    alignSelf: "center",
  },
});

export default MainScreen;
