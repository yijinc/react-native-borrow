import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import px2rem from '../../utils/px2rem';

const blank = ()=>{};

/***
 * RepaymentCodeModal 组件
 * @param  {boolean} visible    显示/隐藏
 * @param  {string} t           i18next.translate
 * @param  {object} r           repayment code info
 * 
*/

export default RepaymentCodeModal = ({visible, r, t, close}) => <Modal
    animationType='none'
    transparent={true}
    visible={visible}
    onRequestClose={blank} >
        <View style={container}>
            <View style={modal}>
                <Text style={title}>{t('repaymentCode')}</Text>
                <Text style={code} selectable={true} >{r.repaymentCode}</Text>
                <Text style={desc}>The repayment code is valid on {r.repayCodeExpiryDate}. Please pay the {r.codeType===1?'ATM':'Convenience store'} offline for repayment.</Text>
                <TouchableOpacity style={btn} activeOpacity={1} onPress={close}>
                    <Text style={btnTxt}>{t('OK')}</Text>
                </TouchableOpacity>
            </View>
        </View>
</Modal>





/**
 * styles
*/
const container = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
}
const modal = {
    width: px2rem(636),
    backgroundColor: '#fff',
    paddingLeft: px2rem(36),
    paddingRight: px2rem(36),
    borderRadius: px2rem(16),
}
const title = {
    fontSize: px2rem(32),
    textAlign: 'center',
    paddingTop: px2rem(40),
    paddingBottom: px2rem(40),
    color: '#333'
}
const code = {
    backgroundColor: '#F5F5F5',
    textAlign: 'center',
    fontSize: px2rem(32),
    marginBottom: px2rem(40),
    paddingTop: px2rem(32),
    paddingBottom: px2rem(32),
    borderRadius: px2rem(10),
}
const desc = {
    color: '#666',
    fontSize: px2rem(26)
}
const btn = {
    marginTop: px2rem(40),
    marginBottom: px2rem(48),
    alignItems: 'center',
}
const btnTxt = {
    color: '#FF5A46',
    fontSize: px2rem(30)
}