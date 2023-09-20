import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity,Text, BackHandler, Alert } from 'react-native';
import { NavigationContainer, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BookingListScreen from './BookingListScreen';
import axios from 'axios';
import {BACKEND} from '@env';
import CalendarScreen from './CalendarScreen';
//import { width } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';

const Stack = createStackNavigator();

const BookingScreen = () => {
    const [listItems, setListItems] = useState([]);

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
        fetchCounselingType()
            .then((response) => {
                response.map((data) => {
                    const item = {
                        id: data.id,
                        title: data.type
                    };
                    setListItems((prevList) => [...prevList, item]);
                })
            })
            .catch((error) => console.error('Error2 setting typs:', error));
    }, []);
    
    async function fetchCounselingType() {
        try{
            const response = await axios.get(BACKEND+':8000/account/type/', //BACKEND+`:8000/account/type/` BACKEND+':8000/account/type/'
            {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await response.data;
            console.log(data);
            return data;
        }
        catch (error) {
            console.error('Error1 fetching types:', error);
            return [];
        }
    };

    return (
        <Stack.Navigator independent={true} initialRouteName="Booking Topic">
            <Stack.Screen name="상담 주제" options={{headerTitleAlign: 'center'}}>
                {(props) => <HomeScreen {...props} buttons={listItems} />}
            </Stack.Screen>
            <Stack.Screen 
                name="BookingListScreen" 
                component={BookingListScreen}
                options={{headerShown: true, headerTitle: "상담사 선택", headerTitleAlign: 'center'}}
            />
            <Stack.Screen 
                name="CalendarScreen" 
                component={CalendarScreen}
                options={{headerShown: true, headerTitle: "예약", headerTitleAlign: 'center'}}
            />
        </Stack.Navigator>
    );
};

const HomeScreen = ({ navigation, buttons }) => {
    const handleButtonPress = (id) => {
        navigation.navigate('BookingListScreen', { selectedId: id });
        };
    
    return (
        <View style={style.container}>
            {buttons.map((button) => (
            <TouchableOpacity
                key={button.id}
                title={button.title}
                onPress={() => handleButtonPress(button.id)}
                style={style.button} >
                <Text style={style.modalButtonText}>{button.title}</Text>
            </TouchableOpacity>
            ))}
        </View>
    );
};

function Navigation() {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={BookingScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
export default Navigation;

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingBottom: 50, // 버튼 높이만큼 아래 여백 추가
        margin: 5,
        borderRadius: 5,
        backgroundColor: '#ffffff'
    },
    button: {
        marginBottom: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: '#A9C3D0',
        width: '100%',
        height: 58,
        alignItems:'center',
        justifyContent:'center'
        
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize : 25,
    },
});
