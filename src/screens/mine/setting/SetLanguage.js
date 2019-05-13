import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { withNamespaces } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { changeLanguage } from '../../../i18n'

class SetLanguage extends Component {
    constructor(props) {
        super(props);
        props.navigation.setParams({title: props.t('language.set')})
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
        };
    }

    _setLanguage = async lng => {
        const { navigation, t } = this.props;
        try {
            await changeLanguage(lng);
            navigation.navigate('Setting', {'title': t('Settings')})
        } catch(error) {
            console.log(error)
        }
    }

    _setLanguageEN = _ => this._setLanguage('en')
    _setLanguageZH = _ => this._setLanguage('zh')

    render() {
        const { t, lng } = this.props;
        console.log(this.props)
        return (
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={1} onPress={this._setLanguageEN}>
                    <View style={styles.item}>
                        <Text>{t('language.en')}</Text>
                        { lng==='en' && <Icon name='check' size={20} color='#999'/> }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={this._setLanguageZH}>
                    <View style={styles.item}>
                        <Text>{t('language.zh')}</Text>
                        { lng==='zh' && <Icon name='check' size={20} color='#999'/> }
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default withNamespaces()(SetLanguage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 2,
    },
    item: {
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        marginBottom: 1,
    }
})