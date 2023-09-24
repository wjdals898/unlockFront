import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  TextInput,
  Button,
  Modal,
  BackHandler,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Swipeable from "react-native-swipeable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BACKEND } from "@env";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchResults } from "../store/actions/results/resultAction";

const Stack = createNativeStackNavigator();

const PersonList = ({ navigation }) => {
  const counseleeList = useSelector(state => state.counseleeReducer.counseleeList)
  const [listItems, setListItems] = useState(counseleeList);
  const [inputKey, setInputKey] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

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
    console.log("내담자 리스트 업데이트!");
    console.log(listItems);
    setListItems(counseleeList);
  }, [counseleeList]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Name: {item.name}</Text>
      <Text>Gender: {item.gender}</Text>
      <Text>Year: {item.year}</Text>
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
      "Confirmation",
      "Are you sure you want to delete this person?",
      [
        {
          text: "No",
          style: "cancel",
          onPress: () => {
            // 삭제 버튼 닫기
            const swipeRef = swipeableRefs[index];
            if (swipeRef) {
              swipeRef.recenter();
            }
          },
        },
        {
          text: "OK",
          onPress: () => deletePerson(index),
        },
      ],
      { cancelable: true, onDismiss: () => onDismissDeleteConfirmation(index) }
    );
  };

  const deletePerson = (index) => {
    const updatedList = [...listItems];
    updatedList.splice(index, 1);
    setListItems(updatedList);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setListItems({ date: null, name: "", time: "" });
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

  const showPersonDetails = (item) => {
    console.log("person : ", item);
    console.log("id : ", item.id);
    // PersonList에서 선택된 아이템 정보를 넘겨줍니다.
    navigation.navigate("CameraStack", {personId: item.id, personName: item.name});
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

    return (
      <Swipeable {...swipeableProps}>
        <TouchableOpacity onPress={() => showPersonDetails(item)}>
          <View style={styles.personItem}>
            {/* 리스트 아이템 내용 */}
            <Text>Name: {item.name}</Text>
            {/* <Text>Age: {item.age}</Text> */}
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
        {/* Modal 컴포넌트 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
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
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleModalClose}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 8,
  },
  modalButtonText: {
    color: "#A9C3D0",
    fontWeight: "bold",
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
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  personItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#E9EFFA",
    borderRadius: 10,
  },
  deleteButton: {
    flex: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#A9C3D0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
  },
});

export default PersonList;
