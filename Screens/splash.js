import React, { useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import {BACKEND} from '@env';
import { fetchCounselees } from "../store/actions/counselees/counseleeAction";
import { useDispatch } from 'react-redux';

const Splash = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const getData = async () => {
    let token = '';
    // AsyncStorage 에서 access 토큰을 찾아온다. 
    await AsyncStorage.getItem('access', (err, result) => {
      token = result;
    });

    try {
      const response = await axios.get(BACKEND+`:8000/account/info/`, { //BACKEND+`:8000/account/info/` BACKEND+':8000/account/info/'
        headers : {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      await AsyncStorage.setItem('email', response.data.email);
      await AsyncStorage.setItem('type', response.data.type);
      await AsyncStorage.setItem('name', response.data.name);
      console.log(response.data);
    }
    catch (error) {
      console.log('login failed!', error);
      await AsyncStorage.clear();
      // navigation.navigate("Signin", { screen: 'Signin' });
    }
  };
    
  const getRefreshToken = async () => {
    let refreshtoken = '';
    // refreshtoken을 AsyncStorage 에서 찾아온다. 
    await AsyncStorage.getItem('refresh', (err, result) => {
      refreshtoken = result;
    });
    
    try {
      const response = await axios.post(BACKEND+`:8000/account/token/refresh/`, //BACKEND+':8000/account/token/refresh/' BACKEND+`:8000/account/token/refresh/`
        { refresh : refreshtoken },
        {
          headers: {
            "Content-Type": "application/json"
          }
        },
        
      );
      console.log(response.status);
      await AsyncStorage.setItem('access', response.data.access);
      getData(); // 사용자 정보 가져오기
      await AsyncStorage.getItem('type', (err, result) => {
        type = result;
      });
      console.log(type);
      if (type === "counselor") {
        navigation.navigate("Home", { screen: 'Home' });
      }
      else if (type === "counselee") {
        navigation.navigate("Signup", { screen: 'Signup' });
      }
    }
    catch (error) {
      console.log('refresh request failed!', error);
      await AsyncStorage.clear();
      // navigation.navigate("Signin", { screen: 'Signin' });
    }
  };

  async function fetchCounseleesFromBackend() {
    try {
        access = await AsyncStorage.getItem("access");
        const response = await axios.get(BACKEND+`:8000/counselee/`/*BACKEND+':8000/counselee/' BACKEND+`:8000/counselee/`*/,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access}`
            }
        });
        const data = JSON.parse(response.data);
        console.log(data);
        return data; // 서버로부터 가져온 회원 리스트 데이터
    } catch (error) {
        console.error('Error1 fetching members:', error);
        return [];
    }
  };
  
  useEffect(() => {
    getRefreshToken();

    const fetchData = async () => {
      const fetchedCounselees = await fetchCounseleesFromBackend();
      dispatch(fetchCounselees(fetchedCounselees));
  }

  fetchData();
    // getdata();
  }, []);

  return (
    <View style={Styles.container}>      
      <Text style={Styles.HomeText}>UNLOCK</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Signin", { screen: 'Signin' })}
        style={Styles.NextBottom}
      >
        <Text style={Styles.BottomText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Userlogin", { screen: 'Userlogin' })}
        style={Styles.NextBottom}
      >
        <Text style={Styles.BottomText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Splash;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  HomeText: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 230
  },
  NextBottom: {
    backgroundColor: "#A9C3D0",
    padding: 10,
    marginTop: "20%",
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