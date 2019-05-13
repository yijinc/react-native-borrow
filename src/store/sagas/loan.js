import { call, put, take, fork, cancel, cancelled, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { REQUEST_CURRENT_LOAN, REQUEST_HISTORY_LOANS } from '../constants';
import * as Api from '../../api/orderApi';
import * as Action from '../actions/loan';


const STOP_BACKGROUND_SYNC = 'STOP_BACKGROUND_SYNC';

function* getCurrentLoan() {
    try {
        while (true) {
            yield put(Action.fetchCurrentLoan());
            const response = yield call(Api.fetchCurrentOrder);
            yield put(Action.receiveCurrentLoan(response));
            if(response.status!=='CREDIT_START') {
                // 状态 不是 审核中  不轮询
                yield put({type: STOP_BACKGROUND_SYNC});
            }
            yield delay(30000); // 30秒 轮询
        }
    } catch (error) {
        console.log(error);
        yield put({type: STOP_BACKGROUND_SYNC});
    } finally {
        if (yield cancelled())
            yield put(Action.receiveCurrentLoan({}));
    }
}

/**
 * 获取当前租赁订单
 * @param {function} resolve 
 */
export function* loopFetchCurrentLoan() {
    while ( yield take(REQUEST_CURRENT_LOAN) ) {
        // 启动后台任务
        const loopTask = yield fork(getCurrentLoan)
    
        // 等待用户的停止操作
        yield take(STOP_BACKGROUND_SYNC)
        // 用户点击了停止，取消后台任务
        // 这会导致被 fork 的 getCreditBalance 任务跳进它的 finally 区块
        yield cancel(loopTask)
    }
}


/**
 * 获取用户历史租赁订单
 * @param {number} page 页数
 * @param {function} resolve 
 */
function* getHistoryLoans({page, resolve}) {
    try {
        yield put(Action.fetchHistoryLoans());
        const response = yield call(Api.fetchOrderList, page);
        const loans = {
            page: response.pageNum,
            pageSize: response.pageSize,
            total: response.total,
            list: response.data,
        }
        yield put(Action.receiveHistoryLoans(loans));
        resolve && resolve()
    } catch (error) {
        yield put(Action.receiveCurrentLoan({}));
        resolve && resolve(error.message)
    }
}





export function* watchLoan() {
    yield takeLatest(REQUEST_HISTORY_LOANS, getHistoryLoans);
}