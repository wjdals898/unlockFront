import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {View, Button, Text} from 'react-native';
//import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createMaterialTopTabNavigator();

function Actresult() {
  return (
    <Tab.Navigator 
        initialRouteName="All"
        screenOptions={{
            tabBarIndicatorStyle: '#009688',
            tabBarActiveTintColor: '#009688',
        }}>
      {/* 첫 번째 탭 화면 */}
      <Tab.Screen
        name="All"
        component={HomeScreen}
        options={{
            tabBarLabel: '전체',
        }}
      />
      {/* 두 번째 탭 화면 */}
      <Tab.Screen
        name="Action"
        component={SearchScreen}
        options={{
          tabBarLabel: '행동',
        }}
      />
      {/* 세 번째 탭 화면 */}
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="search" size={24} color={color}/>
          ),
        }}
      />
      {/* 네 번째 탭 화면 */}
      <Tab.Screen
        name="Message"
        component={MessageScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="message" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

//각각 화면 함수 정의(Mind 결과)
function HomeScreen({navigation}) {
  return (
    <View>
      <Text>Home</Text>
      <Button
        title="상세보기"
        onPress={() => navigation.push('Detail', {id: 1})}
      />
    </View>
  );
}

function SearchScreen() {
  return <Text>Search</Text>
}

function NotificationScreen() {
  return <Text>Notification</Text>
}

function MessageScreen() {
  return <Text>Message</Text>
}

export default Actresult;