import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import moment from 'moment';
import px2rem from '../../utils/px2rem';
import Button from '../../component/common/Button';
import { fetchRepaymentCode } from '../../api/orderApi';
import { getCurrentTime } from '../../config';
import RepaymentCodeModal from './RepaymentCodeModal'


type Props = {
    loan: Object,
    requestCurrentLoan: Function
}

export default class Applying extends Component<Props> {

    state = {
        visible: false,
        repayment: {

        }
    }
    static defaultProps = {
        loan: {},
    }

    _repay = codeType => {
        // codeType 偿还码类型:1.银行卡;2.便利店 ,
        const { loan } = this.props;
        fetchRepaymentCode(loan.orderNo, codeType).then(repayment => {
            this.setState({
                repayment: {
                    ...repayment,
                    repayCodeExpiryDate: moment(repayment.repayCodeExpiryDate).format('DD/MM/YYYY'),
                },
                visible: true
            })
        }).catch(error => ToastAndroid.show(error.message, ToastAndroid.SHORT))
    }

    _repay1 = _ => this._repay(1)  // 银行ATM偿还
    _repay2 = _ => this._repay(2)  // 便利店偿还

    _closeModal = _ => {
        this.setState({visible: false}, this.props.requestCurrentLoan);
    }

    _formatrepayCodeExpiryDate = expire => {
        const { t } = this.props;
        if(this.props.loan.repaymentInfoDto.codeType===1) {
            // 银行卡 atm 偿还 不会过期
            return ''
        }
        const expireTime = (new Date(moment(expire))).getTime();
        const duration = expireTime - getCurrentTime();  // 偿还码一般为6小时  duration = 6 * 60 * 60 * 1000；
        if(duration <= 0) {
            return `(${t('expired')})`
        } else if (duration > 3600000) {
            return `(Expires after ${Math.ceil(duration/3600000)} hours)`
        } else {
            return `(Expires after ${Math.ceil(duration/60000)} minutes)`
        }
    }

    render() {
        const { loan, t } = this.props;
        // status 订单状态:0.未审核,1.审核中,2.审核通过,放款中,3.审核不通过,4.需重填资料,5.放款成功,6.放款失败,7.已完成,8.已取消
        const { visible, repayment } = this.state;
        return (
            <View style={styles.container}>
                <RepaymentCodeModal visible={visible} r={repayment} t={t} close={this._closeModal} />
                <View style={styles.head}>
                    <Text style={styles.h1}>{t('amountToBeRepaid')}</Text>
                    <Text style={styles.h2}>Rp {loan.repaymentInfoDto.repayAmount}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.i1}>{t('repaymentDate')}  {moment(loan.repaymentInfoDto.repaymentDate).format('DD/MM/YYYY')}</Text>
                </View>

                {
                    /** 是否有 【偿还码】 **/
                    !!loan.repaymentInfoDto.repaymentCode && <View style={[styles.item, {marginTop: px2rem(20)}]}>
                        <Text style={styles.label}>{t('repaymentCode')} {this._formatrepayCodeExpiryDate(loan.repaymentInfoDto.repayCodeExpiryDate)}</Text>
                        <Text style={styles.label} selectable={true}>{loan.repaymentInfoDto.repaymentCode}</Text>
                    </View>
                }

                <View style={styles.item}>
                    <Text style={styles.label}>{t('loanAmount')}</Text>
                    <Text style={styles.label}>Rp {loan.amount}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>{t('loanPeriod')}</Text>
                    <Text style={styles.label}>{loan.loanLimit} {t('Days')}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>{t('loanDate')}</Text>
                    <Text style={styles.label}>{moment(loan.createDate).format('DD/MM/YYYY')}</Text>
                </View>
                {
                    /** 是否有 【已还金额】 **/
                    !!loan.repaymentInfoDto.paidAmount && <View style={styles.item}>
                        <Text style={styles.label}>{t('amountAlreadyPaid')}</Text>
                        <Text style={styles.label}>Rp {loan.repaymentInfoDto.paidAmount}</Text>
                    </View>
                }

                {
                    /** 逾期 显示 **/
                    loan.repaymentInfoDto.status === 3 && <>
                        <View style={[styles.item, {marginTop: px2rem(20)}]}>
                            <Text style={styles.label}>{t('daysOverdue')}</Text>
                            <Text style={styles.label}>{loan.repaymentInfoDto.dueDays}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>{t('overdueFine')}</Text>
                            <Text style={styles.label}>Rp {loan.repaymentInfoDto.fineAmount}</Text>
                        </View>
                    </>
                }

                {
                    /*************************** 未偿还 ***************************/
                    (loan.repaymentInfoDto.status===0 || loan.repaymentInfoDto.status===3) && <>
                    <TouchableOpacity activeOpacity={0.6} style={[styles.btn, {marginTop: px2rem(60)}]} onPress={this._repay1} >
                        <Button title={t('toATMRepayment')} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.6} style={[styles.btn, {marginBottom: px2rem(40)}]} onPress={this._repay2} >
                        <Button title={t('toStoreRepayment')} color='blue' />
                    </TouchableOpacity>
                </>
                }

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    i1: {
        fontSize: px2rem(24), color: '#fff'
    },


    item: {
        flexDirection: 'row',
        width: px2rem(750),
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
        color: '#333', fontSize: px2rem(30)
    },

    btn: {
        marginTop: px2rem(30),
    }
    

    
});
