import axios from "axios";
import React, { useState } from "react";
import { Image, View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND } from "@env";

const Infoscreen = () => {
  const navigation = useNavigation();
  const [touchCount, setTouchCount] = useState(0);

  const handleImageClick = () => {
    setTouchCount(touchCount + 1);
    console.log(touchCount);

    if (touchCount >= 1) {
      // 두 번째 터치 시 화면 전환
      logout();
    }
  };

  const logout = async () => {
    await AsyncStorage.getItem('refresh', (err, result) => {
      refresh_token = result;
    });
    try {
      const response = await axios.post(BACKEND+':8000/account/logout/', { //BACKEND+`:8000/account/logout/` `${BACKEND}:8000/account/logout/`
        refresh: refresh_token
      });
      await AsyncStorage.removeItem('refresh');

      Alert.alert(
        "로그아웃",
        "로그아웃 완료!",
        [
          {
            text: "확인",
            onPress: () => navigation.navigate("Splash") // Signin 화면으로 이동
          }
        ],
        { cancelable: false }
      );
    }
    catch (error) {
      console.log(error);
      setTouchCount(0);
    }
  };

  return (
    <View style={Styles.container}>      
      <Text style={Styles.HomeText}>Info.</Text>
      <TouchableOpacity onPress={handleImageClick} activeOpacity={1}>
        <Image
          source={require('../assets/logo.png')}
          style={{ width: 150, height: 150, alignSelf: 'center', borderRadius: 100,
          marginTop : 50}}
          onError={(error) => console.log('이미지 로드 오류', error)}
        />
      </TouchableOpacity>
            
      <Text style={Styles.versionText}>V.6.20</Text>
      <Text style={Styles.versionText}>2023-06-20</Text>
      <Text style={Styles.versionText}>Made by. Unlock</Text>
      <Text style={Styles.versionText}>Front. 이혜림, 장지수</Text>
      <Text style={Styles.versionText}>Backend. 홍정민, 이예원, 조선아</Text>
    </View>
  )
}

export default Infoscreen;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  HomeText: {
    fontSize: 35,
    textAlign: "center",
    paddingTop : 70,
  },
  versionText: {
    textAlign: "center",
    color: "grey",
    paddingTop: 20
  },
})