/** 
* 登录页面
*/

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import px2rem from '../../utils/px2rem';
import { loginRequest } from '../../store/actions/user';
import Logo from '../../component/common/AppLogo';
import Button from '../../component/common/Button';
import { encryptedData } from '../../utils/utils'
import { isIdCardNoAuthed } from '../../api/userApi'
import { HeaderLeft } from '../../component/defaultNavigationOptions';


type Props = {};
class Login extends Component<Props> {

    constructor(props) {
        super(props);
        props.navigation.setParams({title: props.t('Login')})
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
            headerLeft: <HeaderLeft onPress={()=>navigation.navigate('AccountStart')}/>
        };
    }

    state = {
        phone: (this.props.navigation.getParam('phone') || '').replace(/\D+/g, ''),
        password: '',
        passwordVisible: false
    }

    _onChangePass = password => this.setState({ password })

    _toggleVisible = () => {
        const { passwordVisible } = this.state;
        this.setState({
            passwordVisible: !passwordVisible
        })
    }

    _login = () => {
        const { phone, password } = this.state;
        const { dispatch, navigation } = this.props;

        const { t } = this.props;

        if (password.length === 0) {
            ToastAndroid.show(t('passwordTip'), ToastAndroid.SHORT);
            return;
        }


        encryptedData(password).then((rsaPassword) => {
            dispatch(loginRequest(phone, rsaPassword, errorMsg => {
                if (!errorMsg) {
                    navigation.navigate('Home');
                } else {
                    ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
                }
            }));
        });
    }

    _goForgetPassword = () => {
        isIdCardNoAuthed(this.state.phone).then((res) => {
            if (res) {
                this.props.navigation.push('IdcardEndVerify', {
                    phone: this.state.phone
                });
            } else {
                this.props.navigation.push('ForgetPassword', {
                    phone: this.state.phone
                });
            }
        })
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
                        onChangeText={this._onChangePass}
                        secureTextEntry={!passwordVisible}
                        maxLength={12}
                        placeholder={t('passwordPlaceholder')}
                        placeholderTextColor="#999999"
                        style={styles.input} />
                    <Icon name={passwordVisible ? 'eye' : 'eye-slash'} size={px2rem(32)} color="#D8D8D8" onPress={this._toggleVisible} />
                </View>

                <Text style={styles.forget} onPress={this._goForgetPassword}>{t('forgetPassword')}?</Text>
                <TouchableOpacity activeOpacity={0.6} onPress={this._login} style={styles.loginBtn}>
                    <Button title={t('loginImmediately')} />
                </TouchableOpacity>
            </View>
        );
    }
}

const select = state => {
    return {

    }
}

// 2个函数 高阶组件
export default withNamespaces()(connect(select)(Login));



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
    loginBtn: {
        marginTop: px2rem(120)
    },
    forget: {
        textAlign: 'left',
        color: '#FF6A3A',
        fontSize: px2rem(24),
        width: px2rem(650),
        marginTop: px2rem(20)
    }
});