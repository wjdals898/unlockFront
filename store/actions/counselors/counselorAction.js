
export const addCounselor = (counselor) => {
    return {
        type: 'ADD_COUNSELOR',
        counselor,
    }
};

export const fetchCounselors = (counselorList) => {
    return {
        type: 'FETCH_COUNSELORS',
        counselorList,
    }
};