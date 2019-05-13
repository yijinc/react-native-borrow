import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import px2rem from '../../utils/px2rem';
import Button from '../../component/common/Button';

type Props = {
    goStep: Function,
    completeSteps: array
}
export default class IdentifiedStatus extends Component<Props> {

    _next = () => {
        this.props.next();
    }

    render() {
        const { goStep, completeSteps, t } = this.props;
        return (
            <ScrollView style={styles.container}>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('idCardUpload')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={_=>goStep(1)}>
                        {
                            completeSteps[0]? <Text style={styles.lightText}>{t('Completed')}</Text> : <Text style={styles.unfinish}>{t('Undone')}</Text>
                        }
                        <Icon name='arrow-right' size={px2rem(32)} color='#999' style={{marginLeft: px2rem(20)}} />
                    </TouchableOpacity>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('personalInformation')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={_=>goStep(2)}>
                        {
                            completeSteps[1]? <Text style={styles.lightText}>{t('Completed')}</Text> : <Text style={styles.unfinish}>{t('Undone')}</Text>
                        }
                        <Icon name='arrow-right' size={px2rem(32)} color='#999' style={{marginLeft: px2rem(20)}} />
                    </TouchableOpacity>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('workInfo')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={_=>goStep(3)}>
                        {
                            completeSteps[2]? <Text style={styles.lightText}>{t('Completed')}</Text> : <Text style={styles.unfinish}>{t('Undone')}</Text>
                        }
                        <Icon name='arrow-right' size={px2rem(32)} color='#999' style={{marginLeft: px2rem(20)}} />
                    </TouchableOpacity>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('bankCardInfo')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={_=>goStep(4)}>
                        {
                            completeSteps[3]? <Text style={styles.lightText}>{t('Completed')}</Text> : <Text style={styles.unfinish}>{t('Undone')}</Text>
                        }
                        <Icon name='arrow-right' size={px2rem(32)} color='#999' style={{marginLeft: px2rem(20)}} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity activeOpacity={0.6} style={styles.btn} onPress={this._next} >
                    <Button title={t('submitApplication')} />
                </TouchableOpacity>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: px2rem(750),
        backgroundColor: '#EFEFEF',
    },
    item: {
        flexDirection: 'row',
        height: px2rem(100),
        backgroundColor: '#fff',
        borderBottomColor: '#EFEFEF',
        borderBottomWidth: px2rem(1),
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: px2rem(30),
        paddingRight: px2rem(30),
    },
    label: {
        color: '#333',
        fontSize: px2rem(30)
    },
    lightText: {
        color: '#999',
        fontSize: px2rem(30)
    },
    unfinish: {
        color: '#FF6A3A',
        fontSize: px2rem(30)
    },
    touch: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    btn: {
        marginTop: px2rem(130),
        marginBottom: px2rem(130),
        marginLeft: 'auto',
        marginRight: 'auto',
    }
});
