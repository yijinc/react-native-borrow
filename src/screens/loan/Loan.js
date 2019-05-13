/**
 * Loan Screen  显示订单详情。
 * 包括 Applying:申请中,    Repaying:偿还中,    OrderDetails: 历史(默认)订单详情
*/
import React, {Component} from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, StatusBar, BackHandler } from 'react-native';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import px2rem from '../../utils/px2rem';
import Button from '../../component/common/Button';
import { HeaderLeft } from '../../component/defaultNavigationOptions';
import Applying from './Applying';  // 申请中
import Repaying from './Repaying';  // 偿还中
import OrderDetails from './OrderDetails';  // 历史租赁订单详情

type Props = {
}
class Loan extends Component<Props> {

    constructor(props) {
        super(props);
        props.navigation.setParams({title: props.t('myLoan'), history: props.t('history')})
    }

    static navigationOptions = ({navigation}) => {
        const onBack = _ => navigation.getParam('from')==='LoanConfirm'? navigation.navigate('Home') : navigation.goBack();
        const goHistory = _ => navigation.navigate('LoanHistory')
        return {
            headerLeft: <HeaderLeft onPress={onBack}/>,
            title: navigation.getParam('title'),
            headerRight: <Text onPress={goHistory} style={{color: '#333', marginRight: px2rem(12)}}>{navigation.getParam('history')}</Text>
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        if(this.props.navigation.getParam('from')==='LoanConfirm') {
            this.props.navigation.navigate('Home');
            return true
        }
        return false; //默认返回 return false
    }

    _goHomeScreenn = _ => this.props.navigation.navigate('Home')

    render() {
        const { currentLoan, navigation, t } = this.props;
        const orderNo = navigation.getParam('orderNo', 'Nothing');
        const isNotCurrent = orderNo!=='Nothing' && currentLoan.orderNo!==orderNo ;
        return (
            <ScrollView style={{flex: 1}}>
                <StatusBar barStyle="default" backgroundColor="#000" />
                <LinearGradient colors={['#FF5143', '#ff673b', '#FF8131']} style={styles.headBackground}/>

                {
                    isNotCurrent? <OrderDetails orderNo={orderNo} t={t} />
                    :
                    (
                        currentLoan.status === 5? <Repaying loan={currentLoan} t={t} /> : <Applying loan={currentLoan} t={t} />
                    )
                }

                {
                    /**
                     * 0.未审核,1.审核中,2.审核通过,放款中,3.审核不通过,4.需重填资料,5.放款成功,6.放款失败,7.已完成,8.已取消
                    */
                    !isNotCurrent && 
                    <TouchableOpacity activeOpacity={0.6} style={styles.btn} onPress={this._goHomeScreenn} >
                        <Button title={t('backToHome')} />
                    </TouchableOpacity>
                }
            </ScrollView>
        );
    }
}
const select = state => {
    return {
        currentLoan: state.currentLoan
    }
}

export default withNamespaces()(connect(select)(Loan));


const styles = StyleSheet.create({
    headBackground: {
        height: px2rem(368),
        width: px2rem(750),
        position: 'absolute',
        top: 0,
        left: 0
    },
    btn: {
        marginTop: px2rem(156),
        marginBottom: px2rem(60),
        marginLeft: 'auto',
        marginRight: 'auto',
    },
});
