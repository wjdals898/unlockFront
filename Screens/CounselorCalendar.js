import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, FlatList, Alert, BackHandler } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { Swipeable } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { format } from "date-fns";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addReservation } from '../store/actions/reservations/reservationAction';
import { BACKEND } from '@env';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

const CounselorCalendarScreen = () => {
    const userInfo = useSelector(state => state.userReducer.userInfo);
    const reservationList = useSelector(state => state.reservationReducer.reservationList);
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [diaryData, setDiaryData] = useState({ date: null, counselor: '', time: ''});
    const [markedDates, setMarkedDates] = useState({});
    const [combinedMarkedDates, setCombinedMarkedDates] = useState();
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
        //const filteredList = reservationList.filter((reservation) => reservation.counselor_id === counselorId);
        if (reservationList.length > 0) {
            const markedLists = reservationList.reduce((acc, current) => {
                const formattedDate = format(new Date(current.date), 'yyyy-MM-dd');
                // acc[formattedDate] = {id: current.id, counselor: current.counselor_name, time: current.time, type: current.type, marked: true};
                if (!acc[formattedDate]) {
                    // 해당 날짜 키가 아직 배열을 가지고 있지 않으면 배열을 생성
                    acc[formattedDate] = [];
                }
                acc[formattedDate].push({
                    id: current.id,
                    counselee: current.counselee_name,
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
        }
        
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
        console.log('updatedMarkedDates : ', updatedMarkedDates);

        let selectedEvents = [];

        if (markedDates[date]) {
        // const selectedEvents = {
        //   [date]: markedDates[date]
        // };
        Object.keys(markedDates).map((key, index) => {
            console.log('key = ', key)
            console.log('date = ', date);
            console.log('key === date : ', key==date);
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
            <Text>{item.counselee} 내담자</Text>
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

export default CounselorCalendarScreen;

