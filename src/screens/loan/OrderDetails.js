import React, {Component} from 'react';
import { StyleSheet, Text, View, ToastAndroid } from 'react-native';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import px2rem from '../../utils/px2rem';
import { fetchOrder } from '../../api/orderApi';
import { orderStatus } from '../../utils/loanStatus'


type Props = {
    orderNo: string
}

class OrderDetails extends Component<Props> {

    static defaultProps = {
        orderNo: '',
    }
    state = {
        loan: {}
    }

    componentDidMount() {
        this._fetchOrderDetails()
    }

    _fetchOrderDetails = async () => {
        try {
            const response = await fetchOrder(this.props.orderNo);
            this.setState({
                loan: response
            })
        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }
    }


    render() {
        const { t } = this.props;
        const { loan } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.head}>
                    <Text style={styles.h1}>{loan.createDate && t(orderStatus[loan.status].name)}</Text>
                    { loan.totalRepayAmount && <Text style={styles.h2}>Rp {loan.totalRepayAmount}</Text>}
                </View>
                <View style={styles.info}>
                    <Text style={styles.i1}>{loan.message} </Text>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('loanAmount')}</Text>
                    <Text style={styles.label}>Rp {loan.amount}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>{t('loanPeriod')}</Text>
                    <Text style={styles.label}> {loan.loanLimit} {t('Days')}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>{t('loanDate')}</Text>
                    <Text style={styles.label}>{moment(loan.createDate).format('DD/MM/YYYY')}</Text>
                </View>
                {
                    /** 是否有 【已还金额】 **/
                    // !!loan.repaymentInfoDto.paidAmount && <View style={styles.item}>
                    //     <Text style={styles.label}>已还金额</Text>
                    //     <Text style={styles.label}>Rp </Text>
                    // </View>
                }

                {
                    /** 逾期 显示 **/
                    loan.repaymentInfoDto && loan.repaymentInfoDto.status === 3 && <>
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

            </View>
        );
    }
}

export default withNamespaces()(OrderDetails)

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
});
