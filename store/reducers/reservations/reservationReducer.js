const initialState = {
    timeOptions: [
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
    ],
    //reservationList: {}, // 예약 리스트 초기화
};

const reservationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_RESERVATION':
            return {
                ...state,
                reservationList: [...state.reservationList, action.reservation],
            };
        case 'FETCH_RESERVATIONS':
            return {
                ...state,
                reservationList: action.reservationList,
            };
        case 'FETCH_TIME_OPTIONS':
            return {
                ...state,
                timeOptions: action.timeOptions,
            };
        default:
            return state;
    }
};

export default reservationReducer;