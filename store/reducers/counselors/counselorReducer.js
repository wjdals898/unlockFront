const initialState = {
    counselorList: [], // 상담사 리스트 초기화
};

const counselorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_COUNSELOR':
            return {
                ...state,
                counselorList: [...state.counselorList, action.counselor],
            };
        case 'FETCH_COUNSELORS':
            return {
                ...state,
                counselorList: action.counselorList,
            };
        default:
            return state;
    }
};

export default counselorReducer;