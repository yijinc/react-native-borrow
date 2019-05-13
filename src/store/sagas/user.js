import {
    takeLatest,
    call,
    put,
} from 'redux-saga/effects';

import {
    LOGIN_REQUEST,
    REQUEST_USER_INFO,
    LOGOUT_REQUEST,
    UPDATE_BASIC_INFO_REQUEST,
    UPDATE_COMPANY_INFO_REQUEST,
    UPDATE_BANKCARD_INFO_REQUEST,
} from '../constants';

import * as Api from '../../api/userApi';
import * as Api2 from '../../api/accountInfoApi';
import * as Action from '../actions/user';
import { requestCurrentLoan } from '../actions/loan';
import { setToken, clearToken } from '../../api/request/axios';
import fetchSystemOptions from '../../utils/systemOptions';

function* authorize({ phone, password, resolve }) {
    try {
        const data = yield call(Api.login, phone, password);
        const token = {
            accessToken: 'encrypt ' + data.accessToken,
            userId: data.uid,
            accessTokenExpiredTime: data.accessTokenExpiredTime
        };
        setToken(token, true);
        fetchSystemOptions();
        yield put(Action.requestUserInfo());
        yield put(requestCurrentLoan(resolve));
    } catch (error) {
        // yield put(Action.loginFailure());
        resolve && resolve(error.message);
    }
}


function* requestUserInfo({resolve}) {
    try {
        yield put(Action.fetchUserInfo());
        const response = yield call(Api.fetchUserInfo);
        yield put(Action.receiveUserInfo(response));
        resolve && resolve(true)
    } catch (error) {
        resolve && resolve(false)
        yield put(Action.receiveUserInfo({}));
    }
}





function* logoutUser() {
    try {
        Api.logout();
        clearToken();
        yield put(Action.logoutSuccess());
    } catch (error) {
    }
}

function* setBasicInfo({type, basicInfo, resolve}) {
    try {
        yield put(Action.updating('basicInfo'));
        const response = yield call(Api2.updateBasicInfo, basicInfo);
        if(response.result==='SUCCESS') {
            yield put(Action.updateBasicInfoSuccess(basicInfo));
            resolve && resolve()
        } else {
            yield put(Action.updateFailed());
            resolve && resolve(response.message)
        }
    } catch (error) {
        yield put(Action.updateFailed());
        resolve && resolve(error.message)
    }
}

function* setCompanyInfo({type, companyInfo, resolve}) {
    try {
        yield put(Action.updating('companyInfo'));
        const response = yield call(Api2.updateCompanyInfo, companyInfo);
        if(response.result==='SUCCESS') {
            yield put(Action.updateCompanyInfoSuccess(companyInfo));
            resolve && resolve();
        } else {
            yield put(Action.updateFailed());
            resolve && resolve(response.message)
        }
    } catch (error) {
        yield put(Action.updateFailed());
        resolve && resolve(error.message)
    }
}

function* setBankCardInfo({type, bankCardInfo, resolve}) {
    try {
        yield put(Action.updating('bankCardInfo'));
        const response = yield call(Api2.bindBankCard, bankCardInfo);
        if(response.result==='SUCCESS') {
            yield put(Action.updateBankCardInfoSuccess(bankCardInfo));
            resolve && resolve()
        } else {
            yield put(Action.updateFailed());
            resolve && resolve(response.message)
        }
    } catch (error) {
        yield put(Action.updateFailed());
        resolve && resolve(error.message)
    }
}



export function* watchUser() {
    yield takeLatest(LOGIN_REQUEST, authorize);
    yield takeLatest(LOGOUT_REQUEST, logoutUser);
    yield takeLatest(REQUEST_USER_INFO, requestUserInfo);

    yield takeLatest(UPDATE_BASIC_INFO_REQUEST, setBasicInfo);
    yield takeLatest(UPDATE_COMPANY_INFO_REQUEST, setCompanyInfo);
    yield takeLatest(UPDATE_BANKCARD_INFO_REQUEST, setBankCardInfo);
}
