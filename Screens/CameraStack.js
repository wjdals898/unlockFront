import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./MainScreen";
import UploadScreen from "./UploadScreen";
import ClientDiaryList from "./Screen7";
import { useSelector } from "react-redux";

const Stack = createStackNavigator();

const CameraStack = ({route, navigation}) => {
  const userInfo = useSelector(state => state.userReducer.userInfo);
  const personId = route.params?.personId || userInfo.id;
  const personName = route.params?.personName || userInfo.name;
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
      {/* <Stack.Screen name="MainScreen" options={{headerShown: true, headerTitle: "영상업로드"}} component={MainScreen} initialParams={{personId: personId, personName: personName}} /> */}
      <Stack.Screen name="UploadScreen" options={{headerShown: true, headerTitle: "영상업로드"}} component={UploadScreen} initialParams={{personId: personId, personName: personName}} />
    </Stack.Navigator>
  );
};

export default CameraStack;
