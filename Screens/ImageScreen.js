import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ImageScreen = ({ route }) => {
  const { imageNumber } = route.params; // route.params에서 imageNumber 가져오기

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image {imageNumber} Screen Result </Text>
      {/* 원하는 내용 추가 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // 추가적인 스타일 지정
});

export default ImageScreen;
