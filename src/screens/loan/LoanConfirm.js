/**
 * Loan Confirim Screen
*/
import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ToastAndroid, Image, StatusBar } from 'react-native';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import CheckBox from 'react-native-vector-icons/MaterialIcons';
import Picker from 'react-native-picker';
import moment from 'moment';

import px2rem from '../../utils/px2rem';
import Button from '../../component/common/Button';
import { getConfigOptions } from '../../utils/systemOptions';
import getDeviceInfo from '../../utils/deviceInfo';
import { createOrder } from '../../api/orderApi';
import { requestCurrentLoan } from '../../store/actions/loan';
import Loading from '../../component/Loading';
import { getCurrentTime } from '../../config'
import { getPickerCommon } from '../../component/common/AddressPicker';

let LoanPurposes = [];
let Banks = [];
const formatLoanPurpose = key => {
    const r = LoanPurposes.find(i=>i.itemKey==key);
    return r? r.itemValue : ''
}
const formatBankName = key => {
    const r = Banks.find(i=>i.itemKey===key);
    return r? r.itemValue : ''
}

type Props = {

}
class LoanConfirm extends Component<Props> {

    static navigationOptions = {
        title: 'Loan confirmation',
    }

    constructor(props) {
        super(props);
        LoanPurposes = getConfigOptions('userInfo-loanPurpose');
        Banks = getConfigOptions('bankInfo-bankCode');
        this.state = {
            submitting: false,
            loanPurpose: '',    // 租赁用途
            isAgree: true,
        }
    }

    _checkAgree = () => this.setState({isAgree: !this.state.isAgree})

    _openUsagePicker = () => {
        const { loanPurpose } = this.state;
        Picker.init({
            ...getPickerCommon(),
            pickerData: LoanPurposes.map(i=>i.itemValue),
            selectedValue: [formatLoanPurpose(loanPurpose)],
            onPickerConfirm: (data, index) => this.setState({loanPurpose: LoanPurposes[index[0]].itemKey})
        });
        Picker.show();
    }

    _apply = () => {
        const { t } = this.props;
        const { loanPurpose, isAgree } = this.state;
        if(!isAgree) {
            ToastAndroid.show(t('agreeUAPls'), ToastAndroid.SHORT);
            return;
        }
        if(!loanPurpose) {
            ToastAndroid.show(t('useOfTheLoanTip'), ToastAndroid.SHORT);
            return;
        }
        const { userInfo, requestCurrentLoan, navigation } = this.props;
        const body = {
            amount: global.product.amount,
            loanPurpose,
            bankCardId: userInfo.accountCardDto.cardId, // 打款银行卡
            idCard: userInfo.basicInfoDto.idCard,
            limitUnit: global.product.tenorUnit,  //期限单位 1:天 1:月, 首页选择的是 7天和14天
            loanLimit: global.product.tenor,
            productId: global.product.id,
            userName: userInfo.basicInfoDto.userName,
            deviceInfo: JSON.stringify(getDeviceInfo())
        }
        this.setState({submitting: true});
        createOrder(body).then( res=> {
            this.setState({submitting: false});
            if(res.result==='SUCCESS') {
                requestCurrentLoan();
                navigation.navigate('Loan', {from: 'LoanConfirm'});
            } else {
                ToastAndroid.show(res.message, ToastAndroid.SHORT);
            }
        }).catch(error => {
            this.setState({submitting: false});
        })
    }

    render() {
        const { userInfo, t } = this.props;
        const { loanPurpose, isAgree, submitting } = this.state;
        return (
            <ScrollView style={styles.container}>
                <StatusBar barStyle="default" backgroundColor="#000" />
                <Loading visible={submitting} />
                
                <Text style={styles.title}>{t('loanConfirmTip')}</Text>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('Name')}</Text>
                    <Text style={styles.label}>{userInfo.basicInfoDto.userName}</Text>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('ID')}</Text>
                    <Text style={styles.label}>{userInfo.basicInfoDto.idCard}</Text>
                </View>
                
                <View style={styles.item}>
                    <Text style={styles.label}>{t('loanAmount')}</Text>
                    <Text style={styles.label}>Rp {global.product.amount}</Text>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('useOfTheLoan')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={this._openUsagePicker}>
                        <Text style={loanPurpose? styles.label : styles.lightText}>{loanPurpose? formatLoanPurpose(loanPurpose): 'select'}</Text>
                        <Icon name='arrow-right' style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.item, {marginTop: px2rem(20)}]}>
                    <Text style={styles.label}>{t('loanPeriod')}</Text>
                    <Text style={styles.label}>{global.product.tenor} {global.product.tenorUnit===1?'Days':'Months'}</Text>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('repaymentDate')}</Text>
                    <Text style={styles.label}>{moment(getCurrentTime()).add(global.product.tenor, global.product.tenorUnit===1?'d':'M').format('DD/MM/YYYY')}</Text>
                </View>
                
                <View style={styles.bankItem}>
                    {/* <Image source={} /> */}
                    <View style={styles.bankInfo}>
                        <Text style={{color: '#333', marginBottom: px2rem(16), fontSize: px2rem(24)}}>{formatBankName(userInfo.accountCardDto.bankCode)}</Text>
                        <Text style={styles.lightText}>{userInfo.accountCardDto.bankAccount}</Text>
                    </View>
                    <Icon name='arrow-right' style={styles.icon} />
                </View>

                <TouchableOpacity activeOpacity={1} onPress={this._checkAgree} style={styles.agreeBox}>
                    <CheckBox name={isAgree? 'check-box' : 'check-box-outline-blank'} size={px2rem(36)} color={isAgree? '#e17237':'#999999'} />
                    <Text>{t('agreeUA')}</Text>
                </TouchableOpacity>


                <TouchableOpacity activeOpacity={0.6} style={styles.btn} onPress={this._apply} >
                    <Button title='Apply' />
                </TouchableOpacity>
            </ScrollView>
        );
    }
}
const select = state => {
    return {
        userInfo: state.userInfo,
        currentLoan: state.currentLoan
    }
}

export default withNamespaces()(connect(select, {requestCurrentLoan})(LoanConfirm));


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: px2rem(750),
        backgroundColor: '#EFEFEF',
    },
    title: {
        color: '#999',
        fontSize: px2rem(28),
        paddingTop: px2rem(26),
        paddingBottom: px2rem(26),
        paddingLeft: px2rem(30)
    },
    item: {
        flexDirection: 'row',
        height: px2rem(100),
        backgroundColor: '#fff',
        borderBottomColor: '#EFEFEF',
        borderBottomWidth: px2rem(1),
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: px2rem(30),
        paddingRight: px2rem(30),
    },
    label: {
        color: '#333',
        fontSize: px2rem(30)
    },
    lightText: {
        color: '#999',
        fontSize: px2rem(30)
    },
    touch: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    input: {
        textAlign: 'right',
        flex: 1
    },
    btn: {
        marginBottom: px2rem(60),
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    bankItem: {
        marginTop: px2rem(20),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: px2rem(30),
        paddingRight: px2rem(30),
        height: px2rem(120)
    },
    bankInfo: {
        flex: 1
    },
    agreeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px2rem(54),
        marginLeft: px2rem(50),
        marginBottom: px2rem(20)
    },
    icon: {
        color: '#999',
        fontSize: px2rem(28),
        marginLeft: px2rem(16),
        textAlignVertical: 'center'
    }
});
