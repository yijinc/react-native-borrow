import axios from 'axios';
import { AsyncStorage, ToastAndroid } from 'react-native';
import { baseURL, getCurrentTime } from '../../config';
import NavigationService from '../../utils/NavigationService';
import configAppend from './commonality';
import signature from './signature';


axios.defaults.baseURL = baseURL;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const TOKEN = {
    accessToken: '',
    userId: 0,
    accessTokenExpiredTime: 0
}


export const setToken = (token={}, persist=false) => {

    TOKEN.accessToken = token.accessToken;
    TOKEN.accessTokenExpiredTime = token.accessTokenExpiredTime;
    token.userId && (TOKEN.userId = token.userId);

    axios.defaults.headers.common['Authorization'] = TOKEN.accessToken;
    axios.defaults.headers.common['userId'] = TOKEN.userId;

    if (persist) {
        AsyncStorage.setItem('token', JSON.stringify(TOKEN));
    }
}

export const clearToken = () => {
    axios.defaults.headers.common['Authorization'] = '';
    AsyncStorage.removeItem('token');
    NavigationService.navigate('AccountStart')
}

const CancelToken = axios.CancelToken;
let cancel;
export const refreshToken = async () => {
    try {
        const { accessToken, accessTokenExpiredTime, currentTimeStamp } = await axios.post('/uc/token/refreshToken', {}, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c; // An executor function receives a cancel function as a parameter
            })
        });
        setToken({
            accessToken: 'encrypt '+accessToken,
            accessTokenExpiredTime
        }, true)
        global.appStartTime = currentTimeStamp;
        global.appExperience = 0;
        return accessToken
    }catch(error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled', error);
        } else {
            console.log('refreshToken failed', error);
        }
        return null;
    }
}

let isTokenFetching = false;

// Add a request interceptor
axios.interceptors.request.use( async config => {
    // Do something before request is sent
    // 没有 token default
    if (!axios.defaults.headers.common['Authorization']) {
        return configAppend(signature(config));
    }

    if (isTokenFetching && config.url.includes('token/refreshToken')) {
        cancel && cancel();  // 重复调用 refreshToken
        cancel = null;
    }

    // 过期
    if ( getCurrentTime() >= TOKEN.accessTokenExpiredTime && !isTokenFetching ) {
        isTokenFetching = true;
        const accessToken = await refreshToken();
        if (accessToken!==null) {
            config.headers.Authorization = TOKEN.accessToken;
        }
        isTokenFetching = false;
    }
    return configAppend(signature(config));
    
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    if (response.status === 200) {
        return response.data;
    }
    return response;
}, function (error) {
    // Do something with response error
    console.warn(JSON.parse(JSON.stringify(error)))
    if (error.response.status !== 400 && error.response.status !== 401 && global.ENV !== 'production') {
        // 后端报错 弹出错误 在开发和测试环境
        ToastAndroid.showWithGravity(
            `${error.response.data.errors[0].code}: ${error.response.data.errors[0].message}`,
            ToastAndroid.LONG,
            ToastAndroid.TOP
        );
    }
    if (error.response.status === 401) {
        clearToken()
    }
    return Promise.reject(error.response.data.errors[0]);
});

export default axios;
