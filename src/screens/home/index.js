import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, ScrollView, TouchableOpacity, BackHandler, ToastAndroid } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { is, fromJS } from 'immutable';
import px2rem from '../../utils/px2rem';

import { requestCurrentLoan } from '../../store/actions/loan';

import HomeDefault from './Home';
import Applying from '../loan/Applying';
import Repaying from '../loan/Repaying'

type Props = {};
class Home extends Component<Props> {

    exitCount = 1

    static navigationOptions = {
        header: null,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isFocused && !nextProps.isFocused) {
            this.exitCount = 1;
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        } else if (!this.props.isFocused && nextProps.isFocused) {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        }
    }

    // exit app
    handleBackPress = () => {
        if(this.exitCount > 0) {
            this.exitCount -= 1;
            ToastAndroid.show('再按一次返回退出程序', ToastAndroid.SHORT)
            return true;
        }
        return false;
    }

    _goToMineScreen = () => {
        this.props.navigation.navigate('Mine');
    }

    _renderHome = () => {
        const { currentLoan, userInfo, t, navigation, requestCurrentLoan } = this.props;
        if(!currentLoan.hasCurrentLoan) {
            return <HomeDefault t={t} navigation={navigation} userInfo={userInfo} />
        }
        if(!currentLoan.repaymentInfoDto) { // 没有用户偿还计划对象
            return <Applying t={t} navigation={navigation} loan={currentLoan} />
        } else {
            return <Repaying t={t} navigation={navigation} loan={currentLoan} requestCurrentLoan={requestCurrentLoan} />
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#FF5143" />
                <ScrollView style={styles.scrollView}>
                    <LinearGradient colors={['#FF5143', '#ff673b', '#FF8131']} style={styles.headerBox} />
                    <TouchableOpacity activeOpacity={1} onPress={this._goToMineScreen} style={styles.me}>
                        <Icon name="person" size={px2rem(60)} color="#fff"/>
                    </TouchableOpacity>
                    {
                        this._renderHome()
                    }
                </ScrollView>
            </View>
        );
    }
}

const select = state => {
    return {
        userInfo: state.userInfo,
        currentLoan: state.currentLoan
    }
}


export default withNamespaces()(connect(select, {requestCurrentLoan})(withNavigationFocus(Home)));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    scrollView: {
        backgroundColor: '#F8F8F8',
        flex: 1,
        width: px2rem(750)
    },
    headerBox: {
        height: px2rem(368),
        width: px2rem(750),
        position: 'absolute',
        top: 0,
        left: 0
    },

    me: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: px2rem(70),
        height: px2rem(70),
        zIndex: 999,
    },
});
