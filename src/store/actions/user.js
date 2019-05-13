import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,

    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,

    REQUEST_USER_INFO,
    FETCH_USER_INFO,
    RECEIVE_USER_INFO,

    USER_INFO_UPDATING, 
    USER_INFO_UPDATE_FAILED,

    UPDATE_BASIC_INFO_REQUEST,
    UPDATE_BASIC_INFO_SUCCESS,

    UPDATE_COMPANY_INFO_REQUEST,
    UPDATE_COMPANY_INFO_SUCCESS,

    UPDATE_BANKCARD_INFO_REQUEST,
    UPDATE_BANKCARD_INFO_SUCCESS,

} from '../constants';

/**
 * 登录请求
 * @param  {string} phone      手机号
 * @param  {string} password   密码
 * @param  {function} resolve  回调
 */
export function loginRequest(phone, password, resolve) {
    return { type: LOGIN_REQUEST, phone, password, resolve};
}
export function loginSuccess(user) {
    return { type: LOGIN_SUCCESS, user };
}
export function loginFailure() {
    return { type: LOGIN_FAILURE };
}

/**
 * 注销用户
 */
export function logoutRequest() {
    return {
        type: LOGOUT_REQUEST
    };
}
export function logoutSuccess() {
    return {
        type: LOGOUT_SUCCESS
    };
}
export function logoutFailure() {
    return {
        type: LOGOUT_FAILURE
    };
}

/*
* 请求用户信息
* */
export function requestUserInfo(resolve) {
    return {
        type: REQUEST_USER_INFO,
        resolve
    };
}
export function fetchUserInfo() {
    return {
        type: FETCH_USER_INFO
    };
}

export function receiveUserInfo(userInfo) {
    return {
        type: RECEIVE_USER_INFO,
        userInfo
    };
}



/*
* 用户信息更新中。。。
* */
export function updating(updateType='basicInfo') {
    return {
        type: USER_INFO_UPDATING,
        updateType
    };
}
export function updateFailed() {
    return {
        type: USER_INFO_UPDATE_FAILED
    };
}


/*
* 更新用户基本信息
* */
export function updateBasicInfo(basicInfo, resolve=null) {
    return {
        type: UPDATE_BASIC_INFO_REQUEST,
        basicInfo,
        resolve
    };
}
export function updateBasicInfoSuccess(basicInfo) {
    return {
        type: UPDATE_BASIC_INFO_SUCCESS,
        basicInfo
    };
}


/*
* 更新用户公司/工作信息
* */
export function updateCompanyInfo(companyInfo, resolve=null) {
    return {
        type: UPDATE_COMPANY_INFO_REQUEST,
        companyInfo,
        resolve
    };
}
export function updateCompanyInfoSuccess(companyInfo) {
    return {
        type: UPDATE_COMPANY_INFO_SUCCESS,
        companyInfo
    };
}


/*
* 更新用户银行卡信息
* */
export function updateBankCardInfo(bankCardInfo, resolve=null) {
    return {
        type: UPDATE_BANKCARD_INFO_REQUEST,
        bankCardInfo,
        resolve
    };
}
export function updateBankCardInfoSuccess(bankCardInfo) {
    return {
        type: UPDATE_BANKCARD_INFO_SUCCESS,
        bankCardInfo
    };
}