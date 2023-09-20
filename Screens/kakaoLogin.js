import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BACKEND} from "@env";

const REST_API_KEY = '9e3b385ffa4135b0873f3b72d40b5c08';
const REDIRECT_URI = BACKEND+':19000/Home';
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

const KaKaoLogin = () => {
  const navigation = useNavigation();

  useEffect(() => {
    resetToken();
  }, []);

  const resetToken = async () => {
    try {
      await AsyncStorage.removeItem('userAccessToken');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  function KakaoLoginWebView (data) {
    const exp = "code=";
    var condition = data.indexOf(exp);    
    if (condition != -1) {
      var authorize_code = data.substring(condition + exp.length);
      //console.log(authorize_code);
      requestToken(authorize_code);
    };
  }

  const requestToken = async (authorize_code) => {
    var AccessToken = "none";
    axios ({
      method: 'post',
      url: 'https://kauth.kakao.com/oauth/token',
      params: {
        grant_type: 'authorization_code',
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code: authorize_code,
      },
    }).then((response) => {
      AccessToken = response.data.access_token;
      console.log(AccessToken);
      getToken(AccessToken);
      storeData(AccessToken);
    }).catch(function (error) {
      console.log('error', error);
    })
    navigation.navigate("Signup", {screen:"Signup"});
  };


  const getToken = async (authorize_code) => {
    try {
      const response = await axios.post(BACKEND+`:8000/account/kakao/callback/`, { /* BACKEND+':8000/account/kakao/callback/' */
        access_token: authorize_code,  // 액세스 토큰 전달
      });
      await AsyncStorage.setItem('access', response.data.access);
      await AsyncStorage.setItem('refresh', response.data.refresh);
      console.log(response.status);
      console.log(response.data);
      console.log("user",response.data.user);  // 서버의 응답 메시지 출력
      console.log("refresh",response.data.refresh);
      console.log("access",response.data.access)
      // 액세스 토큰 저장 및 다음 동작 수행
    } catch (error) {
      console.log('Error1:', error);
      // 오류 처리
    }
  };

  
  const storeData = async(returnValue) => {
    try{
      await AsyncStorage.setItem('userAccessToken', returnValue);
    }catch(error){
    }
  }



  return (
    <View style={Styles.container}>      
      <WebView
        style={{ flex: 1 }}
        originWhitelist={['*']}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled
        onMessage={event => { KakaoLoginWebView(event.nativeEvent["url"]); }}
      />
    </View>
  )
}

export default KaKaoLogin;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: '#fff',
    paddingTop: 30
  },    
});