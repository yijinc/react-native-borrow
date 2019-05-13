/**
 * LoanHistory Screen
 * */ 
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, Image } from 'react-native';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import px2rem from '../../utils/px2rem';
import { requestHistoryLoans } from '../../store/actions/loan';
import { orderStatus } from '../../utils/loanStatus';
import Loading from '../../component/Loading';


const ListHeaderComponent = <View style={{height: px2rem(24)}} />
const ListEmptyComponent = t => <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: px2rem(100)}}>
    <Image style={{width: px2rem(294), height: px2rem(234)}} source={require('../../assets/images/order.png')} />
    <Text style={{fontSize: px2rem(30), color: '#333', marginTop: px2rem(60)}}>{t('noRecords')}</Text>
</View>
const getItemLayout = (data, index) => ({length: px2rem(284), offset: px2rem(284) * index, index})

class LoanHistory extends Component {
    constructor(props) {
        super(props);
        props.requestHistoryLoans();
        props.navigation.setParams({title: props.t('MyLoanRecord')})
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
        };
    };

    _renderItem = ({ item }) => {
        const { t } = this.props;
        const status = orderStatus[item.status];
        return (
            <View style={styles.itemWrap}>
                <TouchableOpacity activeOpacity={1} onPress={_=>this._goLoanOrderDetails(item.orderNo)} style={styles.item}>
                    <View style={styles.head}>
                        <Text style={{ fontSize: px2rem(48) }}>{'Rp ' + (item.totalRepayAmount || item.amount)}</Text>
                        <Text style={{ fontSize: px2rem(30), color: '#999999' }}>{t('loanAmount')}</Text>
                        <Text style={[styles.label, { color: status.color, borderColor: status.color }]}>{t(status.name)}</Text>
                    </View>
                    <View style={{ marginTop: px2rem(34), backgroundColor: '#ebebeb', height: px2rem(1) }} />
                    <View style={styles.bottom}>
                        <Text style={styles.bottomText}>{t('applicationTime')} : {item.createDate}</Text>
                        <SimpleLineIcon name='arrow-right' size={px2rem(24)} color='#C1C1C1'/>
                    </View>
                </TouchableOpacity>
            </View>)
    }

    _loadMore = () => {
        const { historyLoan } = this.props;
        if(historyLoan.page*historyLoan.pageSize >= historyLoan.total) {
            return;
        }
        this.props.requestHistoryLoans(historyLoan.page+1)
    }

    _goLoanOrderDetails = orderNo => {
        this.props.navigation.push('Loan', {
            orderNo
        })
    }

    _renderListFooter = () => {
        const { historyLoan, t } = this.props;
        if(historyLoan.total > 0 && historyLoan.page*historyLoan.pageSize >= historyLoan.total) {
            return <Text style={{textAlign: 'center', marginBottom: px2rem(24), fontSize: px2rem(24)}}>{t('allLoaded')}</Text>
        }
        return null;
    }

    render() {
        const { historyLoan, t } = this.props;
        return (<View style={styles.container}>
                <StatusBar barStyle="default" backgroundColor="#000" />
                <Loading visible={historyLoan.list.length===0 && historyLoan.isFetching} />
                <FlatList
                    data={historyLoan.list}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.1}
                    refreshing={historyLoan.isFetching}
                    onEndReached={this._loadMore}
                    ListHeaderComponent={ListHeaderComponent}
                    ListEmptyComponent={historyLoan.isFetching? null: ListEmptyComponent(t)}
                    ListFooterComponent={this._renderListFooter}
                    keyExtractor={item=>item.orderNo}
                    getItemLayout={getItemLayout}
                />
            </View>)
    }
}

const select = state => {
    return {
        historyLoan: state.historyLoan
    }
}
export default withNamespaces()(connect(select, {requestHistoryLoans})(LoanHistory));

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemWrap: {
        width: px2rem(750),
        marginBottom: px2rem(30),
        alignItems: 'center'
    },
    item: {
        position: 'relative',
        borderRadius: px2rem(10),
        width: px2rem(690),
        height: px2rem(254),
        backgroundColor: '#fff'
    },
    head: {
        position: 'relative',
        paddingLeft: px2rem(30),
        paddingTop: px2rem(30)
    },
    bottom: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: px2rem(30),
        paddingLeft: px2rem(30),
        justifyContent: 'space-between',
    },
    bottomText: {
        fontSize: px2rem(28),
        color: '#333'
    },
    label: {
        position: 'absolute',
        fontSize: px2rem(24),
        top: px2rem(40),
        right: px2rem(30),
        borderColor: '#3AA1FF',
        borderWidth: px2rem(1),
        borderRadius: px2rem(50),
        minWidth: px2rem(172),
        paddingTop: px2rem(6),
        paddingBottom: px2rem(6),
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
