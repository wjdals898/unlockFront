
export const addCounselee = (counselee) => {
    return {
        type: 'ADD_COUNSELEE',
        counselee,
    }
};

export const fetchCounselees = (counseleeList) => {
    return {
        type: 'FETCH_COUNSELEES',
        counseleeList,
    }
};