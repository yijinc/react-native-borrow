import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid, Dimensions } from 'react-native';
import { withNamespaces } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import px2rem from '../../utils/px2rem';
import { resetPwdBySmsCode, modifyPassword, resetPwdByIdCardNoCode } from '../../api/userApi';
import Button from '../../component/common/Button';
import { logoutRequest } from '../../store/actions/user';
import { encryptedData } from '../../utils/utils'

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        props.navigation.setParams({title: props.t('ResetPassword')})
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
        };
    }

    state = {
        password: '',
        password2: '',
        passwordVisible: false
    }

    _onChange = password => {
        this.setState({ password })
    }
    _onChange2 = password2 => {
        this.setState({ password2 })
    }

    _toggleVisible = () => {
        const { passwordVisible } = this.state;
        this.setState({
            passwordVisible: !passwordVisible
        })
    }

    _submit = () => {
        const { t } = this.props;
        const { password, password2 } = this.state;
        const { navigation } = this.props;
        if (password.length < 6) {
            ToastAndroid.show(t('passwordInvalid'), ToastAndroid.SHORT);
            return;
        }
        if (password !== password2) {
            ToastAndroid.show(t('password2Invalid'), ToastAndroid.SHORT);
            return;
        }

        const phone = (navigation.getParam('phone') || '').replace(/\D+/g, '');
        const verifyCode = navigation.getParam('verifyCode');
        const type = navigation.getParam('type');

        encryptedData(password).then((rsa) => {
            if (type == 'change') {
                modifyPassword(phone, rsa, verifyCode).then((res) => {
                    if (res) {
                        this.props.dispatch(logoutRequest());
                    }
                }).catch(error => ToastAndroid.show(error.message, ToastAndroid.SHORT))
            } else if (type == 'idcardEndVerify') {
                resetPwdByIdCardNoCode(phone, rsa, verifyCode).then((res) => {
                    if (res) {
                        this.props.dispatch(logoutRequest());
                    }
                }).catch(error => ToastAndroid.show(error.message, ToastAndroid.SHORT))
            } else {
                resetPwdBySmsCode(phone, rsa, verifyCode).then((res) => {
                    if (res) {
                        this.props.dispatch(logoutRequest());
                    }
                }).catch(error => ToastAndroid.show(error.message, ToastAndroid.SHORT))
            }

        })



    }

    render() {
        const { t } = this.props;
        const { password, password2, passwordVisible } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{t('NewPassword')}</Text>
                <View style={styles.passInput}>
                    <TextInput
                        value={password}
                        onChangeText={this._onChange}
                        secureTextEntry={!passwordVisible}
                        maxLength={12}
                        placeholder={t('passwordPlaceholder')}
                        placeholderTextColor="#999999"
                        style={styles.input} />
                    <Icon name={passwordVisible ? 'eye' : 'eye-slash'} size={px2rem(32)} color="#D8D8D8" onPress={this._toggleVisible} />
                </View>

                <Text style={[styles.label, { marginTop: px2rem(40) }]}> {t('ConfirmPassword2')} </Text>
                <View style={styles.passInput}>
                    <TextInput
                        value={password2}
                        onChangeText={this._onChange2}
                        maxLength={12}
                        placeholder={t('passwordPlaceholder')}
                        placeholderTextColor="#999999"
                        secureTextEntry={true}
                        style={styles.input} />
                </View>

                <TouchableOpacity activeOpacity={0.6} onPress={this._submit} style={styles.btn}>
                    <Button title={t('Submit')} />
                </TouchableOpacity>

            </View>
        );
    }
}

export default withNamespaces()(ResetPassword);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    label: {
        marginTop: px2rem(100),
        textAlign: 'left',
        color: '#333333',
        fontSize: px2rem(30),
        width: px2rem(650),
    },
    passInput: {
        justifyContent: 'center',
        flexDirection: 'row',
        borderBottomWidth: px2rem(1),
        borderBottomColor: '#d7d7d7',
        alignItems: 'center',
        width: px2rem(650),
        paddingTop: px2rem(20)
    },
    input: {
        flex: 1,
        fontSize: px2rem(28)
    },
    btn: {
        marginTop: Dimensions.get('window').height - px2rem(754)
    },

});