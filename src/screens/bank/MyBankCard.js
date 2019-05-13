/**
 * MyBankCard Screen
*/
import React, { Component } from 'react';
import { StatusBar, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import BankInfo from '../identification/bankInfo/BankInfo';  // 复用银行卡信息组件，修改时注意是否还能复用
import { withNamespaces } from 'react-i18next';
import Loading from '../../component/Loading';
import { updateBankCardInfo } from '../../store/actions/user';

class MyBankCard extends Component {
    constructor(props) {
        super(props)
        props.navigation.setParams({title: props.t('MyBankCard')})
    }
    
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
        };
    };

    _modifySuccess = _ => ToastAndroid.show(this.props.t('bank.modifiedSuccess'), ToastAndroid.SHORT)

    render() {
        const { updateBankCardInfo, userInfo, t } = this.props;
        const { accountCardDto } = userInfo;
        return (
            <>
                <StatusBar barStyle="default" backgroundColor="#000" />
                <Loading visible={userInfo.userInfoUpdating!==''} />
                <BankInfo next={this._modifySuccess} accountCard={accountCardDto} updateBankCardInfo={updateBankCardInfo} t={t} />
            </>
        );
    }
}

const select = state => {
    return {
        userInfo: state.userInfo
    }
}

export default withNamespaces()(connect(select, {updateBankCardInfo})(MyBankCard));
