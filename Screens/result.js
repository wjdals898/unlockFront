import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewScreen from './NewScreen';
import {BACKEND} from '@env';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Papa from 'papaparse';


const Result = ({ route, navigation }) => {
  const userInfo = useSelector(state => state.userReducer.userInfo);
  console.log('result 페이지 userInfo : ', userInfo);
  const person  = route.params.person || userInfo; // route.params에서 person 객체 가져오기
  console.log('person',person);
  const listItems = useSelector(state => state.resultReducer.resultList);
  console.log('listItems: ', listItems);
  const filteredList = listItems.filter(item => item.counselee === person.id);
  console.log("filteredList : ", filteredList);
  const [resultItems, setResultItems] = useState(filteredList);
  const [currentResult, setCurrentResult] = useState(resultItems[resultItems.length-1]);
  const [selectedItem, setSelectedItem] = useState(currentResult);
  const [selectedDate, setSelectedDate] = useState(null);
  //const [emotionResult, setEmotionResult] = useState([]);
  //const emotions = useSelector(state => state.resultReducer.emotion);
  const [csvData1, setCsvData1] = useState([]);
  const [csvHeaders1, setCsvHeaders1] = useState([]);
  const [downloaded1, setDownloaded1] = useState(false);
  const [csvData2, setCsvData2] = useState([]);
  const [csvHeaders2, setCsvHeaders2] = useState([]);
  const [downloaded2, setDownloaded2] = useState(false);
  const [csvData3, setCsvData3] = useState([]);
  const [csvHeaders3, setCsvHeaders3] = useState([]);
  const [downloaded3, setDownloaded3] = useState(false);
  const [emotions, setEmotions] = useState([]);

  //console.log('emotions : ', emotions);
  console.log('currentResult : ', currentResult);
  console.log('counselee: ', currentResult.counselee);
  console.log('id : ', currentResult.id);
  console.log(emotions);

  const colors = {
    "Happymean": '#E57373',
    "Surprisemean": '#81C784',
    "Expressionlessmean": '#64B5F6',
    "Fearmean": '#FFD54F',
    "Aversionmean": '#9575CD',
    "Angrymean": '#4FC3F7',
    "Sadmean": '#A1887F',
  };
  const labels = {
    "Happymean": '행복',
    "Surprisemean": '놀람',
    "Expressionlessmean": '무감',
    "Fearmean": '공포',
    "Aversionmean": '혐오',
    "Angrymean": '분노',
    "Sadmean": '슬픔',
  };

  const downloadCsv1 = async () => {
    try {
      console.log('csv1 다운로드 함수 호출');
      console.log('currentResult : ', currentResult);
      const response = await axios.post(BACKEND+':8000/result_file_download/', { // BACKEND+':8000/result_file_download/' `${BACKEND}:8000/result_file_download/`
        //responseType: 'blob',
          type: 1,
          c_id: currentResult.counselee,
          r_id: currentResult.id,
      });

      console.log('데이터 확인!!', response.data);

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
            setCsvHeaders1(result.meta.fields);
            console.log('Header : ', result.meta.fields);
            setCsvData1(result.data);
            console.log('field data : ', result.data);
            setDownloaded1(true);
            console.log('resultData : ', result.data);
          },
        });
      };
      reader.readAsText(blob);

    } catch (error) {
      console.error('Failed to download CSV:', error);
    }
  };

  const downloadCsv2 = async () => {
    try {
      console.log('csv2 다운로드 함수 호출');
      console.log('currentResult : ', currentResult);
      const response = await axios.post(BACKEND+':8000/result_file_download/', { // BACKEND+':8000/result_file_download/' `${BACKEND}:8000/result_file_download/`
        //responseType: 'blob',
          type: 2,
          c_id: currentResult.counselee,
          r_id: currentResult.id,
      });

      console.log('데이터 확인!!', response.data);

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
            setCsvHeaders2(result.meta.fields);
            console.log('Header : ', result.meta.fields);
            setCsvData2(result.data);
            console.log('field data : ', result.data);
            setDownloaded2(true);
            console.log('resultData : ', result.data);
          },
        });
      };
      reader.readAsText(blob);

    } catch (error) {
      console.error('Failed to download CSV:', error);
    }
  };

  const downloadCsv3 = async () => {
    try {
      console.log('csv3 다운로드 함수 호출');
      console.log('currentResult : ', currentResult);
      const response = await axios.post(BACKEND+':8000/result_file_download/', { // BACKEND+':8000/result_file_download/' `${BACKEND}:8000/result_file_download/`
        //responseType: 'blob',
          type: 3,
          c_id: currentResult.counselee, //currentResult.counselee
          r_id: currentResult.id,//currentResult.id
      });

      console.log('데이터 확인!!', response.data);

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
            setCsvHeaders3(result.meta.fields);
            console.log('Header : ', result.meta.fields);
            setCsvData3(result.data);
            console.log('field data : ', result.data);
            setDownloaded3(true);
            console.log('resultData : ', result.data);
          },
        });
      };
      reader.readAsText(blob);

    } catch (error) {
      console.error('Failed to download CSV:', error);
    }
  };

  useEffect(() => {
    console.log('result 화면 렌더');
    downloadCsv1();
    downloadCsv2();
    downloadCsv3();
  }, []);


  useEffect(() => {
    if (downloaded1) {
      // csvData가 변경되면 화면을 다시 렌더
      console.log('CSV Data11:', csvData1);
      const emotion = csvData1.map(item => {
        const { end, start, text, ...rest } = item;
        return rest;
      });
      console.log('emoton = ', emotion);
      setEmotions(emotion);
    }
  }, [csvData1, downloaded1, currentResult]); //csvData, downloaded

  useEffect(() => {
    if (downloaded2) {
      // csvData가 변경되면 화면을 다시 렌더
      console.log('CSV Data22:', csvData2);
    }
  }, [csvData2, downloaded2]); //csvData, downloaded

  useEffect(() => {
    if (downloaded3) {
      // csvData가 변경되면 화면을 다시 렌더
      console.log('CSV Data22:', csvData3);
    }
  }, [csvData3, downloaded3]); //csvData, downloaded

  useEffect(() => {
    resultItems.map((item, index) => {
      if(item.id === selectedItem.id) {
        console.log("결과 선택");
        setCurrentResult(item);
        return;
      }
    });
    console.log('useEffect currentResult ', currentResult);
    downloadCsv1();
    downloadCsv2();
    downloadCsv3()
  }, [selectedItem]);

  const handleCirclePress = (key) => {
    console.log(key, '감정 클릭');
    // 동그라미를 클릭하면 result2 페이지로 이동
    navigation.navigate('result2', { person: person, key: key, mindData: csvData2 });
  };

  const screenWidth = Dimensions.get('window').width; // 현재 디바이스의 너비 가져오기

  const handleItemSelected = (itemValue) => {
    console.log('itemValue : ', itemValue);
    setSelectedItem(itemValue);
    setCurrentResult(itemValue);
  };


  return (
    <SafeAreaView style={{marginBottom: 10}}>
    <View style={{alignItems: 'center', }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{person.name ? person.name : null} 님 상담분석 결과</Text>
      </View>
      <View style={styles.dateContainer}>
        <Picker
          selectedValue={selectedItem}
          onValueChange={handleItemSelected}
          mode="dropdown"

        > 
          <Picker.Item key={-1} label={"날짜를 선택하세요."} value={null}/>
          {resultItems && resultItems.map((item, index) => (
            <Picker.Item key={index} label={item.date} value={item} />
          ))}
        </Picker>
        
      </View>
    </View>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.circleContainer}>
        {emotions.length > 0 ? Object.keys(emotions[0]).map((key, index) => (
          index < 4 ? (
            <TouchableOpacity key={key} onPress={() => handleCirclePress(key)}>
              <View style={[styles.circle, { 
                  width: screenWidth * 0.2,
                  height: screenWidth * 0.2,
                  backgroundColor: colors[key]}]}>
                <Text>{labels[key]}</Text>
                <Text>{emotions[0][key]}</Text>
              </View>
            </TouchableOpacity>
          ) : null
        )) : null }
      </View>
      <View style={styles.circleContainer2}>
        {emotions.length > 0 ? Object.keys(emotions[0]).map((key, index) => (
          key !== 'id' && index > 3 ? (
            <TouchableOpacity key={key} onPress={() => handleCirclePress(key)}>
              <View style={[styles.circle, { 
                  width: screenWidth * 0.2,
                  height: screenWidth * 0.2,
                  backgroundColor: colors[key]}]}>
                <Text>{labels[key]}</Text>
                <Text>{emotions[0][key].toString()}</Text>
              </View>
            </TouchableOpacity>
          ) : null
        )) : null}
      </View>

      <View style={{width: screenWidth - 40, height: '35%'}}>
        {csvData2.length > 0 && csvHeaders2.length > 0 ?
          <NewScreen mindData={csvData2} mindHeader={csvHeaders2} moveData={csvData3} />
          : null }
      </View>
        
      <ScrollView style={[styles.navyContainer, { width: screenWidth - 40 }]}>
      <Text>상담 결과</Text>
      </ScrollView>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC519',
  },
  dateContainer: {
    borderWidth: 2,
    backgroundColor: 'white',
    opacity: 0.4,
    borderRadius: 10,
    marginBottom: 20,
    width: '60%',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  navyContainer: {
    height: 500,
    backgroundColor: '#A9C3D0',
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  circleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  circleContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  circle: {
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#adc8e6',
    marginLeft: 10,
    marginRight: 10,
  },
  circleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Result;