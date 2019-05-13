/** 
* app第一屏页面 手机号输入
*/

import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Picker, ToastAndroid, StatusBar } from 'react-native';
import { withNamespaces } from 'react-i18next';
import px2rem from '../../utils/px2rem';
import { padStr } from '../../utils/utils';
import { tryLogin } from '../../api/userApi';
import Logo from '../../component/common/AppLogo';
import Button from '../../component/common/Button';


type Props = {};
type State = {
    phone: string,
};

class AccountStart extends Component<Props, State> {

    state = {
        phone: '',
        country: '62'
    }

    _onChange = (phone) => {
        this.setState({
            phone: padStr(phone.replace(/\D+/g, ''), [3, 6, 9], ' ')
        })
    }

    _onBlur = () => {
        // 校验手机号码
        const { t } = this.props;
        const { phone } = this.state;
        if (phone.length < 11) {
            ToastAndroid.show(t('phoneInvalid'), ToastAndroid.SHORT);
        }
    }

    _onPickerChange = (itemValue, itemIndex) => {
        this.setState({ country: itemValue })
    }

    _onPress = () => {
        
        // 校验手机号码
        const { t } = this.props;
        const { phone } = this.state;
        if (phone.length === 0) {
            ToastAndroid.show(t('typePhoneNumber'), ToastAndroid.SHORT);
            return;
        }

        if (phone.length < 11) {
            ToastAndroid.show(t('phoneInvalid'), ToastAndroid.SHORT);
            return;
        }

        // try login 根据手机号 判断 登录 还是 注册
        tryLogin(phone.replace(/\D+/g, '')).then(res => {
            const nextScreen = (res.hasReg && res.hasPassword) ? 'Login' : 'Register';
            this.props.navigation.navigate(nextScreen, {
                phone
            })
        }).catch(error=>ToastAndroid.show(error.message, ToastAndroid.SHORT))
    }

    render() {
        const { t } = this.props;
        const { phone, country } = this.state;
        return (
            <View style={styles.container}>
                <StatusBar barStyle="default" backgroundColor="#000" />
                <Logo style={{ marginTop: px2rem(200) }} />
                <Text style={styles.title}>{t('typePhoneNumber')}</Text>
                <View style={styles.inputBox}>
                    <Picker
                        style={styles.picker}
                        selectedValue={country}
                        onValueChange={this._onPickerChange}>
                        <Picker.Item label="+86" value="86" />
                        <Picker.Item label="+62" value="62" />
                    </Picker>

                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={this._onChange}
                        onBlur={this._onBlur}
                        maxLength={14}
                        placeholder={t('typePhoneNumber')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='phone-pad'
                        underlineColorAndroid='transparent'
                    />
                </View>

                <TouchableOpacity activeOpacity={0.6} onPress={this._onPress} style={styles.btn} >
                    <Button title={t('lognOrRegister')} />
                </TouchableOpacity>
            </View>
        );
    }
}

export default withNamespaces()(AccountStart);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        color: '#333333',
        fontSize: px2rem(36),
        marginTop: px2rem(60),
        marginBottom: px2rem(60)
    },
    inputBox: {
        width: px2rem(650),
        justifyContent: 'center',
        flexDirection: 'row',
        borderBottomWidth: px2rem(1),
        borderBottomColor: '#d7d7d7',
        alignItems: 'center',
    },
    picker: {
        width: px2rem(200),
        height: px2rem(100)
    },
    input: {
        flex: 1
    },
    btn: {
        marginTop: px2rem(140),
    },
});