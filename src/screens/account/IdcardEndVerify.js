import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid, Dimensions } from 'react-native';
import { withNamespaces } from 'react-i18next';
import px2rem from '../../utils/px2rem';
import { getIdCardNoTailCode } from '../../api/userApi';
import Button from '../../component/common/Button';

class IdcardEndVerify extends Component {

    timer = null;

    state = {
        phone: this.props.navigation.getParam('phone') || '',
        idcardEndNum: '',
        codeSecond: 0
    }

    constructor(props) {
        super(props);
        props.navigation.setParams({title: props.t('safetyCertificate')})
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _onChangeVerifyCode = idcardEndNum => {
        this.setState({ idcardEndNum })
    }

    _submit = () => {
        const { t } = this.props;
        const { idcardEndNum, phone } = this.state;
        if (idcardEndNum.length < 6) {
            ToastAndroid.show(t('safetyCertificateTip'), ToastAndroid.SHORT);
            return;
        }


        getIdCardNoTailCode(phone.replace(/\D+/g, ''), idcardEndNum).then(verify => {
            if (verify) {
                this.props.navigation.push('ForgetPassword', {
                    phone: phone
                });
            } else {
                ToastAndroid.show(t('inputError'), ToastAndroid.SHORT)
            }
        }).catch(error => ToastAndroid.show(error.message, ToastAndroid.SHORT))
    }

    render() {
        const { t } = this.props;
        const { idcardEndNum } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{t('safetyCertificateDesc')}</Text>
                <View style={styles.codeInput}>
                    <TextInput
                        style={{ flex: 1, textAlign: 'center' }}
                        value={idcardEndNum}
                        onChangeText={this._onChangeVerifyCode}
                        keyboardType='numeric'
                        maxLength={6} />
                </View>

                <TouchableOpacity style={styles.btn} activeOpacity={0.6} onPress={this._submit}>
                    <Button title={t('Next')} />
                </TouchableOpacity>
            </View>
        );
    }
}

export default withNamespaces()(IdcardEndVerify);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: px2rem(60)
    },
    text: {
        textAlign: 'left',
        color: '#333333',
        margin: px2rem(30),
        fontSize: px2rem(34),
        lineHeight: px2rem(76)
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
        marginTop: Dimensions.get('window').height - px2rem(732)  // 计算高度 
    }

});