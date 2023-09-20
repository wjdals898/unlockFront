const initialState = {
    counseleeList: [], // 내담자 리스트 초기화
};

const counseleeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_COUNSELEE':
            return {
                ...state,
                counseleeList: [...state.counseleeList, action.counselee],
            };
        case 'FETCH_COUNSELEES':
            return {
                ...state,
                counseleeList: action.counseleeList,
            };
        default:
            return state;
    }
};

export default counseleeReducer;