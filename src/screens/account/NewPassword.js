import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { withNamespaces } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import px2rem from '../../utils/px2rem';
import { signup } from '../../api/userApi';
import Logo from '../../component/common/AppLogo';
import Button from '../../component/common/Button';
import { encryptedData } from '../../utils/utils'

/** 
 * NewPassword Component for Register
*/
class NewPassword extends Component {
    constructor(props) {
        super(props);
        props.navigation.setParams({title: props.t('SetPassword')})
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
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
        const { navigation, t } = this.props;
        if (password.length < 6) {
            ToastAndroid.show(t('passwordInvalid'), ToastAndroid.SHORT);
            return;
        }
        const phone = (navigation.getParam('phone') || '').replace(/\D+/g, '');
        const verifyCode = navigation.getParam('verifyCode');
        // 完成注册
        encryptedData(password).then((rsaPassword) => {
            signup(phone, rsaPassword, verifyCode).then(res => {
                // accessToken: "42fc21c3983bef4bee2c78451ee782e5"
                // accessTokenExpiredTime: 1542686302024
                // account: "18888888888"
                // accountType: "phone"
                // hasPassword: true
                // loginTime: "2018-11-20 11:28:22"
                // name: ""
                // regTime: "2018-11-20 11:28:22.0"
                // sex: 0
                // uid: 27
                navigation.navigate('Login', {
                    phone
                });
            }).catch(error => ToastAndroid.show(error.message, ToastAndroid.SHORT))
        });


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
                        placeholder={t('passwordPlaceholder')}
                        placeholderTextColor="#999999"
                        style={styles.input} />
                    <Icon name={passwordVisible ? 'eye' : 'eye-slash'} size={px2rem(32)} color="#D8D8D8" onPress={this._toggleVisible} />
                </View>

                <TouchableOpacity activeOpacity={0.6} onPress={this._submit} style={styles.btn}>
                    <Button title={t('completeRegistration')} />
                </TouchableOpacity>

            </View>
        );
    }
}

export default withNamespaces()(NewPassword);

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