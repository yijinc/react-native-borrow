import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import px2rem from '../../utils/px2rem';
import { getModifyPwdCode } from '../../api/userApi';

import Logo from '../../component/common/AppLogo';
import Button from '../../component/common/Button';
import { encryptedData } from '../../utils/utils'


class ChangePassword extends Component {
    constructor(props) {
        super(props);
        props.navigation.setParams({title: props.t('changePassword')})
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title')
        };
    }

    state = {
        password: '',
        passwordVisible: false
    }

    _onChange = password => this.setState({ password })

    _toggleVisible = () => {
        const { passwordVisible } = this.state;
        this.setState({
            passwordVisible: !passwordVisible
        })
    }

    _submit = () => {
        const { password } = this.state;
        const { navigation, t, user } = this.props;
        if (password.length < 6) {
            ToastAndroid.show(t('passwordInvalid'), ToastAndroid.SHORT);
            return;
        }
        encryptedData(password).then((encryptedPassword) => {
            getModifyPwdCode(user.mobile, encryptedPassword).then((res) => {
                navigation.navigate('SetPassword', {
                    verifyCode: res,
                    phone: user.mobile,
                    type: 'change'
                });
            }).catch((error) => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            });
        });

    }

    _forget = () => {
        let { user } = this.props;
        if (user && user.idCard) {
            this.props.navigation.push('IdcardEndVerify', {
                phone: user.mobile,
            })
        } else {
            this.props.navigation.push('ForgetPassword', {
                phone: user.mobile,
            })
        }
    }

    render() {
        const { t } = this.props;
        const { password, passwordVisible } = this.state;
        return (
            <View style={styles.container}>
                <Logo />
                <Text style={styles.label}>{t('Password')}</Text>
                <View style={styles.passInput}>
                    <TextInput
                        value={password}
                        onChangeText={this._onChange}
                        secureTextEntry={!passwordVisible}
                        maxLength={12}
                        placeholder={t('enterLoginPassword')}
                        placeholderTextColor="#999999"
                        style={styles.input} />
                    <Icon name={passwordVisible ? 'eye' : 'eye-slash'} size={px2rem(32)} color="#D8D8D8" onPress={this._toggleVisible} />
                </View>

                <TouchableOpacity activeOpacity={0.6} onPress={this._submit} style={styles.btn}>
                    <Button title={t('Submit')} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} onPress={this._forget}>
                    <Text style={{color: '#999999',fontSize: px2rem(30),marginTop: px2rem(30) }}>{t('forgetPassword')}</Text>
                </TouchableOpacity>

            </View>
        );
    }
}

const select = state => {
    return {
        user: state.userInfo.basicInfoDto
    }
}

export default withNamespaces()(connect(select)(ChangePassword));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    label: {
        marginTop: px2rem(120),
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
        paddingTop: px2rem(40)
    },
    input: {
        flex: 1,
        fontSize: px2rem(28)
    },
    btn: {
        marginTop: px2rem(120)
    },

});