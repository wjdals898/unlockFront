import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCounselors } from '../store/actions/counselors/counselorAction';
import { Border, Color, FontFamily, FontSize } from "../GlobalStyles";
//import { StackActions } from '@react-navigation/native';

import CalendarScreen from './CalendarScreen';
import axios from 'axios';
import { BACKEND } from '@env';
import { fetchReservations } from '../store/actions/reservations/reservationAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import BookingScreen from './BookingScreen';

const Stack = createStackNavigator();

const BookingListScreen = ({ route, navigation }) => {
    const counselorList = useSelector(state => state.counselorReducer.counselorList);
    const dispatch = useDispatch();

    const navigation1 = useNavigation();
    const selectedId = route.params?.selectedId;
    console.log("selectedId : ", selectedId);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedCounselors = await fetchDataFromBackend();
            dispatch(fetchCounselors(fetchedCounselors));

            const fetchedReservations = await fetchReservationFromBackend();
            dispatch(fetchReservations(fetchedReservations));
        }
        
        fetchData();
    }, []);

    useEffect(() => {
        console.log("상담사 리스트 업데이트");
    }, [counselorList]);

    // 예시용 더미 데이터
    // const bookings = [
    //     { id: 1, couselor_id: 1,title: '오교수', character: '#잘함' },
    // ];
    
    
    console.log(counselorList);
    const filteredBookings = counselorList.filter((counselor) => counselor.prof_field.id === selectedId);
    console.log(filteredBookings);

    const fetchDataFromBackend = async () => {
        try {
            const response = await axios.get(BACKEND+':8000/reservation/counselorlist/'); // BACKEND+`:8000/reservation/counselorlist/`
            console.log(response.data);
            return response.data;
        }
        catch (err) {
            console.log("ERROR Fetch Counselor List!", err);
        }
    };

    const fetchReservationFromBackend = async () => {
      try {
        await AsyncStorage.getItem('access', (err, result) => {
          token = result;
        });
        console.log(token);
        const response = await axios.get(BACKEND+':8000/reservation/all/', { //BACKEND+`:8000/reservation/all/`
          params: {
            topic: selectedId
          },
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
        <NavigationContainer 
            independent={true}
            style={styles.container}
        >
            <Stack.Navigator>
            <Stack.Screen  
                name="BookingListScreen"
                options={{headerShown: false}}
                style = {styles.Container}
            >
                {(props) => <HomeListScreen {...props} navigation={navigation} buttons={filteredBookings} />}
            </Stack.Screen>
            
            </Stack.Navigator>
        </NavigationContainer>
    );

};

const HomeListScreen = ({ navigation, buttons }) => {

    const handleButtonPress = (id, name, topicId, topicName) => {
        Alert.alert(
            name+' 상담사님으로 예약하시겠습니까?',
            '',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                text: 'OK',
                onPress: () => {
                    return(
                        navigation.navigate('CalendarScreen', {counselorId: id, counselorName: name, topicId: topicId, topicName: topicName})
                    );
                },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        
        <View style={styles.container}>
            
        {buttons.map((counselor) => (
            <TouchableHighlight
            key={counselor.id} // 고유한 키로 변경
            onPress={() => handleButtonPress(counselor.id, counselor.userkey.name, counselor.prof_field.id, counselor.prof_field.type)} // navigation 매개변수 제거
            underlayColor="#DDDDDD"
            style={styles.item}
            >   
                    <View style={styles.view}>
                        <Text style={[styles.text, styles.textLayout1]}>이름</Text>
                        <Text style={[styles.text1, styles.textLayout]}>{counselor.userkey.name}</Text>
                        <Text style={[styles.text2, styles.textLayout]}>{counselor.userkey.birth}</Text>
                        <View style={[styles.view2, styles.viewLayout]}>
                            <View style={[styles.view3, styles.viewLayout]} />
                            <Text style={[styles.text3, styles.textFlexBox]}>{counselor.institution_name}</Text>
                            <Text style={[styles.text4, styles.textFlexBox]}>상담소</Text>
                        </View>
                        <Text style={[styles.text5, styles.textLayout1]}>나이</Text>
                        <Text style={[styles.text6, styles.textTypo]}>성별</Text>
                        <Text style={[styles.text7, styles.textTypo]}>{counselor.userkey.gender}</Text>
                        </View>
            </TouchableHighlight>
        ))}
        </View>
    );
};

export default BookingListScreen;


    const styles = StyleSheet.create({
    Container: {
      
      backgroundColor: 'white',
    },
    container: {
        display: 'flex',
        marginTop: 30,
        alignItems: 'center',
    },
    item: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#E9EFFA',
        borderRadius: 10,
    },
    textLayout1: {
        color: Color.colorDarkgray_100,
    },
      textLayout: {
        color: Color.colorBlack,
      },
      viewLayout: {
        height: 40,
        marginLeft: 10,
        position: "absolute",
        display: "flex",
        right:0,
      },
      textFlexBox: {
        height: 20,
        
        textAlign: "center",
        left: "50%",
        
        display: "flex",
        position: "absolute",
      },
      textTypo: {
        top: 73,
        alignItems: "center",
        display: "flex",
        textAlign: "left",
        fontSize: FontSize.size_xl,
        position: "absolute",
      },
      text: {
        top: 15,
        alignItems: "center",
        display: "flex",
        textAlign: "left",
        fontSize: FontSize.size_xl,
        height: 26,
        color: Color.colorDarkgray_100,
        left: 14,
        position: "absolute",
      },
      text1: {
        top: 15,
        height: 23,
        color: Color.colorBlack,
        left: 62,
        width: 60,
        alignItems: "center",
        display: "flex",
        textAlign: "left",
        fontSize: FontSize.size_xl,
        position: "absolute",
      },
      text2: {
        top: 45,
        width: 60,
        height: 23,
        color: Color.colorBlack,
        left: 62,
        alignItems: "center",
        display: "flex",
        textAlign: "left",
        fontSize: FontSize.size_xl,
        position: "absolute",
      },
      view3: {
        backgroundColor: Color.colorGray_100,
        borderRadius: Border.br_3xs,
        left: 0,
        top: 0,
      },
      text3: {
        marginLeft: -73.17,
        fontSize: FontSize.size_sm,
        width: 146,
        height: 20,
        justifyContent: "center",
        textAlign: "center",
        left: "50%",
        color: Color.colorBlack,
        top: 16,
      },
      text4: {
        marginLeft: -71.81,
        top: 1,
        fontSize: FontSize.size_3xs,
        color: Color.colorChocolate,
        width: 144,
      },
      view2: {
        top: 62,
        left: 116,
      },
      text5: {
        top: 44,
        alignItems: "center",
        display: "flex",
        textAlign: "left",
        fontSize: FontSize.size_xl,
        height: 26,
        color: Color.colorDarkgray_100,
        left: 14,
        position: "absolute",
      },
      text6: {
        height: 26,
        color: Color.colorDarkgray_100,
        left: 14,
        width: 60,
        top: 73,
      },
      text7: {
        width: 25,
        height: 23,
        color: Color.colorBlack,
        left: 62,
      },
      view: {
        height: 100,
        width: 320,
        display:"flex",
        bottom: '5%',
      },
});