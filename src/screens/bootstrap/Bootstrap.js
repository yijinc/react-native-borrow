import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View,
    AsyncStorage,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import i18n, { changeLanguage } from '../../i18n';
import axios, { setToken, refreshToken } from '../../api/request/axios';
import { requestUserInfo } from '../../store/actions/user';
import { requestCurrentLoan } from '../../store/actions/loan';
import fetchSystemOptions from '../../utils/systemOptions';
import NavigationService from '../../utils/NavigationService';
import { fetchcurrentTimeStamp } from '../../api/utilApi';


/**
 * app 启动前 处理 组件
*/
class BootStrap extends React.Component {
    constructor(props) {
        super(props);
        NavigationService.setTopLevelNavigator(props.navigation);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {

        /**
         *  获取/设置语言
        */
        let language = null;
        try {
            language = await AsyncStorage.getItem('language');
        } catch (error) {
            console.log('AsyncStorage.getItem - language', error);
        }

        if (language && i18n.language !== language) {
            try {
                await changeLanguage(language);
            } catch (error) {
                console.log('changeLanguage filed', error);
            }
        }

        /**
         * 获取/设置 deviceKey
        */
        let deviceKey = null;
        try {
            deviceKey = await AsyncStorage.getItem('AppDeviceKey');
        } catch (error) {
        }
        if(deviceKey===null) {
            deviceKey = DeviceInfo.getUniqueID();
            AsyncStorage.setItem('AppDeviceKey', deviceKey);
        }
        axios.defaults.headers.common['deviceKey'] = deviceKey;


        /**
         * 获取/同步 服务器时间
        */
        try {
            global.appStartTime = await fetchcurrentTimeStamp();
            global.appExperience = 0;
        }catch(error) {
            console.log('系统初始化 获取服务器时间失败', error)
        }


        /**
         * 获取/设置 token
        */
        let token = null;
        try {
            token = await AsyncStorage.getItem('token');
            if (token !== null) {
                token = JSON.parse(token);
                setToken(token);
                // token 过期
                if (global.appStartTime >= token.accessTokenExpiredTime) {
                    const newToken = await refreshToken();
                    if (newToken === null) {
                        // 未登录
                        // this.props.navigation.navigate('Account');
                    }
                } else {
                    // token 未过期 请求用户数据
                    fetchSystemOptions();
                    this.props.dispatch(requestUserInfo());
                    this.props.dispatch(requestCurrentLoan());
                }
                
            }
        } catch (error) {
            console.log('AsyncStorage.getItem - token', error);
        }

        this.props.navigation.navigate('Home');
        
    };

    // componentWillReceiveProps(nextProps) {
    //     /**
    //      * 首页ui 是根据 currentLoan展示的，userInfo 可以忽略
    //     */
    //     if(this.props.currentLoan.isFetching===true && nextProps.currentLoan.isFetching===false) {
    //         /**
    //          * 未授权 axios会拦截401 跳转到登录页面，
    //          * 这里只需要判断获取到 currentLoan 获取完成跳转到 Home
    //         */
    //         this.props.navigation.navigate('Home');
    //     }
    // }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    // Render any loading content that you like here
    render() {
        return (
        <View style={styles.container}>
            <ActivityIndicator size={80} color="#FF6A3A" />
        </View>
        );
    }
}

const select = state => {
    return {
        // userInfo: state.userInfo,
        currentLoan: state.currentLoan
    }
}

export default connect(select)(BootStrap);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    }
});