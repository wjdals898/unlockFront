import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import ActResult from './actresult'; // 파일 경로와 파일명에 맞게 수정해야 합니다.
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import {Graph} from '../assets/Graph.png';
import { VictoryChart, VictoryTheme, VictoryArea, VictoryPolarAxis, VictoryGroup, VictoryLine } from 'victory-native';
import Plotly from 'react-native-plotly';
import axios from 'axios';
import Papa from 'papaparse';
import {BACKEND} from '@env';
import { DefaultTheme as theme } from '@react-navigation/native';
import { Color } from '../GlobalStyles';
import Loading from './loading';


const Result2 = ({ route, navigation }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [loaded, setloaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState({});
  const userInfo = useSelector(state => state.userReducer.userInfo);
  const {key} = route.params || null;
  console.log('result2 화면');
  console.log('key : ', key.slice(0,-4));
  const {resultId} = route.params || null;
  console.log('rId : ', resultId);
  const person = route.params.person || userInfo; // route.params에서 person 객체 가져오기
  console.log('result2 화면 ', person);
  const {mindData} = route.params || null;
  console.log('result2 mindData : ', mindData);
  const [csvHeader, setCsvHeader] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [downloaded, setDownloaded] = useState(false);
  

  const labels1 = ['행복', '슬픔', '분노', '혐오', '공포', '무감', '놀람'];
  const labels = {
    "Happymean": '행복',
    "Surprisemean": '놀람',
    "Expressionlessmean": '무감',
    "Fearmean": '공포',
    "Aversionmean": '혐오',
    "Angrymean": '분노',
    "Sadmean": '슬픔',
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
    csvData.forEach(item => {
      if (item.text===result.sentence) {
          result.data = {
            Happy: item.Happy,
            Surprise: item.Surprise,
            Expressionless: item.Expressionless,
            Fear: item.Fear,
            Aversion: item.Aversion,
            Angry: item.Angry,
            Sad: item.Sad
          };
      }
    });
    console.log('result : ', result);
    return result;
  };

  const fetchEmotionResult = async () => {
    try {
      const response = await axios.post(BACKEND+':8000/result_file_download/', {
        type: 4,
        c_id: person.id,
        r_id: resultId,
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      console.log('blob', blob);
      const reader = new FileReader();
      reader.onload = async () => {
        const text = reader.result;
        console.log('text', text);
        // CSV 파싱
        Papa.parse(text, {
          header: true, // 첫 번째 줄을 헤더로 사용
          dynamicTyping: true, // 자동 형변환
          skipEmptyLines: true, // 빈 줄 스킵
          complete: (result) => {
            // 파싱된 데이터 저장
            setCsvHeader(result.meta.fields);
            console.log('Header : ', result.meta.fields);
            setCsvData(result.data);
            console.log('field data : ', result.data);
            setDownloaded(true);
          },
        });
      };
      reader.readAsText(blob);
    }
    catch (error) {
      console.log("ERROR", error);
    }
  };

  useEffect(() => {
    console.log('useEffect : ', filteredData);
  }, [filteredData]);

  useEffect(() => {
    fetchEmotionResult(); // 전체 감정 분석 결과 가져오기
    console.log('csvData', csvData);
  }, []);

  useEffect(() => {
    const mfilteredData = mindData.map(data => {
      const item = extractKeywordAndSentence(data);
        return item;
    }).filter(item => item.sentence !== null);;
    setFilteredData(mfilteredData);
    setloaded(true);
    console.log('filteredMindData : ', mfilteredData);
  }, [csvData]);

  useEffect(() => {
    console.log('selectedItem : ', selectedItem);
    console.log('selectedItem length : ', selectedItem.length);
    console.log('chartData : ', chartData);
  }, [selectedItem, chartData]);

  const handleItemPress = (index, item) => {
    setSelectedIndex(index); // 터치된 아이템의 인덱스 저장
    console.log('함수 item : ', item);
    setSelectedItem(item);
    const data = Object.entries(item.data).map(([key, value], i, array) => (
        [...array],
        array[i] = {x: labels[key+'mean'], y: value}
    ));
    console.log('data : ', data);
    setChartData(data);
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
              onPress={() => handleItemPress(index, data)}
            >
              <Text style={{fontSize: 18}}>{index+1}. {data.keyword}</Text>
            </TouchableOpacity>
          )
        )) : <Text style={{textAlign: 'center', fontSize: 20}}>해당 감정의 키워드가 없습니다.</Text>}
      </ScrollView>
      {downloaded ?
      <ScrollView style={styles.actResultContainer}>
        
        {selectedItem.data ? (
          <View>
            <Text style={styles.sentenceTitle}>"{<Text style={styles.keyword}>{selectedItem.keyword}</Text>}"(이)가 포함된 문장</Text>
            <View style={styles.sentenceList}>
              <Text>{selectedItem.sentence}</Text>
            </View>
            <View style={styles.imageContainer}>
              <VictoryChart polar
                  maxDomain={{y:100}}
                  minDomain={{y:0}}
                  startAngle={90}
                  endAngle={450}
                  theme={VictoryTheme.material}
                  
                >
                  <VictoryPolarAxis
                    main={[0, 100]}
                    tickValues={labels1}
                    labelPlacement="vertical"
                    style={{tickLabels: {fontSize: 15, padding: 15}}}
                  />
                  <VictoryArea
                    data={chartData} 
                    style={{ data: { fill: '#67B7DC', fillOpacity: 0.2 } }}
                  />
                  
              </VictoryChart>
              
            </View>
          </View>
          
        ) : <Text style={{textAlign: 'center', fontSize: 20}}>위에서 키워드를 선택하세요.</Text>}
      </ScrollView>
      : <Loading/> }
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
    marginTop: 20,
  },
});

export default Result2;
