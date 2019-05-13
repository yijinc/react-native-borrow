import axios, { setToken } from './request/axios';


/**
 * 手机号是否注册/登录
 * @param {string} accountType
 * @param {string} account 
 */
export function tryLogin(account, accountType = 'phone') {
    return axios.post('/uc/account/tryLogin', {
        account,
        accountType
    });
}


/**
 * POST /user-center/api/v1/account/getRegisterSmsCode
 * 发送注册短信验证码
 * @param {string} accountType
 * @param {string} account 手机号
 */
export function sendSmsCode(account, accountType = 'phone') {
    return axios.post('/uc/account/getRegisterSmsCode', {
        accountType,
        account
    });
}


/**
 * POST /user-center/api/v1/account/validateRegSmsCode
 * 校验注册验证码
 * @param {string} accountType
 * @param {string} account 手机号
 * @param {string} verificationCode 验证码
 */
export function validateRegisterCode(account, verificationCode, accountType = 'phone') {
    return axios.post('/uc/account/validateRegSmsCode', {
        account,
        verificationCode,
        accountType
    });
}


/**
 * POST /user-center/api/v1/account/register
 * 注册
 * @param {string} accountType 
 * @param {string} account 账号/手机号
 * @param {string} password 密码
 * @param {string} verificationCode  验证码
 */
export function signup(account, password, verificationCode, accountType = 'phone') {
    const deviceKey = axios.defaults.headers.common['deviceKey'];
    return axios.post('/uc/account/register', {
        account,
        password,
        verificationCode,
        accountType,
        deviceKey
    });
}


/**
 * POST /user-center/api/v1/account/login
 * 输入密码登录
 * @param {string} accountType 
 * @param {string} account 
 * @param {string} password 
 */
export function login(account, password, accountType = 'phone') {
    const deviceKey = axios.defaults.headers.common['deviceKey'];
    return axios.post('/uc/account/login', {
        account,
        password,
        accountType,
        deviceKey
    })
}



/**
 * POST /sea-gateway/api/v1/uc/account/logout
 * 登出
 */
export function logout() {
    return axios.post('/uc/account/logout')
}

/**
 * GET /sea-loan-service/api/v1/account/info
 *  获取用户账户信息
 *  Header 中 需要 token 和 userId
 */
export function fetchUserInfo(type) {
    let url
    return axios.get(`/account/info${type ? ('?' + type) : ''}`);
}


/**
 * POST /user-center/api/v1/token/refreshToken
 * 刷新token
 * Header 中 需要 token 和 userId
 */
export async function refreshToken() {
    try{
        const { accessToken, accessTokenExpiredTime, currentTimeStamp } = await axios.post('/uc/token/refreshToken');
        setToken({
            accessToken: 'encrypt '+accessToken,
            accessTokenExpiredTime
        }, true)
        global.appStartTime = currentTimeStamp;
        global.appExperience = 0;
    }catch(error) {
        console.log('刷新token失败', error)
    }
}



/**
 * POST /user-center/api/v1/account/getResetPwdSmsCode
 * 发送重置密码短信验证码
 * @param {string} accountType
 * @param {string} account 手机号
 */
export function sendResetPwdSmsCode(account, accountType = 'phone') {
    return axios.post('/uc/account/getResetPwdSmsCode', {
        accountType,
        account
    });
}


/**
 * POST /user-center/api/v1/account/validateResetPwdSmsCode
 * 校验重置密码短信验证码
 * @param {string} accountType
 * @param {string} account 手机号
 * @param {string} verificationCode 验证码
 */
export function validateResetPwdCode(account, verificationCode, accountType = 'phone') {
    return axios.post('/uc/account/validateResetPwdSmsCode', {
        account,
        verificationCode,
        accountType
    });
}


/**
 * POST /sea-gateway/api/v1/account/getModifyPwdCode
 *  校验密码获得修改密码code
 */
export function getModifyPwdCode(account, password, accountType = 'phone') {
    return axios.post('/uc/account/getModifyPwdCode', {
        account,
        password,
        accountType
    });
}


/**
 * POST /sea-gateway/api/v1/account/modifyPassword
 *  校验密码获得修改密码code
 */
export function modifyPassword(account, password, verificationCode, accountType = 'phone') {
    return axios.post('/uc/account/modifyPassword', {
        account,
        password,
        verificationCode,
        accountType
    });
}


/**
 * POST /sea-gateway/api/v1/uc/account/getIdCardNoTailCode
 *  校验身份证尾号获得重置密码Code
 */
export function getIdCardNoTailCode(account, idCardNoTail, accountType = 'phone') {
    return axios.post('/uc/account/getIdCardNoTailCode', {
        account,
        idCardNoTail,
        accountType
    });
}



/**
 * POST /sea-gateway/api/v1/uc/account/resetPwdByIdCardNoCode
 *  通过身份证尾号验证码重置密码
 */
export function resetPwdByIdCardNoCode(account, password, verificationCode, accountType = 'phone') {
    return axios.post('/uc/account/resetPwdByIdCardNoCode', {
        account,
        password,
        verificationCode,
        accountType
    });
}


/**
 * POST /sea-gateway/api/v1/uc/account/resetPwdBySmsCode
  *  通过短信验证码重置密码
 */
export function resetPwdBySmsCode(account, password, verificationCode, accountType = 'phone') {
    return axios.post('/uc/account/resetPwdBySmsCode', {
        account,
        password,
        verificationCode,
        accountType
    });
}


/**
 * POST /sea-gateway/api/v1/uc/account/isIdCardNoAuthed
 *  账号是否实名认证
 */
export function isIdCardNoAuthed(account, accountType = 'phone') {
    return axios.post('/uc/account/isIdCardNoAuthed', {
        account,
        accountType
    });
}
