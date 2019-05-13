import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, StatusBar } from 'react-native';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { ListItem } from '../ListItem';
import px2rem from '../../../utils/px2rem';
import BaseDialog from '../../../component/baseDialog'
import Button from '../../../component/common/Button';
import { logoutRequest } from '../../../store/actions/user';


class Setting extends Component {

    state = {
        modalVisible: false
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', 'Settings'),
        };
    }

    _openDialog = () => this.setState({modalVisible: true})
    _closeDialog = () => this.setState({modalVisible: false})

    _onItemClick = index => {
        switch (index) {
            case 0:
                this.props.navigation.navigate('ChangePassword');
                break;
            case 1:
                this.props.navigation.navigate('About');
                break;
        }
    }

    _exit = () => this.props.logoutRequest()

    render() {
        const { modalVisible } = this.state;
        const { t } = this.props;
        const Items = [
            {
                key: 0,
                title: t('changePassword'),
                icon: <MaterialIcon name='lock-outline' size={px2rem(48)} color='#b6b6b6'/>
            },
            {
                key: 1,
                title: t('aboutDanago'), 
                icon: <MaterialIcon name='info-outline' size={px2rem(48)} color='#b6b6b6'/>
            }
        ]
        return (
            <View style={styles.container}>
                <StatusBar barStyle="default" backgroundColor="#000" />
                <BaseDialog
                    modalVisible={modalVisible}
                    title={t('logoutWarnTitle')}
                    content={t('SignOut')}
                    buttonContent={t('Confirm')}
                    closeTitle={t('Close')}
                    open={this._exit}
                    close={this._closeDialog}
                />
                <View style={{ height: px2rem(30) }} />
                {
                    Items.map( item=> <ListItem item={item} key={item.key} itemClick={this._onItemClick} />)
                }

                {/** 切换语言 内测功能 **/}
                <ListItem item={{
                    key: 0,
                    title: this.props.t('language.set'),
                    icon: <MaterialIcon name='language' size={px2rem(48)} color='#b6b6b6'/>
                }} itemClick={_=> this.props.navigation.push('SetLanguage')} />

                <TouchableOpacity onPress={this._openDialog} style={{ position: 'absolute', bottom: 20 }}>
                    <Button title={t('SignOut')} />
                </TouchableOpacity>
            </View>
        );
    }
}

const select = state => {
  return {

  }
}

export default withNamespaces()(connect(select, {logoutRequest})(Setting));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        alignItems: 'center',
        position: 'relative'
    },
});
