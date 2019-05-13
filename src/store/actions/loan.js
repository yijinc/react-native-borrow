import {
    REQUEST_CURRENT_LOAN,
    FETCH_CURRENT_LOAN,
    RECEIVE_CURRENT_LOAN,

    REQUEST_HISTORY_LOANS,
    FETCH_HISTORY_LOANS,
    RECEIVE_HISTORY_LOANS,
} from '../constants';

/*
* 请求用户当前租赁信息
* */
export function requestCurrentLoan(resolve) {
    return {
        type: REQUEST_CURRENT_LOAN,
        resolve
    };
}
export function fetchCurrentLoan() {
    return {
        type: FETCH_CURRENT_LOAN
    };
}

export function receiveCurrentLoan(loan) {
    return {
        type: RECEIVE_CURRENT_LOAN,
        loan
    };
}








/*
* 请求用户历史租赁订单【列表】
* */
export function requestHistoryLoans(page=1, resolve) {
    return {
        type: REQUEST_HISTORY_LOANS,
        page,
        resolve
    };
}
export function fetchHistoryLoans() {
    return {
        type: FETCH_HISTORY_LOANS
    };
}

export function receiveHistoryLoans(loans) {
    return {
        type: RECEIVE_HISTORY_LOANS,
        loans
    };
}