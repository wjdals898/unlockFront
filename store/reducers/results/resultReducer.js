const initialState = {
    resultList: {},
    emotion: {},
};

const resultReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_RESULT':
            return {
                ...state,
                resultList: [...state.resultList, action.result],
            };
        case 'FETCH_RESULTS':
            return {
                ...state,
                resultList: action.resultList,
            };
        case 'FETCH_EMOTION':
            return {
                ...state,
                emotion: action.emotion,
            }
        default:
            return state;
    }
};

export default resultReducer;