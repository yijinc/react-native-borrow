import { fork, takeEvery, select } from 'redux-saga/effects';

import { watchUser } from './user';
import { watchLoan, loopFetchCurrentLoan } from './loan';

export default function * root () {
    yield fork(watchUser);
    yield fork(watchLoan);
    yield fork(loopFetchCurrentLoan);
    __DEV__ && (yield fork(function* watchAndLog() {
        yield takeEvery('*', function* logger(action) {
            const state = yield select();
            console.log('@@redux-saga / action', action);
            console.log('@@redux-saga / store', state);
        });
    }));
}