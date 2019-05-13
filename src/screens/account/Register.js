import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { withNamespaces } from 'react-i18next';
import CheckBox from 'react-native-vector-icons/MaterialIcons';
import px2rem from '../../utils/px2rem';
import { padStr } from '../../utils/utils';
import { sendSmsCode, validateRegisterCode } from '../../api/userApi';
import Logo from '../../component/common/AppLogo';
import Button from '../../component/common/Button';
import { HeaderLeft } from '../../component/defaultNavigationOptions';

class Register extends Component {

    constructor(props) {
        super(props);
        props.navigation.setParams({title: props.t('Register')})
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
            headerLeft: <HeaderLeft onPress={()=>navigation.navigate('AccountStart')}/>
        };
    }

    timer = null;

    state = {
        phone: this.props.navigation.getParam('phone') || '',
        verifyCode: '',
        isAgree: true,
        codeSecond: 0,
        hasSend: false
    }

    componentDidMount() {
        this._sendCode();
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _onChangePhone = phone => {
        this.setState({phone: padStr(phone.replace(/\D+/g, ''), [3, 6, 9], ' ')})
    }

    _onChangeVerifyCode = verifyCode => {
        this.setState({verifyCode})
    }

    _checkAgree = () => {
        this.setState({isAgree: !this.state.isAgree})
    }

    // 倒计时
    _countDown = () => {
        const { codeSecond } = this.state;
        if (codeSecond > 0) {
            this.setState({
                codeSecond: codeSecond - 1
            });
            this.timer = setTimeout(this._countDown, 1000);
        }
    }

    // 发送验证码
    _sendCode = () => {
        const { t } = this.props;
        const { phone, codeSecond }  = this.state;
        if (!phone) {
            return;
        }
        if (codeSecond > 0) {
            return;
        }
        sendSmsCode(phone.replace(/\D+/g, '')).then(ok => {
            if (ok) {
                this.setState({
                    codeSecond: 120,
                    hasSend: true
                }, () => {
                    this._countDown()
                });
            } else {
                ToastAndroid.show(t('VerificationCodeSendFailed'), ToastAndroid.SHORT);
            }
        }).catch(error => ToastAndroid.show(error.message, ToastAndroid.SHORT))
    }

    _register = () => {
        const { t } = this.props;
        const { phone, verifyCode, isAgree } = this.state;
        if (phone.length < 11) {
            ToastAndroid.show(t('phoneInvalid'), ToastAndroid.SHORT);
            return;
        }

        if (verifyCode.length === 0) {
            ToastAndroid.show(t('typeVerificationCode'), ToastAndroid.SHORT);
            return;
        }

        if (!isAgree) {
            ToastAndroid.show(t('agreeUAPls'), ToastAndroid.SHORT);
            return;
        }

        validateRegisterCode(phone.replace(/\D+/g, ''), verifyCode).then(ok => {
            if (ok) {
                this.props.navigation.push('NewPassword', {
                    from: 'register',
                    phone: phone,
                    verifyCode: verifyCode
                })
            } else {
                ToastAndroid.show(t('VerificationCodeError'), ToastAndroid.SHORT)
            }
        }).catch(error => ToastAndroid.show(error.message, ToastAndroid.SHORT))
    }

    render() {
        const { t } = this.props;
        const { phone, verifyCode, isAgree, codeSecond, hasSend } = this.state;
        return (
            <View style={styles.container}>
                <Logo/>
                <View style={styles.phoneInput}>
                    <TextInput
                        style={{flex: 1}}
                        value={phone}
                        onChangeText={this._onChangePhone}
                        placeholder={t('phoneNumber')}
                        editable={false}
                        maxLength={14} />
                </View>
                <View style={styles.codeInput}>
                    <TextInput
                        style={{flex: 1}}
                        value={verifyCode}
                        onChangeText={this._onChangeVerifyCode}
                        keyboardType='numeric'
                        placeholder={t('VerificationCode')}
                        maxLength={6} />
                    {
                        codeSecond === 0? <Text onPress={this._sendCode}>{t('VerificationCodeGet')}</Text> : <Text>({codeSecond}s)</Text>
                    }
                </View>
                <Text style={[styles.desc, { opacity: hasSend? 1 : 0 } ]}>{t('VerificationCodeSendSuccess')}</Text>
                <TouchableOpacity activeOpacity={1} onPress={this._checkAgree} style={styles.agreeBox}>
                    <CheckBox name={isAgree? 'check-box' : 'check-box-outline-blank'} size={px2rem(36)} color={isAgree? '#e17237':'#999999'} />
                    <Text>{t('agreeUA')}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} onPress={this._register}>
                    <Button title={t('Register')} />
                </TouchableOpacity>
            </View>
        );
    }
}

export default withNamespaces()(Register);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    phoneInput: {
        width: px2rem(650),
        justifyContent: 'center',
        flexDirection: 'row',
        borderBottomWidth: px2rem(1),
        borderBottomColor: '#bfbfbf',
        alignItems: 'center',
        paddingTop: px2rem(100)
    },
    codeInput: {
        width: px2rem(650),
        justifyContent: 'center',
        flexDirection: 'row',
        borderBottomWidth: px2rem(1),
        borderBottomColor: '#bfbfbf',
        alignItems: 'center',
        paddingTop: px2rem(40)
    },
    desc: {
        color: '#FF6A3A',
        width: px2rem(650),
        marginTop: px2rem(12)
    },
    agreeBox: {
        flexDirection: 'row',
        width: px2rem(650),
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: px2rem(54),
        marginBottom: px2rem(20)
    }

});