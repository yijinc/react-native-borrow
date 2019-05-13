/*
* USER
* */

// login
export const LOGIN_REQUEST = 'LOGIN_REQUEST'; // 登录请求
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'; // 登录成功
export const LOGIN_FAILURE = 'LOGIN_FAILURE'; // 登录失败
// logout
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'; // 登出请求
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'; // 登出请求
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'; // 登出请求
// get userInfo
export const REQUEST_USER_INFO = 'REQUEST_USER_INFO';         //请求用户信息
export const FETCH_USER_INFO = 'FETCH_USER_INFO';     //获取用户信息
export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO'; //获取到用户信息



export const USER_INFO_UPDATING = 'USER_INFO_UPDATING';         // 用户信息更新中
export const USER_INFO_UPDATE_FAILED = 'USER_INFO_UPDATE_FAILED';         // 用户信息更新失败

export const UPDATE_BASIC_INFO_REQUEST = 'UPDATE_BASIC_INFO_REQUEST';         // 更改用户基本信息
export const UPDATE_BASIC_INFO_SUCCESS = 'UPDATE_BASIC_INFO_SUCCESS';         // 更改用户基本信息
export const UPDATE_BASIC_INFO_FAILURE = 'UPDATE_BASIC_INFO_FAILURE';         // 更改用户基本信息


export const UPDATE_COMPANY_INFO_REQUEST = 'UPDATE_COMPANY_INFO_REQUEST';         // 更改用户公司/工作信息
export const UPDATE_COMPANY_INFO_SUCCESS = 'UPDATE_COMPANY_INFO_SUCCESS';         // 更改用户公司/工作信息
export const UPDATE_COMPANY_INFO_FAILURE = 'UPDATE_COMPANY_INFO_FAILURE';         // 更改用户公司/工作信息


export const UPDATE_BANKCARD_INFO_REQUEST = 'UPDATE_BANKCARD_INFO_REQUEST';         // 更改用户银行卡信息
export const UPDATE_BANKCARD_INFO_SUCCESS = 'UPDATE_BANKCARD_INFO_SUCCESS';         // 更改用户银行卡信息
export const UPDATE_BANKCARD_INFO_FAILURE = 'UPDATE_BANKCARD_INFO_FAILURE';         // 更改用户银行卡信息



// get current loan
export const REQUEST_CURRENT_LOAN = 'REQUEST_CURRENT_LOAN';         // 请求用户当前租赁信息
export const FETCH_CURRENT_LOAN = 'FETCH_CURRENT_LOAN';             // 获取用户当前租赁信息
export const RECEIVE_CURRENT_LOAN = 'RECEIVE_CURRENT_LOAN';         // 获取到用户当前租赁信息



// get history loans
export const REQUEST_HISTORY_LOANS = 'REQUEST_HISTORY_LOANS';         // 请求用户历史租赁订单
export const FETCH_HISTORY_LOANS = 'FETCH_HISTORY_LOANS';             // 获取用户历史租赁订单
export const RECEIVE_HISTORY_LOANS = 'RECEIVE_HISTORY_LOANS';         // 获取到用历史租赁订单