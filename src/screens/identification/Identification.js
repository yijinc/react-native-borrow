import React, {Component} from 'react';
import { StyleSheet, Text, View, StatusBar, ProgressBarAndroid, ToastAndroid} from 'react-native';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import Loading from '../../component/Loading';
import { HeaderLeft } from '../../component/defaultNavigationOptions';
import px2rem from '../../utils/px2rem';
import { orderReAudit } from '../../api/orderApi';
import { requestCurrentLoan } from '../../store/actions/loan';
import { requestUserInfo, updateBasicInfo, updateCompanyInfo, updateBankCardInfo } from '../../store/actions/user';

import IdentifiedStatus from './IdentifiedStatus';
import IdCardUpload from './idCardUpload/IdCardUpload';
import BaseInfo from './baseInfo/BaseInfo';
import WorkInfo from './workInfo/WorkInfo';
import BankInfo from './bankInfo/BankInfo';


type Props = {};
class Identification extends Component<Props> {

    static navigationOptions = {
        header: null
    }

    state = {
        /**
         * step === 0 : 'IdentifiedStatus'
         * step === 1 : 'idCardUpload'
         * step === 2 : 'baseInfo'     
         * step === 3 : 'workInfo'
         * step === 4 : 'bankInfo'
         * **/ 
        step: 0,
        reAuditting: false,  // 当前订单审核失败需要重填信息，再次提交
    }

    constructor(props) {
        super(props);
        const {
            photoComplete,
            basicInfoDto,
            companyDto,
            accountCardDto,
        } = props.userInfo;
        // init 直接进入 step 1 
        if (photoComplete===false && !basicInfoDto.complete && !companyDto.complete && !accountCardDto.complete ) {
            this.state.step = 1;
        } else {
            this.state.step = 0;
        }
    }

    StepsTitle = [
        this.props.t('viewProgress'),
        this.props.t('idCardUpload'),
        this.props.t('personalInformation'),
        this.props.t('workInfo'),
        this.props.t('bankCardInfo'),
    ];

    _goBack = () => {
        const { step } = this.state;
        if (step <= 1) {
            this.props.navigation.goBack();
            return;
        }
        this.setState({
            step: step-1
        })
    }

    _next = () => {
        const { step } = this.state;
        if (step > 4) {
            return; // 非法
        }
        this.props.requestUserInfo(); //必须，merge更新的数据
        this.setState({
            step: step+1
        })
    }

    _startLoan = ()=> {
        const { step } = this.state;
        const { navigation, requestUserInfo, userInfo, currentLoan, requestCurrentLoan, t } = this.props;
        const {
            photoComplete,
            basicInfoDto,
            companyDto,
            accountCardDto,
        } = userInfo;
        if (step !== 0) {
            requestUserInfo(); //必须，merge更新的数据
        }
        if(photoComplete && basicInfoDto.complete && companyDto.complete && accountCardDto.complete) {
            if(currentLoan.hasCurrentLoan && currentLoan.status===4) {
                /**
                 * 存在当前失败订单 status===4 需重填资料, 再次提交
                */
                this.setState({reAuditting: true})
                orderReAudit(currentLoan.orderNo).then(res => {
                    this.setState({reAuditting: false});
                    if(res.result==='SUCCESS') {
                        requestCurrentLoan();
                        navigation.navigate('Loan');
                    } else {
                        ToastAndroid.show(res.message, ToastAndroid.SHORT);
                    }
                }).catch(error=>{
                    this.setState({reAuditting: false})
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                })
            } else {
                navigation.navigate('LoanConfirm');
            }
        } else {
            ToastAndroid.show(t('informationNotCompleted'), ToastAndroid.SHORT);
            if(step !== 0) {
                this._goStep(0)
            }
        }
    }

    _renderStep = i => {
        const { userInfo, updateBasicInfo, updateCompanyInfo, updateBankCardInfo, t } = this.props;
        const { photoComplete, basicInfoDto, companyDto, accountCardDto } = userInfo;
        switch (i) {
            case 0 : return <IdentifiedStatus 
                next={this._startLoan}
                goStep={this._goStep} t={t}
                completeSteps={[photoComplete, basicInfoDto.complete, companyDto.complete, accountCardDto.complete]}
            />;
            case 1 : return <IdCardUpload 
                next={this._next} t={t}
                photoComplete={photoComplete}
            />;
            case 2 : return <BaseInfo
                next={this._next} t={t}
                basicInfo={basicInfoDto}
                updateBasicInfo={updateBasicInfo}
            />;
            case 3 : return <WorkInfo
                next={this._next} t={t}
                companyInfo={companyDto}
                updateCompanyInfo={updateCompanyInfo}
            />;
            case 4 : return <BankInfo
                next={this._startLoan} t={t}
                accountCard={accountCardDto}
                updateBankCardInfo={updateBankCardInfo}
            />
            default: return null;
        }
    }

    _goStep = step => this.setState({step})

    render() {
        const { userInfo } = this.props;
        const { step, reAuditting } = this.state;
        return (
            <View style={styles.container}>
                <Loading visible={userInfo.userInfoUpdating!==''||reAuditting} />
                <StatusBar barStyle="default" backgroundColor="#000" />
                <View style={styles.header}>
                    <View style={{width: 56+16}}><HeaderLeft onPress={this._goBack}/></View>
                    <Text style={styles.title}>{this.StepsTitle[step]}</Text>
                </View>
                <ProgressBarAndroid
                    style={styles.progressBar}
                    color='#FF6A3A'
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={step/4} />
                {
                    this._renderStep(step)
                }
            </View>
        );
    }
}

const select = state => {
    return {
        userInfo: state.userInfo,
        currentLoan: state.currentLoan
    }
}


export default withNamespaces()(connect(select, {
    requestUserInfo,
    updateBasicInfo,
    updateCompanyInfo,
    updateBankCardInfo,
    requestCurrentLoan,
})(Identification));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    /**
     * 以下 header与title 要与 defaultNavigationOptions 相同
     * **/
    header: {
        height: 56,
        flexDirection: 'row',
        position: 'relative',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        flex: 1,
        fontSize: px2rem(36),
        color: '#333',
    },
    progressBar: {
        width: px2rem(750),
        marginTop: -6,
    }
    
});
