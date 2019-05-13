import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid, Dimensions } from 'react-native';
import { withNamespaces } from 'react-i18next';
import px2rem from '../../utils/px2rem';
import { sendResetPwdSmsCode, validateResetPwdCode } from '../../api/userApi';
import Button from '../../component/common/Button';

class ForgetPassword extends Component {

    constructor(props) {
        super(props);
        props.navigation.setParams({title: props.t('forgetPassword')})
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
        };
    }

    timer = null;

    state = {
        phone: this.props.navigation.getParam('phone') || '',
        verifyCode: '',
        codeSecond: 0
    }

    componentDidMount() {
        this._sendCode();
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _onChangeVerifyCode = verifyCode => {
        this.setState({verifyCode})
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
        sendResetPwdSmsCode(phone.replace(/\D+/g, '')).then(ok => {
            if (ok) {
                this.setState({
                    codeSecond: 120
                }, () => {
                    this._countDown()
                });
            } else {
                ToastAndroid.show(t('VerificationCodeSendFailed'), ToastAndroid.SHORT);
            }
        }).catch(error => ToastAndroid.show(error.message, ToastAndroid.SHORT))
    }

    _submit = () => {
        const { t } = this.props;
        const { phone, verifyCode } = this.state;
        if (verifyCode.length === 0) {
            ToastAndroid.show(t('typeVerificationCode'), ToastAndroid.SHORT);
            return;
        }


        validateResetPwdCode(phone.replace(/\D+/g, ''), verifyCode).then(ok => {
            if (ok) {
                this.props.navigation.push('SetPassword', {
                    from: 'forget password',
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
        const { verifyCode, codeSecond } = this.state;
        const phone = (this.props.navigation.getParam('phone') || '').replace(/\D+/g, '');
        return (
            <View style={styles.container}>

                    <Text style={styles.text}>{t('VerificationCodeSendSuccess')}</Text>
                    <Text style={styles.text}>{t('VerificationCodeValidTime')}</Text>
                    <View style={styles.codeInput}>
                        <TextInput
                            style={{flex: 1, textAlign: 'center'}}
                            value={verifyCode}
                            onChangeText={this._onChangeVerifyCode}
                            keyboardType='numeric'
                            placeholder={t('VerificationCode')}
                            maxLength={6} />
                    </View>
                    {
                        codeSecond === 0? <Text style={styles.send} onPress={this._sendCode}>{t('Send')}</Text> : <Text style={styles.sendWait}>{t('ReSend')}（{codeSecond}s)</Text>
                    }

                <TouchableOpacity style={styles.btn} activeOpacity={0.6} onPress={this._submit}>
                    <Button title={t('Next')} />
                </TouchableOpacity>
            </View>
        );
    }
}

export default withNamespaces()(ForgetPassword);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: px2rem(60)
    },
    text: {
        color: '#333333',
        fontSize: px2rem(34),
        lineHeight: px2rem(76),
        textAlign: 'center'
    },
    send: {
        color: '#333333',
        fontSize: px2rem(30)
    },
    sendWait: {
        color: '#ccc',
        fontSize: px2rem(30)
    },
    codeInput: {
        width: px2rem(650),
        justifyContent: 'center',
        flexDirection: 'row',
        borderBottomWidth: px2rem(1),
        borderBottomColor: '#bfbfbf',
        alignItems: 'center',
        marginTop: px2rem(80),
        marginBottom: px2rem(20)
    },
    btn: {
        marginTop: Dimensions.get('window').height - px2rem(832)  // 计算高度 
    }

});