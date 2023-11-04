import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import {BACKEND} from '@env';
import { useDispatch } from "react-redux";
import userReducer from "../store/reducers/user/userReducer";
import { getUserInfo, getUserToken } from "../store/actions/user/userAction";
import { fetchCounselees } from "../store/actions/counselees/counseleeAction";
import { SafeAreaView } from "react-native-safe-area-context";

const Signin = () => {
  const [id, setId] = useState(""); // State로 ID 상태 관리
  const [password, setPassword] = useState(""); // State로 Password 상태 관리

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const handleLogin = async () => {
    console.log("로그인 버튼 클릭");
    if (!id) alert('아이디를 입력하세요.');
    else if (!password) alert('비밀번호를 입력하세요.');
    else {
      try {
        const login = await axios.post(BACKEND+':8000/account/kakao/callback/', { //BACKEND+':8000/account/kakao/callback/' `${BACKEND}:8000/account/kakao/callback/`
          data: {
            email: id,
            password: password
          }
        });
        const user_info = await axios.get(BACKEND+':8000/account/info/', { /*BACKEND+':8000/account/info/' BACKEND+`:8000/account/info/` */
          headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${login.data.access}`
          }
        });
        console.log(login.data);
        console.log(user_info.data.type);
        dispatch(getUserToken(login.data));
        dispatch(getUserInfo(user_info.data));
        await AsyncStorage.setItem('access', login.data.access);
        await AsyncStorage.setItem('refresh', login.data.refresh);
        const type = await AsyncStorage.setItem('type', user_info.data.type);
        alert('로그인 성공!');
        setId("");
        setPassword("");
        // 로그인 성공 시 다음 단계로 이동하는 코드를 작성하세요.
        if (type === "counselor") {
          navigation.navigate("Home", { screen: 'Home' });
        }
        else if (type === "counselee") {
          navigation.navigate("Home", { screen: 'Home' });
        }
        else {
          navigation.navigate("Signup");
        }
      }
      catch (error) {
        console.log("로그인 에러", error);
        Alert.alert('로그인 실패', '유효하지 않은 사용자명 또는 비밀번호입니다.');
        navigation.navigate("Signin", { screen: 'Signin' });
      }
    }
  };


  return (
    <SafeAreaView style={Styles.container}>      
      <Text style={Styles.HomeText}>Log In</Text>

      {/* ID 입력 공간 */}
      <TextInput
        style={Styles.input}
        placeholder="ID(E-mail)"
        value={id}
        onChangeText={(text) => setId(text)}
      />

      {/* Password 입력 공간 */}
      <TextInput
        style={Styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry // 비밀번호 입력 시 텍스트 감춤
      />

      <TouchableOpacity
        onPress={handleLogin} // 로그인 버튼 클릭 시 로그인 처리 함수 호출
        style={Styles.NextBottom}
      >
        <Text style={Styles.BottomText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Findlogin", { screen: 'Findlogin' })}
        style={Styles.NextBottom}
      >
        <Text style={Styles.BottomText}>Find ID/Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("KaKaoLogin", { screen: 'KaKaoLogin' })}
        style={Styles.NextBottom}
      >
        <Text style={Styles.BottomText}>KaKaoLogin</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Signin;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
  },
  HomeText: {
    fontSize: 35,
    textAlign: "center",
    marginTop: '55%',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#EAF2FF",
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 5,
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
