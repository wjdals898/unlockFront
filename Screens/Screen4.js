import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, BackHandler } from "react-native";
import { useNavigation, useIsFocused, useFocusEffect } from "@react-navigation/native";

const Screen4 = () => {

  const navigation = useNavigation();

  const isFocused = useIsFocused()
    useFocusEffect(
        React.useCallback(() => {
        const onBackPress = () => {
            console.log(isFocused);
            if (isFocused) {
            Alert.alert("", "앱을 종료하시겠습니까?", [
                {
                text: "취소",
                onPress: () => null,
                style: "cancel"
                },
                { text: "확인", onPress: () => BackHandler.exitApp() }
            ]);

            return true;
            }
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () => {
            backHandler.remove(); // 컴포넌트 언마운트 시 이벤트 리스너 해제
        };
        }, [isFocused])
    );

  return (
    <View style={Styles.container}>      
      <Text style={Styles.HomeText}>My Page</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Screen5", { screen: "Screen5" })}
        style={Styles.NextBottom}
      >
        <Text style={Styles.BottomText}>내 정보</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Screen6", { screen: "Screen6" })}
        style={Styles.NextBottom}
      >
        <Text style={Styles.BottomText}>상담사 인증</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Settingscreen", { screen: "Settingscreen" })}
        style={Styles.NextBottom}
      >
        <Text style={Styles.BottomText}>설정</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Infoscreen", { screen: "Infoscreen" })}
        style={Styles.NextBottom}
      >
        <Text style={Styles.BottomText}>앱 정보</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Screen4;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  HomeText: {
    fontSize: 35,
    textAlign: "center",
    paddingTop: 40,
    paddingBottom: 50
  },
  NextBottom: {
    backgroundColor: "#A9C3D0",
    padding: 10,
    marginTop: "5%",
    width: "50%",
    alignSelf: "center",
    borderRadius: 10,
  },
  BottomText: {
    fontSize: 15,
    color: 'white',
    textAlign: "center",
  },
})