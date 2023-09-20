import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useRoute, useFocusEffect } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, BackHandler } from 'react-native';

//import Axios from 'axios';

import Splash from './Screens/splash';
import Signin from './Screens/signin';
import Signup from './Screens/signup';
import KaKaoLogin from './Screens/kakaoLogin';
//import Home from './Screens/home';

import Screen1 from './Screens/Screen1';
import Screen2 from './Screens/Screen2';
import Calendar from './Screens/Calendar';
import Screen4 from './Screens/Screen4';
import Screen5 from './Screens/Screen5';
import Screen6 from './Screens/Screen6';
import Screen7 from './Screens/Screen7';
import Screen8 from "./Screens/Screen8";
import Settingscreen from './Screens/Settingscreen';
import Infoscreen from './Screens/Infoscreen';

import result from './Screens/result';
import result2 from './Screens/result2';
import actresult from './Screens/actresult';
import NewScreen from './Screens/NewScreen';
import ImageScreen from './Screens/ImageScreen';
import Userlogin from './Screens/Userlogin';
import Result from './Screens/result';
import Findlogin from './Screens/Findlogin';

import CameraStack from "./Screens/CameraStack";

const Stack = createStackNavigator();

function StackScreen() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}} />
      <Stack.Screen name="Signin" component={Signin} options={{headerShown: false}} />
      <Stack.Screen name="KaKaoLogin" component={KaKaoLogin} options={{headerShown: false}} />
      <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}} />
      <Stack.Screen name="Home" component={BottomStack} options={{headerShown: false}} />
      <Stack.Screen name="Userlogin" component={Userlogin} options={{headerShown: false}} />
      {/* <Stack.Screen name="Findlogin" component={Findlogin} options={{headerShown: false}} /> */}
    </Stack.Navigator>
  );
}

function SettingScreen() {
  return (
    <Stack.Navigator
      initialRouteName="Screen4"
    >
      <Stack.Screen name="Screen4" component={Screen4} options={{headerShown: false}} />
      <Stack.Screen name="Screen5" component={Screen5} options={{headerShown: true, headerTitle: "",}} />
      <Stack.Screen name="Screen6" component={Screen6} options={{headerShown: true, headerTitle: ""}} />
      <Stack.Screen name="Settingscreen" component={Settingscreen} options={{headerShown: true, headerTitle: ""}} />
      <Stack.Screen name="Infoscreen" component={Infoscreen} options={{headerShown: true, headerTitle: ""}} />
    </Stack.Navigator>
  );
}

function Camera() {
  return (
    <Stack.Navigator initialRouteName="Screen8">
      <Stack.Screen
        name="Screen8"
        component={Screen8}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CameraStack"
        component={CameraStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ResultScreen() {
  return (
    <Stack.Navigator
      initialRouteName="Screen2"
    >
      <Stack.Screen name="Screen2" component={Screen2} options={{headerShown: false}} />
      <Stack.Screen name="result" component={result} options={{headerShown: false}} />
      <Stack.Screen name="result2" component={result2} options={{headerShown: false}} />
      <Stack.Screen name="actresult" component={actresult} options={{headerShown: true}} />
      <Stack.Screen name="NewScreen" component={NewScreen} options={{headerShown: true}} />
      <Stack.Screen name="ImageScreen" component={ImageScreen} options={{headerShown: true, headerTitle: ""}} />
    </Stack.Navigator>
  )
}

function HomeScreen() {
  return (
    <Stack.Navigator
      initialRouteName="Screen1"
    >
      <Stack.Screen name="Screen1" component={Screen1} options={{headerShown: false}} />
      <Stack.Screen name="Screen2" component={ResultScreen} options={{headerShown: false}} />
      <Stack.Screen name="Calendar" component={Calendar} options={{headerShown: false}} />
      <Stack.Screen name="Screen7" component={Screen7} options={{headerShown: false}} />
      <Stack.Screen name="Screen4" component={SettingScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

/*
const addTodo = (todo: TodoModel) => {
  Axios.post('http://172.20.14.35:19000/create', todo)
    .then(res => {
      console.log(res.data);
      getTodos()
    })
    .catch(error => console.log(error));
};

const getTodos = () => {
  Axios.get('http://로컬아이피주소:포트번호/todos')
    .then(res => {
      setTodos(res.data);
    })
    .catch(error => console.log(error));
};

const editTodo = (todo: TodoModel) => {
  Axios.put('http://로컬아이피주소:포트번호/todos', todo)
    .then(res => {
      console.log(res.data);
    })
    .catch(error => console.log(error));
};

const deleteTodo = (id: number) => {
  Axios.delete(`http://로컬아이피주소:포트번호/todos/${id}`)
    .then(res => {
      console.log(res.data);
      getTodos();
    })
    .catch(error => console.log(error));
};

*/

const BottomTab = createBottomTabNavigator();

function BottomStack() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown : false,
        tabBarLabelStyle: { display: 'none' }, // 이름 숨기기
        tabBarStyle: { backgroundColor : '#A9C3D0', height : 70 }
      }}
    >
      <BottomTab.Screen
        name="Video"
        component={Camera}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require('./assets/3.png')}
              style={{ width: 75, height: 80 }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="List"
        component={ResultScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require('./assets/4.png')}
              style={{ width: 65, height: 65 }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require('./assets/icon4.png')}
              style={{ width: 65, height: 65 }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require('./assets/2.png')}
              style={{ width: 65, height: 65 }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="User"
        component={SettingScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require('./assets/1.png')}
              style={{ width: 65, height: 65 }}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function Navigation() {
  return (
    <NavigationContainer independent={true}>
      <StackScreen>
      </StackScreen>
    </NavigationContainer>
  );
}

export default Navigation;