export const getUserInfo = (userInfo) => {
    return {
        type: 'GET_USER_INFO',
        userInfo,
    }
};

export const getUserToken = (token) => {
    return {
        type: 'GET_USER_TOKEN',
        token,
    }
};