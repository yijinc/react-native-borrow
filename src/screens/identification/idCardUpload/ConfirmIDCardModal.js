import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import px2rem from '../../../utils/px2rem';

const blank = ()=>{};

/***
 * ConfirmIDCardMadal 组件
 * @param  {boolean} visible    显示/隐藏
 * @param  {string} t           i18next.translate
 * @param  {object} info           id card info
 * 
*/

export default ConfirmIDCardMadal = ({visible, info, close, open, t}) => <Modal
    animationType='none'
    transparent={true}
    visible={visible}
    onRequestClose={blank} >
        <View style={styles.container}>
            <View style={styles.modal}>
                <Text style={styles.title}>{t('idCard.confirm')}</Text>
                <View style={styles.body}>
                    <Text style={styles.bodyText}>{t('Name')}: {info.userName}</Text>
                    <Text style={styles.bodyText}>{t('ID')}: {info.idCard}</Text>
                    <Text style={styles.bodyText}>{t('Gender')}: {info.gender===1?'Boy':'Girl'}</Text>
                    <Text style={styles.bodyText}>{t('dateOfBirth')}: {info.birthDay}</Text>
                    <Text style={styles.bodyText}>{t('birthAddress')}: {info.birthAddress}</Text>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity activeOpacity={1} onPress={close}>
                        <Text style={{color: '#FF6A3A'}}>{t('Confirm')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={open}>
                        <Text>{t('Reselect')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
</Modal>





/**
 * styles
*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modal: {
        width: px2rem(636),
        backgroundColor: '#fff',
        borderRadius: px2rem(16),
    },
    title: {
        width: px2rem(636),
        borderTopLeftRadius: px2rem(16),
        borderTopRightRadius: px2rem(16),
        backgroundColor: '#FF6A3A',
        color: '#fff',
        fontSize: px2rem(32),
        textAlign: 'center',
        paddingTop: px2rem(50),
        paddingBottom: px2rem(50),
        paddingLeft: px2rem(60),
        paddingRight: px2rem(60)
    },
    body: {
        paddingLeft: px2rem(100),
        paddingTop: px2rem(50)
    },
    bodyText: {
        fontSize: px2rem(32),
        color: '#333',
        paddingBottom: px2rem(24)
    },
    footer: {
        paddingLeft: px2rem(100),
        paddingRight: px2rem(100),
        color: '#333',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: px2rem(30),
        paddingTop: px2rem(30),
        paddingBottom: px2rem(50)
    }
})