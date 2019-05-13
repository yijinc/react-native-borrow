import {
    FETCH_USER_INFO,
    RECEIVE_USER_INFO,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    USER_INFO_UPDATING,
    USER_INFO_UPDATE_FAILED,
    UPDATE_BASIC_INFO_SUCCESS,
    UPDATE_COMPANY_INFO_SUCCESS,
    UPDATE_BANKCARD_INFO_SUCCESS,
} from '../constants';

const initialState = {
    accountCardDto: {
        complete: false,
    },
    basicInfoDto: {
        complete: false,
    },
    companyDto: {
        complete: false,
    },
    photoComplete: false,
    isFetching: false,
    userInfoUpdating: '', //用户信息正在更新 
};


export const userInfo = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_INFO: return {
            ...state,
            isFetching: true,
        };
        case RECEIVE_USER_INFO:
            return {
                ...state,
                ...action.userInfo,
                isFetching: false
            }
        case LOGOUT_SUCCESS: 
            return initialState;
        case USER_INFO_UPDATING:
            return {
                ...state,
                userInfoUpdating: action.updateType
            };
        case USER_INFO_UPDATE_FAILED: return {
            ...state,
            userInfoUpdating: ''
        }
        case UPDATE_BASIC_INFO_SUCCESS:
            action.basicInfo.complete = true;
            return {
                ...state,
                basicInfoDto: action.basicInfo,
                userInfoUpdating: ''
            };
        case UPDATE_COMPANY_INFO_SUCCESS:
            action.companyInfo.complete = true;
            return {
                ...state,
                companyDto: action.companyInfo,
                userInfoUpdating: ''
            };
        case UPDATE_BANKCARD_INFO_SUCCESS:
            action.bankCardInfo.complete = true;
            return {
                ...state,
                accountCardDto: action.bankCardInfo,
                userInfoUpdating: ''
            };
        default:
            return state;
    }
};



const accountState = {
    accessToken: "",
    uid: 0,
    accessTokenExpiredTime: null,
    account: "",
    accountType: "phone",
    hasPassword: true,
    loginTime: "2018-11-20",
    name: "",
    regTime: "",
    sex: 0,
}



export const accountInfo = (state = accountState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                ...action.user
            };
        default:
            return state;
    }
};
