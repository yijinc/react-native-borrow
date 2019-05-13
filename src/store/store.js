import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import * as user from './reducers/user';
import * as loan from './reducers/loan';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const store = __DEV__ && window.__REDUX_DEVTOOLS_EXTENSION__? createStore(
    combineReducers({ ...user, ...loan }), 
    compose(
        applyMiddleware(sagaMiddleware),
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )
) : createStore(combineReducers({ ...user, ...loan }), applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootSaga);

export default store;

