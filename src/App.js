import React, { Component } from 'react';
import { Platform } from "react-native";
import { Provider } from 'react-redux';

import AppContainer from './screens/container';
import store from './store/store';
import './utils/task/syncTimeTask'



function handleNavigationChange(prevState, newState, action) {
    // console.log('handleNavigationChange', prevState, newState, action);
}


// on Android, the URI prefix typically contains a host in addition to scheme
// on Android, note the required / (slash) at the end of the host property
const uriPrefix = Platform.OS == 'android' ? 'mychat://mychat/' : 'mychat://';


export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppContainer
                    onNavigationStateChange={handleNavigationChange }
                    uriPrefix={uriPrefix}
                />
            </Provider>
        );
    }
}
