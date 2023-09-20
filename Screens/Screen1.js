import React from "react";
import { View, StyleSheet, ImageBackground, Image, BackHandler, Alert } from "react-native";
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

const Screen1 = () => {
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