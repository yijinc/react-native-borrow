import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import px2rem from '../../utils/px2rem';
import Button from '../../component/common/Button';



const customStyles = {
    stepIndicatorSize: px2rem(20),
    currentStepIndicatorSize: px2rem(40),
    separatorStrokeWidth: px2rem(6),
    currentStepStrokeWidth: px2rem(2),
    stepStrokeCurrentColor: '#EFEFEF',
    stepStrokeWidth: px2rem(10),
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#333',
    labelSize: px2rem(28),
    currentStepLabelColor: '#999'
}


type Props = {
    loan: Object
}
export default class Applying extends Component<Props> {

    static defaultProps = {
        loan: {},
    };

    state = {
        currentPosition: 2
    }

    _renderStepIndicator = ({position, stepStatus}) => {
        if ( stepStatus === 'current') {
            return <View style={styles.indicator}/>
        }
        return null
    }

    _goIdentification = () => this.props.navigation.navigate('Identification')

    render() {
        const { loan, t } = this.props;
        // status 订单状态:0.未审核,1.审核中,2.审核通过,放款中,3.审核不通过,4.需重填资料,5.放款成功,6.放款失败,7.已完成,8.已取消

        let labels = [t('orderStatus1')];
        if(loan.status === 2) {
            labels = [t('orderStatus2'), t('fundLendingReview')];
        } else if(loan.status === 3) {
            labels = [t('orderStatus3')];
        } else if (loan.status === 4) {
            labels = [t('orderStatus4')];
        } else if (loan.status === 5) {
            labels = [t('orderStatus2'), t('orderStatus5')];
        } else if (loan.status === 6) {
            labels = [t('orderStatus2'), t('orderStatus6')];
        }

        return (
            <View style={styles.container}>
                <View style={styles.head}>
                    <Text style={styles.h1}>{t('loanAmount')}</Text>
                    <Text style={styles.h2}>Rp {loan.amount}</Text>
                </View>
                <View style={styles.info}>
                    <View style={styles.infoItem}>
                        <Text style={styles.i1}>{loan.loanLimit} {t('Days')}</Text>
                        <Text style={styles.i2}>{t('loanPeriod')}</Text>
                    </View>
                    <View style={{height: px2rem(70), backgroundColor: '#fff', width: px2rem(2)}}/>
                    <View style={styles.infoItem}>
                        <Text style={styles.i1}>Rp {loan.totalRepayAmount}</Text>
                        <Text style={styles.i2}>{t('totalRepaymentAmount')}</Text>
                    </View>
                </View>

                <View style={[styles.stepIndicator, {height: labels.length * px2rem(140)}]}>
                    <StepIndicator
                        direction='vertical'
                        stepCount={labels.length}
                        customStyles={customStyles}
                        currentPosition={this.state.currentPosition}
                        labels={labels}
                        renderStepIndicator={this._renderStepIndicator}
                    />
                </View>

                {
                    loan.status === 4 && <TouchableOpacity activeOpacity={0.6} style={styles.btn} onPress={this._goIdentification} >
                        <Button title={t('orderStatus4')} />
                    </TouchableOpacity>
                }

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1, alignItems: 'center', minHeight: Dimensions.get('window').height - 60
    },
    head: {
        width: px2rem(700), height: px2rem(236), borderBottomColor: '#FFFFFF', borderBottomWidth: px2rem(2), alignItems: 'center', justifyContent: 'center'
    },
    h1: {
        fontSize: px2rem(30), color: '#fff'
    },
    h2: {
        fontSize: px2rem(50), color: '#fff', marginTop: px2rem(40),
    },
    info: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: px2rem(130)
    },
    infoItem: {
        width: px2rem(374), alignItems: 'center', justifyContent: 'center'
    },
    i1: {
        color: '#fff', fontSize: px2rem(30)
    },
    i2: {
        color: '#fff', fontSize: px2rem(24)
    },
    stepIndicator: {
        width: px2rem(750), height: px2rem(422), backgroundColor: '#fff', paddingLeft: px2rem(40), alignItems: 'flex-start'
    },
    indicator: {
        width: px2rem(14), height: px2rem(14), borderRadius: px2rem(7), backgroundColor: '#FF6A3A'
    },

    btn: {
        position: 'absolute',
        bottom: px2rem(40)
    }
    
});
