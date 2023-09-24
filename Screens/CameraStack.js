import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./MainScreen";
import UploadScreen from "./UploadScreen";
import ClientDiaryList from "./Screen7";
import { useSelector } from "react-redux";

const Stack = createStackNavigator();

const CameraStack = ({route, navigation}) => {
  const userInfo = useSelector(state => state.userReducer.userInfo);
  const {personId} = route.params ? route.params : userInfo.id;
  const {personName} = route.params ? route.params : userInfo.name;
  return (
    <Stack.Navigator
      initialRouteName="Screen7"
      // screenOptions={{
      //   headerStyle: {
      //     backgroundColor: "#035",
      //   },
      //   headerTintColor: "#fd0",
      // }}
    >
      <Stack.Screen name="Screen7" options={{headerShown: false}} component={ClientDiaryList} initialParams={{personId: personId, personName: personName}}/>
      <Stack.Screen name="MainScreen" component={MainScreen} initialParams={{personId: personId, personName: personName}} />
      <Stack.Screen name="UploadScreen" component={UploadScreen} />
    </Stack.Navigator>
  );
};

export default CameraStack;
