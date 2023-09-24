import React from "react";
import { View, StyleSheet, ImageBackground, Image, BackHandler, Alert } from "react-native";
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchResults } from "../store/actions/results/resultAction";
import { fetchCounselees } from "../store/actions/counselees/counseleeAction";
import axios from "axios";
import {BACKEND} from '@env';

const Screen1 = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.userReducer.userInfo);
  const access = useSelector(state => state.userReducer.access);
  const isFocused = useIsFocused()
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchResultsFromBackend();
      console.log(fetchedData);
      dispatch(fetchResults(fetchedData));

      const fetchedCounselees = await fetchCounseleesFromBackend();
      dispatch(fetchCounselees(fetchedCounselees));
    };
    console.log('home 화면 ', userInfo);
    fetchData();
    
  }, []);

  async function fetchResultsFromBackend() {
    try {
      console.log(access);
      const response = await axios.get(BACKEND+':8000/result/', /*BACKEND+':8000/result/' BACKEND+`:8000/result/`*/
      {
          //params: {id: person.id},
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`
          }
      });
      console.log(response.status);
      console.log(response.data);

      return response.data;
    } catch (error) {
        console.log('Error1:', error);
        // 오류 처리
        return null;
    }
  };

  async function fetchCounseleesFromBackend() {
    try {
        access = await AsyncStorage.getItem("access");
        const response = await axios.get(BACKEND+':8000/counselee/'/*BACKEND+':8000/counselee/' BACKEND+`:8000/counselee/`*/,
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

  return (
    <ImageBackground
      source={require('../assets/MAINMENU.png')}
      style={styles.container}
    >
      <View>
      <Image
          source={require('../assets/moon.png')}
          style={{ width: 50, height: 50, alignSelf: 'center', 
          position: 'absolute', top: -150, left: 180 }}
        />
        <Image
          source={require('../assets/icon4.png')}
          style={{ width: 100, height: 100, alignSelf: 'center', 
          position: 'absolute', top: 170, left: 155 }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  HomeText: {
    fontSize: 35,
    textAlign: "center",
  },
});

export default Screen1;