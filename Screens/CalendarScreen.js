import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, FlatList, Alert, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { Swipeable } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import { format } from "date-fns";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addReservation } from '../store/actions/reservations/reservationAction';
import { BACKEND } from '@env';

const CalendarScreen = ({route, navigation}) => {
  const [userName, setUserName] = useState(null);
  const counselorId = route.params?.counselorId;
  const counselorName = route.params?.counselorName;
  const topicId = route.params?.topicId;
  const topicName = route.params?.topicName;
  const reservationList = useSelector(state => state.reservationReducer.reservationList);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [diaryData, setDiaryData] = useState({ date: null, counselor: '', time: ''});
  const [selectedTime, setSelectedTime] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [combinedMarkedDates, setCombinedMarkedDates] = useState()
  const dispatch = useDispatch();

  const timeOptions = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00'
]

  useEffect(() => {
    //const filteredList = reservationList.filter((reservation) => reservation.counselor_id === counselorId);
    const markedLists = reservationList.reduce((acc, current) => {
      const formattedDate = format(new Date(current.date), 'yyyy-MM-dd');
      // acc[formattedDate] = {id: current.id, counselor: current.counselor_name, time: current.time, type: current.type, marked: true};
      if (!acc[formattedDate]) {
        // 해당 날짜 키가 아직 배열을 가지고 있지 않으면 배열을 생성
        acc[formattedDate] = [];
      }
      acc[formattedDate].push({
        id: current.id,
        counselor: current.counselor_name,
        time: current.time,
        type: current.type,
      });

      acc['markedDates'] = {
        ...acc['markedDates'],
        [formattedDate]: {
          marked: true,
        },
      };
      return acc;
    }, {});
    console.log('markedLists 출력 : ', markedLists);
    setMarkedDates(markedLists);

    const getUser = async () => {
      await AsyncStorage.getItem('name', (err, result) => {
        user = result;
      });
      setUserName(user);
    };
    
    getUser();
  }, [reservationList]);

  useEffect(() => {
    console.log(`${selectedDate}의 데이터!`);
    console.log(events[selectedDate]);
  }, [events]);

  const handleDayPress = (day) => {
    const date = day.dateString;

    const updatedMarkedDates = { ...markedDates };

    // 이전에 선택한 날짜 지우기
    //if (selectedDate && updatedMarkedDates[selectedDate]) {
      // Object.keys(updatedMarkedDates).reduce((acc, key) => {
      //   if (key === selectedDate) {
      //     acc[key] = selectedEvents;
      //   }

      //}, {});

      // updatedMarkedDates[selectedDate] = {
      //   ...(updatedMarkedDates[selectedDate] || {}),
      //   selected: false,
      // };
      //console.log('updatedMarkedDates = ', updatedMarkedDates);
    //}

    // updatedMarkedDates[date] = {
    //   ...(updatedMarkedDates[date] || {}), // 기존 데이터를 복사하고 없으면 빈 객체 생성
    //   selected: true,
    // };
    //Object.keys(updatedMarkedDates).reduce((acc, key))
    updatedMarkedDates['selectedDate'] = {
      [date]: {selected: true}
    };

    let selectedEvents = [];

    if (markedDates[date]) {
      // const selectedEvents = {
      //   [date]: markedDates[date]
      // };
      Object.keys(markedDates).reduce((acc, key) => {
        if (key === date) {
          selectedEvents = markedDates[key];
        }
      });

      console.log('markedDates', markedDates);
      console.log('selectedEvents', selectedEvents);
      setEvents(selectedEvents);
    }
    else {
      setEvents([]);
    }

    // const selectedEvents = {
    //   [date]: markedDates[date]
    // };
    
    

    // 기존 markedDates 상태에 현재 선택한 날짜를 업데이트
    setMarkedDates(updatedMarkedDates);

    // const selectedMarkedDates = {
    //   ...markedDates,
    //   [date]: {
    //     selected: true,
    //     marked: markedDates[date]?.marked,
    //   }
    // };
    setSelectedDate(date);
    console.log(events);
    //setMarkedDates(selectedMarkedDates);
  };



  //setMarkedDates(markedLists)

  // const markedDates = {};

  // Object.keys(events).forEach((date) => {
  //   if (events[date].length > 0) {
  //     markedDates[date] = { marked: true }; // 해당 날짜에 일정이 있는 경우만 표시
  //   }
  // });

  // setMarkedDates(selectedMarkedDates);

  const renderSwipeableItem = ({ item }) => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    console.log('selectedDate > formattedDate = ', selectedDate < formattedDate);

    console.log('time : ', item.time);
    if (events) {
    const handleDeleteEvent = () => {
      Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedEvents = [ ...events ];
            //const eventDate = events[selectedDate];
            const filteredEvents = updatedEvents.filter((event) => event.id !== item.id);
            //updatedEvents = filteredEvents;
            setEvents(filteredEvents);
          },
        },
      ]);
    };

    const rightSwipeActions = () => (
      <TouchableOpacity onPress={handleDeleteEvent} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
    console.log('아이템 출력 ',item);

    return (
      <Swipeable renderRightActions={selectedDate < formattedDate ? rightSwipeActions : null}>
        {console.log('아이템 정보 ',item)}
        <View style={styles.agendaItem}>
          <Text>{item.counselor} 상담사</Text>
          <Text>{item.time}</Text>
        </View>
      </Swipeable>
    );
    }
    else {
      console.log('시간!!!', item);
      return (
        <Text style={styles.noEventsText}>예약이 없습니다.</Text>
      )
      
    }
  };

  const handleAddEvent = () => {
    setModalVisible(true);
    console.log('이벤트 객체 출력!!', events);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedTime(null);
    setDiaryData({ time: '' });
  };

  const handleSaveEvent = async () => {
    console.log(diaryData.date);
    console.log(diaryData.time);
    if (diaryData.date && diaryData.time) {
      const updatedEvents = [ ...events ];
      console.log("updatedEvents 출력 : ", updatedEvents);
      
      await AsyncStorage.getItem('access', (err, result) => {
        token = result
      });
      try {
        console.log("백엔드에 예약 정보 보내기 전");

        const response = await axios.post(BACKEND+':8000/reservation/', { //BACKEND+':8000/reservation/' BACKEND+`:8000/reservation/` `${BACKEND}:8000/reservation/`
          data: {
            type: topicId,
            counselor_id: counselorId,
            date: diaryData.date,
            time: diaryData.time,
          }},
          {
          headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }}
          );
          console.log("예약 추가 ", response.data);
        dispatch(addReservation(response.data));

        // const newEvent = { date: diaryData.date, id: response.data.id, counselor:diaryData.counselor, hour: diaryData.time};
        // if (eventsArray) {
        //   console.log("이벤트 저장전");
        //   eventsArray.push(newEvent);
        //   console.log(updatedEvents);
        // } else {
        //   updatedEvents[diaryData.date] = [newEvent];
        // }
      }
      catch (err) {
        Alert.alert(`${diaryData.date} ${diaryData.time} 시간에 예약이 불가능합니다.`);
        return;
      }
      
      //setEvents(updatedEvents);
      console.log('146line');
      // const updatedMarkedDates = {
      //   ...markedDates,
      //   [diaryData.date]: {
      //     id: diaryData.id,
      //     counselor:diaryData.counselor, 
      //     hour: diaryData.time,
      //     selected: true,
      //     marked: true,
      //   },
      // };
      console.log('156line');
      //setMarkedDates(updatedMarkedDates);
      handleModalClose();
    } else {
      Alert.alert('Missing Information', 'Please enter all required information.');
    }
  };

  const openDatePicker = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open();
      if (action !== DatePickerAndroid.dismissedAction) {
        const selectedDate = `${year}-${month + 1}-${day < 10 ? '0' + day : day}`;
        setSelectedDate(selectedDate);
      }
    } catch (error) {
      console.log('Error selecting date:', error);
    }
  };

  const alertSelect = () => {
    Alert.alert('날짜를 선택하세요!');
  };

  const handleTimeSelect = (itemValue) => {
    console.log(itemValue);
    setSelectedTime(itemValue);
    setDiaryData({ ...diaryData, date: selectedDate, counselor: counselorName, time: itemValue });
  };

  useEffect(() => {
    const combinedMarkedDates = {
      ...markedDates['markedDates'],
      ...markedDates['selectedDate'],
    };
    setCombinedMarkedDates(combinedMarkedDates);
    console.log('combinedMarkedDates = ', combinedMarkedDates);
  }, [markedDates])

  useEffect(() => {
    console.log("combinedMarkedDates 업데이트");
  }, [combinedMarkedDates]);

  return (
    <SafeAreaView style={styles.calendar}>
      {/* <View style={styles.datePickerContainer}>
        <Text style={styles.datePickerLabel}>Select Date:</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={openDatePicker}>
          <Text style={styles.datePickerButtonText}>{selectedDate ? selectedDate : 'Select'}</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={combinedMarkedDates}
          hideExtraDays={true}
          hideDayNames={true}
          firstDay={1}
          enableSwipeMonths={true}
          theme={{
            selectedDayBackgroundColor: 'black',
            arrowColor: '#E9B0B1',
            dotColor: '#4296FF',
            todayTextColor: 'red',
            calendarBackground: '#F8F8F8',
          }}
        />
      </View>
      <View style={styles.agendaContainer}>
        <Text style={styles.agendaLabel}>{selectedDate} 예약 현황</Text>
        {events.length > 0 ? (
          <FlatList
            data={events}
            renderItem={renderSwipeableItem}
            //keyExtractor={(item) => item.id.toString()}
            horizontal={false}
          />
        ) : (
          null // <Text style={styles.noEventsText}>예약이 없습니다.</Text>
        )}
      </View>
      <TouchableOpacity style={styles.addButton} onPress={selectedDate? handleAddEvent : alertSelect}>
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Add Event Modal */}
      <Modal visible={modalVisible} transparent={true} onRequestClose={handleModalClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedDate} 예약</Text>
              <View>
                <Text>상담사 : {counselorName}</Text>
                <Text>상담 유형 : {topicName}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.modalUser}>이름 : {userName}</Text>
              <View>
              <Text style={styles.modalUser}>시간 : </Text>
                <Picker
                  selectedValue={selectedTime}
                  onValueChange={handleTimeSelect}
                  mode="dropdown" // Android only
                >
                  
                  <Picker.Item label="시간을 선택하세요." value={null} key={-1}/>
                  {timeOptions.map((time, index) => (
                    <Picker.Item key={index} label={time} value={time} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveEvent}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  calendarContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  calendar: {
    flex: 1,
    backgroundColor: 'white',
  },
  agendaContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    // borderWidth: 1, // 테두리 두께
    // borderColor: '#6E7FB8', // 테두리 색상
    // borderStyle: 'solid', // 테두리 스타일 (solid, dashed, dotted 등)
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  agendaLabel: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#FFDD79',
    borderRadius: 20,
    width: '70%',
    alignSelf: 'center',
    paddingTop: 2,
    paddingBottom: 2,
    
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noEventsText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  agendaItem: {
    alignItems: 'center',
    //paddingLeft: 20,
    paddingVertical: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: '#95C3ED',
    borderWidth: 1,
    borderColor: '#95C3ED',
    // backgroundColor: '#E9EFFA',
    borderRadius: 10,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalHeader: {
    backgroundColor: '#E1E7EF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 10,
    marginBottom: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#A9C3D0',
    borderRadius: 50,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalUser: {
    fontSize: 17,
    marginBottom: 10,
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
});

export default CalendarScreen;

