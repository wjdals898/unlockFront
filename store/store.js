import { createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk'; // Redux Thunk 미들웨어
import counselorReducer from './reducers/counselors/counselorReducer';
import reservationReducer from './reducers/reservations/reservationReducer';
import counseleeReducer from './reducers/counselees/counseleeReducer';
import resultReducer from './reducers/results/resultReducer';
import { addCounselor } from './actions/counselors/counselorAction';
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { BACKEND } from '@env';

//const middleware = [thunk];
// const combinedReducers = combineReducers({
//     root: rootReducer,
//     counselor: counselorReducer, // counselorReducer를 추가
// });

// const store = createStore(
//     combinedReducers, // 합친 리듀서를 사용
//     applyMiddleware(...middleware)
// );

// const store = createStore(
//     counselorReducer
// );
const rootReducer = combineReducers({
    counseleeReducer,
    counselorReducer,
    resultReducer,
    reservationReducer,
});

const store = configureStore({reducer: rootReducer});

const socket = new WebSocket(BACKEND+':8000/counselor/'); // 실제 웹 소켓 URL로 대체

// 웹 소켓 메시지 수신 시 처리
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'NEW_COUNSELOR') {
        // 새로운 상담사 정보를 Redux 스토어에 추가하는 액션 디스패치
        dispatch(addCounselor(data.counselor));
    }
};


export default store;
