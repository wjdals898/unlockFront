import React, {createRef} from "react";
import { View, StyleSheet, ImageBackground, Image, BackHandler, Alert } from "react-native";
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchResults } from "../store/actions/results/resultAction";
import { fetchCounselees } from "../store/actions/counselees/counseleeAction";
import { fetchReservations } from "../store/actions/reservations/reservationAction";
import axios from "axios";
import {BACKEND} from '@env';
import Toast, { DURATION } from 'react-native-easy-toast';


const Screen1 = () => {
  const toastRef = createRef();
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
      const fetchedCounselees = await fetchCounseleesFromBackend();
      console.log('useEffect1 : ',fetchedCounselees);
      dispatch(fetchCounselees(fetchedCounselees));

      const fetchedData = await fetchResultsFromBackend();
      console.log(fetchedData);
      dispatch(fetchResults(fetchedData));
    };
    console.log('home 화면 ', userInfo);
    fetchData();

  }, []);

  useEffect(() => {
    toastRef.current.show(userInfo.type === 'counselor' ? userInfo.name+' 상담사님 환영합니다!' : userInfo.name+' 내담자님 환영합니다!', 3000);
    const fetchData = async () => {
      if (userInfo.type === 'counselor') {
        const fetchedReservations = await fetchReservationFromBackend();
        console.log(fetchedReservations);
        dispatch(fetchReservations(fetchedReservations));
      }
    };
    fetchData();
    
  }, [userInfo]);

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
        // 오류 처리
        return null;
    }
  };

  async function fetchCounseleesFromBackend() {
    try {
        const response = await axios.get(BACKEND+':8000/counselee/', /*BACKEND+':8000/counselee/' BACKEND+`:8000/counselee/`*/
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access}`
            }
        });
        const data = JSON.parse(response.data);
        console.log('counselee data : ', data);
        return data; // 서버로부터 가져온 회원 리스트 데이터
    } catch (error) {
        return [];
    }
  };

  const fetchReservationFromBackend = async () => {
    try {
      console.log(access);
      const response = await axios.get(BACKEND+':8000/reservation/', { //`${BACKEND}:8000/reservation/all/` BACKEND+':8000/reservation/all/' BACKEND+`:8000/reservation/all/`
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access}`,
        }
      });
      console.log(response.data);
      return response.data;
    }
    catch (err) {
      console.log("ERROR FETCH RESERVATION LIST", err);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/MAINMENU.png')}
      style={styles.container}
    >
      <Toast ref={toastRef} position="top" positionValue={50} />
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