import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import { is, fromJS } from 'immutable';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Picker from 'react-native-picker';
import { getPickerCommon } from '../../../component/common/AddressPicker';
import px2rem from '../../../utils/px2rem';
import { padStr } from '../../../utils/utils';
import Button from '../../../component/common/Button';
import { getConfigOptions } from '../../../utils/systemOptions';

let Banks = [];
const formatBank = key => {
    const r = Banks.find(i=>i.itemKey==key);
    return r? r.itemValue : ''
}

type Props = {
    accountCard: object,
    updateBankCardInfo: Function
}

type State = {
    bankAccount: string,
    bankBranch: string,
    userName: string,
    mobile: string,
    bankCode: string
}
export default class BankInfo extends Component<Props, State> {
    constructor(props) {
        super(props);
        Banks = getConfigOptions('bankInfo-bankCode');
        this._initState(props.accountCard, true)
    }

    componentWillReceiveProps(nextProps) {
        if(!is(fromJS(this.props.accountCard), fromJS(nextProps.accountCard))) {
            this._initState(nextProps.accountCard)
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    _initState = (accountCard, inConstructor=false) => {
        const bankCard = accountCard || {};
        const state = {
            bankAccount: padStr((bankCard.bankAccount||''), [4,8,12,16], ' '),        // 银行卡号
            bankBranch: bankCard.bankBranch || '',          // 开户行分行信息
            bankCode: bankCard.bankCode || '',              // 银行编码
            mobile: bankCard.mobile || '',                  // 手机号
            userName: bankCard.userName || '',              // 用户姓名
        }
        if(inConstructor) {
            this.state = state;
        } else {
            this.setState(state)
        }
    }

    _onChangeUserName = userName => this.setState({userName})
    _onChangeBankBranch = bankBranch => this.setState({bankBranch})
    _onChangeMobile = mobile => this.setState({mobile: mobile.replace(/\D+/g, '')})
    _onChangeBankAccount = bankAccount => this.setState({bankAccount: padStr(bankAccount.replace(/\D+/g, ''), [4,8,12,16], ' ')})

    _openBankPicker = () => {
        const { bankCode } = this.state;
        Picker.init({
            ...getPickerCommon(),
            pickerData: Banks.map(i=>i.itemValue),
            selectedValue: [formatBank(bankCode)],
            onPickerConfirm: (data, index) => this.setState({bankCode: Banks[index[0]].itemKey})
        });
        Picker.show();
    }

    _next = () => {
        const { t } = this.props;
        const {
            bankAccount,
            bankBranch,
            bankCode,
            mobile,
            userName,
        } = this.state;
        if(!bankCode) {
            ToastAndroid.show(t('bank.accountTip'), ToastAndroid.SHORT);
            return;
        }
        if(!bankBranch) {
            ToastAndroid.show(t('bank.branchInfoTip'), ToastAndroid.SHORT);
            return;
        }
        if(!userName) {
            ToastAndroid.show(t('bank.typeYourName'), ToastAndroid.SHORT);
            return;
        }
        if(!mobile) {
            ToastAndroid.show(t('typePhoneNumber'), ToastAndroid.SHORT);
            return;
        }
        if(!bankAccount) {
            ToastAndroid.show(t('bank.typeCardNumber'), ToastAndroid.SHORT);
            return;
        }
        const data = {
            ...this.state
        }
        data.bankAccount = data.bankAccount.replace(/\D+/g, '');
        this.props.updateBankCardInfo(data, error => {
            if(!error) {
                this.props.next();
            } else {
                ToastAndroid.show(error, ToastAndroid.SHORT);
            }
        })
    }

    render() {
        const { t } = this.props;
        const {
            bankAccount,
            bankBranch,
            bankCode,
            mobile,
            userName,
        } = this.state;
        return (
            <ScrollView style={styles.container}>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('bank.account')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={this._openBankPicker}>
                        <Text style={bankCode? styles.label: styles.lightText}>{formatBank(bankCode)|| t('pleaseChoose')}</Text>
                        <Icon name='arrow-right' style={styles.icon} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.item}>
                    <Text style={styles.label}>{t('bank.branchInfo')}</Text>
                    <TextInput value={bankBranch} 
                        style={styles.input}
                        onChangeText={this._onChangeBankBranch}
                        maxLength={40}
                        placeholder={t('bank.branchInfoTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                     />
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('bank.userName')}</Text>
                    <TextInput value={userName} 
                        style={styles.input}
                        onChangeText={this._onChangeUserName}
                        maxLength={20}
                        placeholder={t('bank.typeYourName')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                     />
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('phoneNumber')}</Text>
                    <TextInput value={mobile} 
                        style={styles.input}
                        onChangeText={this._onChangeMobile}
                        maxLength={11}
                        placeholder={t('bank.typePhoneNumber')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='phone-pad'
                     />
                </View>


                <View style={styles.item}>
                    <Text style={styles.label}>{t('bank.cardNumber')}</Text>
                    <TextInput value={bankAccount} 
                        style={styles.input}
                        onChangeText={this._onChangeBankAccount}
                        maxLength={22}
                        placeholder={t('bank.typeCardNumber')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                     />
                </View>

                <TouchableOpacity activeOpacity={0.6} style={styles.nextBtn} onPress={this._next} >
                    <Button title={t('Completed')} />
                </TouchableOpacity>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: px2rem(750),
        backgroundColor: '#EFEFEF',
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
    nextBtn: {
        marginTop: px2rem(130),
        marginBottom: px2rem(130),
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    icon: {
        color: '#999',
        fontSize: px2rem(28),
        marginLeft: px2rem(16),
        textAlignVertical: 'center'
    }
});
