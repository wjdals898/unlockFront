import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import ActResult from './actresult'; // 파일 경로와 파일명에 맞게 수정해야 합니다.
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import {Graph} from '../assets/Graph.png';


const Result2 = ({ route, navigation }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [loaded, setloaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const userInfo = useSelector(state => state.userReducer.userInfo);
  const {key} = route.params || null;
  console.log('result2 화면');
  console.log('key : ', key.slice(0,-4));
  const person = route.params.person || userInfo; // route.params에서 person 객체 가져오기
  console.log('result2 화면 ', person);
  const {mindData} = route.params || null;
  console.log('result2 mindData : ', mindData);
  

  const labels = {
    'Happymean': '행복',
    'Surprisemean': '놀람',
    'Expressionlessmean': '무감',
    'Fearmean': '공포',
    'Aversionmean': '혐오',
    'Angrymean': '분노',
    'Sadmean': '슬픔',
  };

  console.log('감정 : ', labels[key]);

  function extractKeywordAndSentence(data) {
    const replacement = key.slice(0, -4);

    // "emotion" 문자열에서 "선생"를 포함하는 문장을 추출하는 정규식
    const regex = new RegExp(`\\('([^']+)'\\s*,\\s*'${replacement}'\\)`);
    console.log('regex : ', regex);

    // "emotion" 문자열에서 "선생"를 포함하는 문장 추출
    const match = data.emotion.match(regex);
    console.log('match : ', match);

    // 결과를 객체로 반환
    const result = {
      keyword: data[""],
      sentence: match ? match[1] : null
    };
    return result;
  };

  useEffect(() => {
    console.log('useEffect : ', filteredData);
  }, [filteredData]);

  useEffect(() => {
    const mfilteredData = mindData.map(data => {
      const item = extractKeywordAndSentence(data);
        return item;
    }).filter(item => item.sentence !== null);;
    setFilteredData(mfilteredData);
    setloaded(true);
    console.log('filteredMindData : ', mfilteredData);
  }, []);

  useEffect(() => {
    console.log('selectedItem : ', selectedItem);
  }, [selectedItem]);

  const handleItemPress = (index, item) => {
    setSelectedIndex(index); // 터치된 아이템의 인덱스 저장
    console.log('함수 item : ', item);
    setSelectedItem(item);
  };

  return (
    <SafeAreaView>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{person.name? person.name : null} 님 상담분석 결과</Text>
        <Text style={styles.subtitle}>{labels[key]} 감정 키워드</Text>
      </View>

      <ScrollView style={styles.listContainer}>
        {loaded && filteredData.length > 0 ? (
          filteredData.map((data, index) => (
            <TouchableOpacity key={index} 
              style={[styles.listItem, selectedIndex === index && styles.selectedItem]}
              onPress={() => handleItemPress(index, data.sentence)}
            >
              <Text style={{fontSize: 18}}>{index+1}. {data.keyword}</Text>
            </TouchableOpacity>
          )
        )) : <Text style={{textAlign: 'center', fontSize: 20}}>해당 감정의 키워드가 없습니다.</Text>}
      </ScrollView>

      <ScrollView style={styles.actResultContainer}>
        
        {selectedItem ? (
          <View>
            <Text style={styles.sentenceTitle}>"{<Text style={styles.keyword}>{filteredData[selectedIndex].keyword}</Text>}"(이)가 포함된 문장</Text>
            <View style={styles.sentenceList}>
              <Text>{selectedItem}</Text>
            </View>
            <View style={styles.imageContainer}>
              <Image 
                style={styles.image}
                source={require('../assets/Graph.png')}
              />
            </View>
          </View>
          
        ) : <Text style={{textAlign: 'center', fontSize: 20}}>위에서 키워드를 선택하세요.</Text>}
      </ScrollView>
    </ScrollView>
    </SafeAreaView>
  );
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFC519',
  },
  subtitle: {
    fontSize: 21,
    color: '#666',
    marginBottom: 10,
  },
  listContainer: {
    height: 200,
    marginBottom: 10,
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    height: '40%',
  },
  listItem: {
    paddingVertical: 10,
    backgroundColor: '#C1D5F1',
    marginBottom: 10,
    borderRadius: 20,
    width: '80%',
    height: 45,
    alignItems: 'center',
    alignSelf: 'center',
  },
  actResultContainer: {
    marginTop: 10, 
    borderTopWidth: 2,
    borderTopColor: '#D9D9D9',
    paddingTop: 20,
  },
  selectedItem: {
    backgroundColor: '#A0CAFF', // 선택된 아이템에 원하는 스타일을 적용
  },
  sentenceList: {
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
  },
  sentenceTitle: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  keyword: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#C73535',
  },
  image: {
    width : '90%',
    height : 350,
    alignItems: 'center',
    resizeMode: 'contain',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default Result2;
