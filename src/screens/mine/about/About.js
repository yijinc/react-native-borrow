import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withNamespaces } from 'react-i18next';
import AppLogo from '../../../component/common/AppLogo';
import px2rem from '../../../utils/px2rem';

class About extends Component {
    constructor(props) {
        super(props);
        props.navigation.setParams({title: props.t('aboutDanago')})
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
        };
    }

    render() {
        const { t } = this.props;
        return (
            <View style={styles.container}>
                <AppLogo />
                <Text style={styles.desc}>{t('VersionNumber')}（v1.0.1）</Text>
            </View>
        );
    }
}

export default withNamespaces()(About);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    desc: {
        color: '#333333', fontSize: px2rem(28), marginTop: px2rem(20)
    }
});
