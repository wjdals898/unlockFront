
export const addResult = (result) => {
    return {
        type: 'ADD_RESULT',
        result,
    }
};

export const fetchResults = (resultList) => {
    return {
        type: 'FETCH_RESULTS',
        resultList,
    }
};

export const fetchEmotion = (emotion) => {
    return {
        type: 'FETCH_EMOTION',
        emotion,
    }
};