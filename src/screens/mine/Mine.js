import React, { Component } from 'react';
import { StyleSheet, Text, View, Linking, StatusBar, Picker } from 'react-native';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import px2rem from '../../utils/px2rem'
import BaseDialog from '../../component/baseDialog'
import LinearGradient from 'react-native-linear-gradient';
import { ListItem } from './ListItem';


const servicePhone = '021-5059-8882'

class Mine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
    }

    static navigationOptions = {
        header: null,
        headerMode: 'none',
    }

    _renderItem = item => <ListItem key={item.key} item={item} itemClick={this.itemClick} />

    /**
     * 拨打客服电话 显示/关闭
    */
    _showDialog = _ =>  this.setState({ modalVisible: true })
    _closeDialog = _ => this.setState({modalVisible: false })

    _callPhone = _ => Linking.openURL(`tel:${servicePhone}`)

    itemClick = key => {
        const { navigation, t } = this.props;
        switch (key) {
            case 0:
                navigation.navigate('LoanHistory');
                break;
            case 1:
                navigation.navigate('MyBankCard')
                break;
            case 2:
                this._showDialog();
                break;
            case 3:
                navigation.navigate('Setting', {'title': t('Settings')})
                break;
            default: break;
        }
    }

    render() {
        const { t } = this.props;
        const userInfo = this.props.userInfo.basicInfoDto;
        const mobile = userInfo.mobile || '';
        const menuList = [
            {
                key: 0,
                title: t('MyLoanRecord'),
                icon: <Icon name='format-list-bulleted' size={px2rem(48)} color='#b6b6b6' />
            }, 
            {
                key: 1,
                title: t('MyBankCard'),
                icon: <AntDesign name='creditcard' size={px2rem(40)} color='#b6b6b6' />
            }, 
            {
                key: 2,
                title: t('Help'),
                icon: <AntDesign name='customerservice' size={px2rem(40)} color='#b6b6b6' />
            }, 
            {
                key: 3,
                title: t('Settings'),
                icon: <AntDesign name='setting' size={px2rem(40)} color='#b6b6b6' />
            }
        ]

        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#FF5143" />
                <BaseDialog
                    modalVisible={this.state.modalVisible}
                    title={t('Prompt')}
                    content={`${t('Tel')}: ${servicePhone}`}
                    buttonContent={t('Call')}
                    closeTitle={t('Close')}
                    close={this._closeDialog}
                    open={this._callPhone}
                />
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FF5143', '#ff673b', '#FF8131']} style={styles.head}>
                    <Text style={styles.phoneNumber}>{mobile ? mobile.substr(0, 3) + '****' + mobile.substr(mobile.length - 4, 4) : ''}</Text>
                    <View style={styles.nameBorder}>
                        <Text style={{ color: '#fff', fontSize: px2rem(30) }}>{t('realNameCertification') + userInfo.valid}</Text>
                    </View>
                </LinearGradient>
                {menuList.map(this._renderItem)}
                <View style={{flex: 1, backgroundColor: '#fff'}}/>
            </View>
        );
    }
}

const select = state => {
    return {
      userInfo: state.userInfo
    }
}

export default withNamespaces()(connect(select)(Mine));

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    head: {
        height: px2rem(400),
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },

    phoneNumber: {
        color: '#fff',
        fontSize: px2rem(48),
        marginBottom: px2rem(40)
    },

    item: {
        height: px2rem(75),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: px2rem(30),
        paddingRight: px2rem(30),
        backgroundColor: '#ffffff',
        borderBottomColor: '#bfbfbf',
        borderBottomWidth: px2rem(2),
    },

    next: {
        width: px2rem(13),
        height: px2rem(26),
    },

    nameBorder: {
        width: px2rem(450),
        height: px2rem(78),
        borderRadius: px2rem(40),
        borderColor: '#fff',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }

});
