const initialState = {
    userInfo: {},
    access: '',
    refresh: '',
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_USER_INFO':
            return {
                ...state,
                userInfo: action.userInfo,
            };
        case 'GET_USER_TOKEN':
            return {
                ...state,
                access: action.token.access,
                refresh: action.token.refresh,
            }
        default:
            return state;
    }
};

export default userReducer;