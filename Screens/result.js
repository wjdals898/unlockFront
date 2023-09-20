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
  const { person } = route.params; // route.params에서 person 객체 가져오기
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
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [downloaded, setDownloaded] = useState(false);
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

  const downloadCsv = async () => {
    try {
      console.log('csv 다운로드 함수 호출');
      console.log('currentResult : ', currentResult);
      const response = await axios.post(BACKEND+`:8000/result_file_download/`, { // BACKEND+':8000/result_file_download/'
        //responseType: 'blob',
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
            setCsvHeaders(result.meta.fields);
            console.log('Header : ', result.meta.fields);
            setCsvData(result.data);
            console.log('field data : ', result.data);
            setDownloaded(true);
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
    downloadCsv();
  }, []);

  useEffect(() => {
    if (downloaded) {
      // csvData가 변경되면 화면을 다시 렌더
      console.log('CSV Data:', csvData);
      const emotion = csvData.map(item => {
        const { end, start, text, ...rest } = item;
        return rest;
      });
      console.log('emoton = ', emotion);
      setEmotions(emotion);
      
    }
  }, [csvData, downloaded, currentResult]); //csvData, downloaded

  // useEffect(() => {
  //   console.log('emotion 업데이트', emotions);
  // }, [emotions]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await downloadCsvFile();
  //   };
  //   fetchData();

  // }, []);

  // useEffect(() => {
  //   console.log('circleValues 업데이트');
  //   console.log(emotionResult);
  // }, [emotionResult]);

  // useEffect(() => {
  //   console.log(selectedItem);
  //   // const filteredList = listItems.reduce((acc, current) => {
  //   //   const formattedDate = format(new Date(current.date), 'yyyy-MM-dd');
  //   //   if(current.counselee === person.id) {
  //   //     console.log("id : ", current.id);
  //   //     acc.push({
  //   //       id: current.id,
  //   //       analysis_url: current.analysis_url,
  //   //       counselee: current.counselee,
  //   //       counselor: current.counselor,
  //   //       date: formattedDate,
  //   //       video: current.video
  //   //     });
  //   //   }
  //   // },[]);
  //   const filteredList = listItems.filter(item => item.counselee === person.id);
  //   console.log("filteredList : ",filteredList);
  //   setResultItems(filteredList);
  //   // const fetchData = async () => {
  //   //   const fetchedResults = await fetchResultsFromBackend();
  //   //   console.log(fetchedResults);
  //   //   setResultItems(fetchedResults);
  //   //   console.log(fetchedResults[fetchedResults.length-1]);
  //   //   setCurrentResult(fetchedResults[fetchedResults.length-1]);
  //   // }
  //   // fetchResultsFromBackend();
  //   // console.log(fetchedResults);
  //   // setResultItems(fetchedResults);
  //   // console.log(fetchedResults[fetchedResults.length-1]);
  //   // setCurrentResult(fetchedResults[fetchedResults.length-1]);
  //   //fetchData();
  // });

  useEffect(() => {
    resultItems.map((item, index) => {
      if(item.id === selectedItem.id) {
        console.log("결과 선택");
        setCurrentResult(item);
        return;
      }
    });
    console.log('useEffect currentResult ', currentResult);
    downloadCsv();
  }, [selectedItem]);

  const handleCirclePress = (key) => {
    console.log(key, '감정 클릭');
    // 동그라미를 클릭하면 result2 페이지로 이동
    navigation.navigate('result2', { person: person, key: key });
  };

  const screenWidth = Dimensions.get('window').width; // 현재 디바이스의 너비 가져오기

  const handleItemSelected = (itemValue) => {
    console.log('itemValue : ', itemValue);
    setSelectedItem(itemValue);
  };

  // const circleValues = Object.entries(emotionResult).map(([key, value]) => {
  //   return { value: `${key}: ${value}`, color: colors[key] };
  // });

  return (
    <SafeAreaView>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{person.userkey.name ? person.userkey.name : null} 님 상담분석 결과</Text>
      </View>

      <View style={styles.dateContainer}>
        <Picker
          selectedValue={currentResult}
          onValueChange={handleItemSelected}
          mode="dropdown"
        > 
          <Picker.Item key={-1} label={"날짜를 선택하세요."} value={null} />
          {resultItems && resultItems.map((item, index) => (
            <Picker.Item key={index} label={item.date} value={item} />
          ))}
        </Picker>
        
      </View>
    
      
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

      <View style={{height: '40%'}}>
        {emotions.length > 0 && csvHeaders.length > 0 ?
          <NewScreen csvData={emotions[0]} header={csvHeaders}/>
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
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateContainer: {
    borderWidth: 2,
    borderColor: '#A9C3D0',
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
    height: 200,
    backgroundColor: '#A9C3D0',
    borderRadius: 10,
    marginBottom: 20,
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