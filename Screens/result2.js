import React from 'react';
import { View, Text, StyleSheet, ScrollView, } from 'react-native';
import ActResult from './actresult'; // 파일 경로와 파일명에 맞게 수정해야 합니다.
import { SafeAreaView } from 'react-native-safe-area-context';

const Result2 = ({ route, navigation }) => {
  const {key} = route.params;
  console.log('result2 화면');
  console.log('key : ', key);
  const { person } = route.params; // route.params에서 person 객체 가져오기
  console.log(person);

  const labels = {
    'emotion1': '행복',
    'emotion2': '놀람',
    'emotion3': '무감',
    'emotion4': '공포',
    'emotion5': '혐오',
    'emotion6': '분노',
    'emotion7': '슬픔',
  }

  return (
    <SafeAreaView>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{person.userkey.name? person.userkey.name : null} 님 상담분석 결과</Text>
        <Text style={styles.subtitle}>{labels[key]} 감정 리스트</Text>
      </View>

      <ScrollView style={styles.listContainer}>
        <View style={styles.listItem}>
          <Text>감정 1</Text>
        </View>
        <View style={styles.listItem}>
          <Text>감정 2</Text>
        </View>
        <View style={styles.listItem}>
          <Text>감정 3</Text>
        </View>
      </ScrollView>

      <View style={styles.actResultContainer}>
        <ActResult />
      </View>
    </ScrollView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  listContainer: {
    height: 200,
    marginBottom: 20,
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  actResultContainer: {
    marginTop: 20, 
  },
});

export default Result2;
