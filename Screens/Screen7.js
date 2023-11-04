import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, BackHandler } from 'react-native';
import { useIsFocused, useFocusEffect, useNavigation } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BACKEND } from '@env';
import { useSelector } from 'react-redux';
//import RNFS from 'react-native-fs';

const ClientDiaryList = ({ route, navigation }) => {
    const resultList = useSelector(state => state.resultReducer.resultList);
    const userInfo = useSelector(state => state.userReducer.userInfo);
    console.log('userInfo', userInfo);
    const personId = route.params.personId || userInfo;
    const personName = route.params.personName || userInfo;
    const [currentItems, setCurrentItems] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    
    //const prevCurrentItems = usePrevious(currentItems); // 이전 currentItems 저장

    useEffect(() => {
        // 화면이 마운트되었을 때, 백엔드에서 회원 리스트를 가져와서 상태에 저장
        // if (userInfo.type === 'counselee') { // 내담자 계정일 경우
        //     fetchResultsFromBackend()
        //     .then((response) => {
        //         response.map((data) => {
        //             const item = {
        //                 id: data.id,
        //                 counselee: data.counselee,
        //                 date: data.date,
        //                 video: data.video
        //             };
        //             setCurrentItems((prevList) => [...prevList, item]);
        //         })
        //     })
        //     .catch((error) => console.error('Error2 setting results:', error));
        // }
        if (userInfo.type === 'counselor') {
            const filterList = resultList.filter((result) => result.counselee === personId);
            console.log(personName+'결과 리스트 : ', filterList);
            filterList.map((data) => {
                            const item = {
                                id: data.id,
                                counselee: data.counselee,
                                date: data.date,
                                video: data.video
                            };
                            setCurrentItems((prevList) => [...prevList, item]);
                        });
            //setFilteredList(filteredList);
        }
        else {
            resultList.map((data) => {
                const item = {
                    id: data.id,
                    counselee: data.counselee,
                    date: data.date,
                    video: data.video
                };
                setCurrentItems((prevList) => [...prevList, item]);
            });
        }
    }, []);

    useEffect(() => {
        // if (listItems) {
        //     setCurrentItems(listItems);
        // }
        console.log("결과 리스트 업데이트");
    }, [currentItems]);

    useEffect(() => {
        console.log('resultList Update');

        if (userInfo.type === 'counselor') {
            const filterList = resultList.filter((result) => result.counselee === personId);
            console.log(personName+'결과 리스트 : ', filterList);
            filterList.map((data) => {
                const item = {
                    id: data.id,
                    counselee: data.counselee,
                    date: data.date,
                    video: data.video
                };
                setCurrentItems((prevList) => [...prevList, item]);
            });
            //setFilteredList(filteredList);
        }
        else {
            resultList.map((data) => {
                const item = {
                    id: data.id,
                    counselee: data.counselee,
                    date: data.date,
                    video: data.video
                };
                setCurrentItems((prevList) => [...prevList, item]);
            });
        }
    }, [resultList]);

    async function fetchResultsFromBackend() {
        console.log("counselee_id : ", personId);
        try {
            const access = await AsyncStorage.getItem("access");
            console.log("결과 가져오기", access);
            const response = await axios.get(BACKEND+':8000/result/'/*BACKEND+':8000/result/' BACKEND+`:8000/result/`*/,
            {
                params: {id: personId},
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access}`
                }
            });
            const data = response.data;
            console.log(data);
            return data; // 서버로부터 가져온 회원 리스트 데이터
        } catch (error) {
            console.error('Error1 fetching results:', error);
            return [];
        }
    };

    const addDiary = () => {
        Alert.alert(
        userInfo.type === 'counselor' ? '상담영상 추가' : '다이어리 작성',
        userInfo.type === 'counselor' ? '상담영상을 추가하시겠습니까?' : '다이어리 작성을 시작하시겠습니까?',
        [
            {
            text: '네',
            onPress: () => navigation.navigate("UploadScreen", {personId: personId, listItems: currentItems}),
            },
            {
            text: '아니오',
            style: 'cancel',
            },
        ],
        { cancelable: true }
        );
    };

    const deleteDiary = (index) => {
        const updatedList = [...currentItems];
        updatedList.splice(index, 1);
        setCurrentItems(updatedList);
    };

    const renderDiaryItem = ({ item, index }) => {
        const date = new Date(item.date);

        // 날짜만 추출하여 문자열로 변환
        const formattedDate = date.toISOString().split('T')[0];
        return (
        <View style={styles.personItem}>
            <Text>[{index+1}] 날짜 : {formattedDate}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteDiary(index)}>
            <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
        </View>
        );
    };

    return (
        
        <View style={styles.container}>
            <View style={styles.item}>
            <Text style={styles.title}>{personName}님의 상담기록</Text>
            </View>
            <FlatList data={currentItems} renderItem={renderDiaryItem} keyExtractor={(item, index) => index.toString()} />
            <TouchableOpacity style={styles.addButton} onPress={addDiary}>
            <Text style={styles.addButtonLabel}>+</Text>
            </TouchableOpacity>
        </View>

    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingBottom: 85, // 버튼 높이만큼 아래 여백 추가
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        
        textAlign:"center",
        justifyContent: "center",
    },
    personItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 4,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#A9C3D0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonLabel: {
        fontSize: 24,
        color: 'white',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    stopButton: {
        backgroundColor: 'red',
        padding: 16,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 16,
    },
    stopButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ClientDiaryList;