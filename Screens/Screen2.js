
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Alert, Modal, TextInput, BackHandler } from 'react-native';
import { NavigationContainer, useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native'; // 네비게이션 컨테이너와 useNavigation 추가
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Swipeable } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BACKEND} from '@env';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults, fetchEmotion } from '../store/actions/results/resultAction';

const Stack = createNativeStackNavigator();

const PersonList = () => {
    const navigation = useNavigation();
    const counseleeList = useSelector(state => state.counseleeReducer.counseleeList);
    const dispatch = useDispatch();
    console.log(counseleeList);

    const [listItems, setListItems] = useState(counseleeList);
    const [inputKey, setInputKey] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

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

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await fetchResultsFromBackend();
            console.log(fetchedData);
            dispatch(fetchResults(fetchedData));
        }

        fetchData();
    },[]);

    useEffect(() => {
        console.log("내담자 리스트 업데이트!");
        console.log(listItems);
        setListItems(counseleeList);
    }, [counseleeList]);

    async function fetchResultsFromBackend() {
        try {
            const access = await AsyncStorage.getItem("access");
            console.log(access);
            const response = await axios.get(BACKEND+':8000/result/', /*BACKEND+':8000/result/' BACKEND+`:8000/result/`*/
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access}`
                }
            });
            console.log(response.status);
            console.log(response.data);
    
            return response.data;
        } catch (error) {
            console.log('Error1:', error);
            // 오류 처리
            return null;
        }
    };

    // async function fetchCSVFile() {
    //     try{
    //         const response = await axios.get(BACKEND+`:8000/csv_file/`/*BACKEND+':8000/csv_file/'*/);
    //         console.log("csv 파일 다운로드 성공", response.data);
    //         return response.data;
    //     } catch (err) {
    //         console.log("csv 파일 다운로드 실패", err);
    //         retrun;
    //     }
    // };

    const fetchPersonDataByEmail = async (email) => {
        try {
            console.log(email);
            const access = await AsyncStorage.getItem("access");
            const response = await axios.post(BACKEND+':8000/counselee/', /*BACKEND+':8000/counselee/' BACKEND+`:8000/counselee/`*/
            { email: email },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access}`
                }
            }
            );
            console.log('1 ', response.status);
            console.log('2 ', response.data);
    
            return response.data;
        } catch (error) {
            console.log('Error1:', error);
            // 오류 처리
            return null;
        }
    };
    
    const addPerson = async () => {
        const personData = await fetchPersonDataByEmail(inputKey);
    
        if (personData) {
            // 가져온 정보를 바탕으로 리스트 아이템을 생성합니다.
            const newItem = {
                email: personData.email,
                name: personData.name,
                // age: personData.age,
                gender: personData.gender,
                birth: personData.date,
            };
    
            setListItems((prevList) => [...prevList, newItem]);
            setInputKey('');
            setModalVisible(false);
        } else {
            Alert.alert('Error', 'Person data not found');
        }
    };
    
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text>Name: {item.name}</Text>
            <Text>Gender: {item.gender}</Text>
            <Text>Birth: {item.birth}</Text>
        </View>
    );    
    const openModal = () => {
        setModalVisible(true);
    };
        
    const closeModal = () => {
        setModalVisible(false);
    };
    const confirmDeletePerson = (index) => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to delete this person?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                    onPress: () => {
                        // 삭제 버튼 닫기
                        const swipeRef = swipeableRefs[index];
                        if (swipeRef) {
                        swipeRef.recenter();
                        }
                    },
                },
                {
                    text: 'OK',
                    onPress: () => deletePerson(index),
                },
            ],
            { cancelable: true, onDismiss: () => onDismissDeleteConfirmation(index) }
        );
    };
    
    const deletePerson = async (index) => {
        const updatedList = [...listItems];
        updatedList.splice(index, 1);
        setListItems(updatedList);
    };
    const handleModalClose = () => {
        setModalVisible(false);
        // setListItems({ date: null, name: '', time: '' });
    };
    

    const onDismissDeleteConfirmation = (index) => {
        // 삭제 확인 대화 상자가 닫힐 때 호출되는 콜백 함수
        const swipeRef = swipeableRefs[index];
        if (swipeRef) {
            swipeRef.recenter();
        }
    };
    const onSwipeableWillOpen = (index) => {
        setOpenedIndex(index);
    };  
    const onSwipeableWillClose = () => {
        setOpenedIndex(null);
    };
    const swipeableRefs = {};

    const renderPersonItem = ({ item, index }) => {
        console.log('personItem : ', item);
        const rightButtons = [
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDeletePerson(index)}
                key={`delete_${index}`}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        ];
        const swipeableProps = {
            rightButtons,
            rightButtonWidth: 100,
            onSwipeableWillOpen: () => onSwipeableWillOpen(index),
            onSwipeableWillClose: onSwipeableWillClose,
            useNativeDriver: false,
        };

        const showPersonDetails = () => {
            // PersonList에서 선택된 아이템 정보를 넘겨줍니다.
            navigation.navigate('result', { screen: "result", person: item }); // Result 스크린으로 전환
        };

        return (
            <Swipeable {...swipeableProps}>
                <TouchableOpacity onPress={showPersonDetails}>
                    <View style={styles.personItem}>
                        {/* 리스트 아이템 내용 */}
                        <Text>Name: {item.name}</Text>
                        <Text>Email: {item.email}</Text>
                        <Text>Gender: {item.gender}</Text>
                        <Text>Birth: {item.birth}</Text>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    };

    return (
        <SafeAreaView style={styles.container}> 
            <View style={styles.container}>
                <View style={styles.item}>
                    <Text style={styles.title}>Client List</Text>
                </View>
                <FlatList
                    data={listItems}
                    renderItem={renderPersonItem}
                    keyExtractor={(item, index) => index.toString()}
                />

                {/* 추가 버튼 */}
                <TouchableOpacity style={styles.addButton} onPress={openModal}>
                    {/* 버튼 내용 */}
                    <Text style={styles.addButtonLabel}>+</Text>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <TextInput
                                style={styles.input}
                                placeholder="Enter key"
                                value={inputKey}
                                onChangeText={setInputKey}
                                />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={styles.modalButton} onPress={addPerson}>
                                        <Text style={styles.modalButtonText}>Add</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const renderPersonItem = ({ item, index }) => {
    const rightButtons = [
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDeletePerson(index)}
        key={`delete_${index}`}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>,
    ];
    const swipeableProps = {
      rightButtons,
      rightButtonWidth: 100,
      onSwipeableWillOpen: () => onSwipeableWillOpen(index),
      onSwipeableWillClose: onSwipeableWillClose,
      useNativeDriver: false,
    };
  
    const showPersonDetails = () => {
      // PersonList에서 선택된 아이템 정보를 넘겨줍니다.
      navigation.navigate('result', { person: item });
    };
  
    return (
      <Swipeable {...swipeableProps}>
        <TouchableOpacity onPress={showPersonDetails}>
          <View style={styles.personItem}>
            {/* 리스트 아이템 내용 */}
            <Text>Name: {item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Gender: {item.gender}</Text>
            {/* <Text>Date: {item.date}</Text> */}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    modalButton: {
        marginLeft: 8,
    },
    modalButtonText: {
        color: '#A9C3D0',
        fontWeight: 'bold',
    },
    IDinput: {
        flex: 1,
        marginRight: 10,
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    container: {
        flex: 1,
        padding: 10,
        paddingBottom: 50, // 버튼 높이만큼 아래 여백 추가
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
        textAlign:"center",
        justifyContent: "center",
        paddingTop: 20
    },
    personItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#E9EFFA',
        borderRadius: 10,
    },
    deleteButton: {
        flex:1,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#A9C3D0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'left',
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
        elevation: 2, // 그림자 효과
    },
    addButtonLabel: {
        fontSize: 40,
        color: 'white',
        textAlign: "center",
        justifyContent: 'center',
    },
});

export default PersonList;
