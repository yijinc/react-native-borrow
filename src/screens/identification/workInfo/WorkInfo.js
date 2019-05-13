import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ToastAndroid, TextInput, DatePickerAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Picker from 'react-native-picker';
import { is, fromJS } from 'immutable';
import px2rem from '../../../utils/px2rem';
import { toString } from '../../../utils/utils';
import Button from '../../../component/common/Button';
import { getConfigOptions } from '../../../utils/systemOptions';
import selectAddress, { getPickerCommon } from '../../../component/common/AddressPicker';


let IndustryFields = ['金融', '保险', '计算机' ];  // 公司领域
let JobTypes = [];
let JobPositions = [];

const formatValue = (arr, key) => {
    const r = arr.find(i=>i.itemKey===key);
    return r? r.itemValue : ''
}

const defaultAddress = {
    province: '', 
    city: '',
    district: '',
    village: '', // 村
    address: '', // 详细地址
    placeStatus: '1', // 住房状态 birthAdress不必填
    phone: '', // 住宅电话
    staySince: '',  // 开始居住时间,非必填,家庭住址必填
    zipCode: '', // 邮编
}

const defaultContact = {
    name: '',
    mobile: '',
    relation: '0',
    level: 1,
}


type Props = {
}
export default class WorkInfo extends Component<Props> {
    constructor(props) {
        super(props);
        IndustryFields = getConfigOptions('workInfo-occupationIndustry');
        JobPositions = getConfigOptions('workInfo-jobPosition');
        JobTypes = getConfigOptions('workInfo-jobType');
        this._initState(props.companyInfo, true)
    }

    componentWillReceiveProps(nextProps) {
        if(!is(fromJS(this.props.companyInfo), fromJS(nextProps.companyInfo))) {
            this._initState(nextProps.companyInfo)
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    _initState = (companyInfo, inConstructor=false) => {
        const company = companyInfo || {};
        const state = {
            companyName: company.companyName || '',                     // 公司名称
            // companyScale: company.companyScale || '',                   // 公司规模
            companyAddress: company.companyAddress || defaultAddress,   // 公司地址
            contact: company.contact || defaultContact,                 // 联系人对象
            jobPosition: toString(company.jobPosition),                     // 职位名称
            jobType: toString(company.jobType),                             // 职位类型
            monthlyIncome: toString(company.monthlyIncome),                 // 月收入
            occupationIndustry: toString(company.occupationIndustry),       // 行业领域
            workStartDay: company.workStartDay || '',                   // 入职时长
        }
        if(inConstructor) {
            this.state = state;
        } else {
            this.setState(state)
        }
    }

    _onChangeCompanyName = companyName => this.setState({companyName})
    _onChangeMonthlyIncome = monthlyIncome => this.setState({monthlyIncome: monthlyIncome.replace(/\D+/g, '')})
    _onChangeContactName = name => {
        const contact = { ...this.state.contact };
        contact.name = name;
        this.setState({contact})
    }
    _onChangeContactMobile = mobile => {
        const contact = { ...this.state.contact };
        contact.mobile = mobile.replace(/\D+/g, '');
        this.setState({contact})
    }

    // 公司领域选择
    _openIndustry = () => {
        const { occupationIndustry } = this.state;
        Picker.init({
            ...getPickerCommon(),
            pickerData: IndustryFields.map(i=>i.itemValue),
            selectedValue: [formatValue(IndustryFields, occupationIndustry)],
            onPickerConfirm: (data, index) => this.setState({occupationIndustry: IndustryFields[index[0]].itemKey})
        });
        Picker.show();
    }

    // 职位类型
    _openJobType = () => {
        const { jobType } = this.state;
        Picker.init({
            ...getPickerCommon(),
            pickerData: JobTypes.map(i=>i.itemValue),
            selectedValue: [formatValue(JobTypes, jobType)],
            onPickerConfirm: (data, index) => this.setState({jobType: JobTypes[index[0]].itemKey})
        });
        Picker.show();
    }

    // 职位名称
    _openJobPosition = () => {
        const { jobPosition } = this.state;
        Picker.init({
            ...getPickerCommon(),
            pickerData: JobPositions.map(i=>i.itemValue),
            selectedValue: [formatValue(JobPositions, jobPosition)],
            onPickerConfirm: (data, index) => this.setState({jobPosition: JobPositions[index[0]].itemKey})
        });
        Picker.show();
    }

    _openDatePicker = async () => {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
                date: new Date()
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
                // console.log(action, year, month, day)
                this.setState({
                    workStartDay: year+'-'+(month+1)+'-'+day
                })
            }
          } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }

    _openAddressPicker = () => {
        selectAddress( res => {
            const companyAddress = { ...this.state.companyAddress }
            companyAddress.province = res[0];
            companyAddress.city = res[1];
            companyAddress.district = res[2];
            companyAddress.village = res[3];
            this.setState({companyAddress})
        })
    }
    _onChangeAddress = addressDetail => {
        const companyAddress = { ...this.state.companyAddress }
        companyAddress.address = addressDetail;
        this.setState({companyAddress})
    }
    _onChangeAddressZipCode = zipCode => {
        const companyAddress = { ...this.state.companyAddress }
        companyAddress.zipCode = zipCode.replace(/\D+/g, '');
        this.setState({companyAddress})
    }
    _onChangeAddressPhone = phone => {
        const companyAddress = { ...this.state.companyAddress }
        companyAddress.phone = phone.replace(/\D+/g, '');
        this.setState({companyAddress})
    }

    _next = () => {
        const { t } = this.props;
        const {
            companyName,
            companyAddress,
            contact,
            jobPosition,
            jobType,
            monthlyIncome,
            occupationIndustry,
            workStartDay
        } = this.state;

        if(!companyName) {
            ToastAndroid.show(t('CompanyNameTip'), ToastAndroid.SHORT); return;
        }
        if(!occupationIndustry) {
            ToastAndroid.show(t('CompanyFieldTip'), ToastAndroid.SHORT); return;
        }
        if(!jobType) {
            ToastAndroid.show(t('TypeOfJobsTip'), ToastAndroid.SHORT); return;
        }
        if(!jobPosition) {
            ToastAndroid.show(t('PositionNameTip'), ToastAndroid.SHORT); return;
        }
        if(!monthlyIncome) {
            ToastAndroid.show(t('MonthlyIncomeTip'), ToastAndroid.SHORT); return;
        }
        if(!workStartDay) {
            ToastAndroid.show(t('DateOfEntryTip'), ToastAndroid.SHORT); return;
        }
        if(!companyAddress.province) {
            ToastAndroid.show(t('CompanyAddressTip'), ToastAndroid.SHORT); return;
        }
        if(!companyAddress.address) {
            ToastAndroid.show(t('CompanyDetailAddressTip'), ToastAndroid.SHORT); return;
        }
        if(!companyAddress.zipCode) {
            ToastAndroid.show(t('CompanyZipcodeTip'), ToastAndroid.SHORT); return;
        }
        if(!companyAddress.phone) {
            ToastAndroid.show(t('CompanyTelephoneTip'), ToastAndroid.SHORT); return;
        }
        if(!contact.name) {
            ToastAndroid.show(t('CompanyContactTip'), ToastAndroid.SHORT); return;
        }
        if(!contact.mobile) {
            ToastAndroid.show(t('CompanyContactNumberTip'), ToastAndroid.SHORT); return;
        }

        this.props.updateCompanyInfo(this.state, err => {
            if(!err){
                this.props.next();
            } else {
                ToastAndroid.show(err, ToastAndroid.SHORT);
            }
        })
    }

    render() {
        const { t } = this.props;
        const {
            companyName,
            companyAddress,
            contact,
            jobPosition,
            jobType,
            monthlyIncome,
            occupationIndustry,
            workStartDay
        } = this.state;
        return (
            <ScrollView style={styles.container}>
                
                <View style={styles.item}>
                    <Text style={styles.label}>{t('CompanyName')}</Text>
                    <TextInput value={companyName} 
                        style={styles.input}
                        onChangeText={this._onChangeCompanyName}
                        maxLength={50}
                        placeholder={t('CompanyNameTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                     />
                </View>
                
                <View style={styles.item}>
                    <Text style={styles.label}>{t('CompanyField')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={this._openIndustry}>
                        <Text style={occupationIndustry? styles.label : styles.lightText}>{formatValue(IndustryFields, occupationIndustry)||t('pleaseChoose')}</Text>
                        <Icon name='arrow-right' style={styles.icon} />
                    </TouchableOpacity>
                </View>



                <View style={[styles.item, {marginTop: px2rem(20)}]}>
                    <Text style={styles.label}>{t('TypeOfJobs')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={this._openJobType}>
                        <Text style={jobType? styles.label : styles.lightText}>{formatValue(JobTypes, jobType)||t('pleaseChoose')}</Text>
                        <Icon name='arrow-right' style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>{t('PositionName')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={this._openJobPosition}>
                        <Text style={jobPosition? styles.label : styles.lightText}>{formatValue(JobPositions, jobPosition)||t('pleaseChoose')}</Text>
                        <Icon name='arrow-right' style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>{t('MonthlyIncome')}</Text>
                    <TextInput value={monthlyIncome} 
                        style={styles.input}
                        onChangeText={this._onChangeMonthlyIncome}
                        maxLength={8}
                        placeholder={t('MonthlyIncomeTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                     />
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>{t('DateOfEntry')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={this._openDatePicker}>
                        <Text style={workStartDay? styles.label : styles.lightText}>{workStartDay?workStartDay:t('DateOfEntryTip')}</Text>
                        <Icon name='arrow-right' style={styles.icon} />
                    </TouchableOpacity>
                </View>
                


                <View style={[styles.item, {marginTop: px2rem(20)}]}>
                    <Text style={styles.label}>{t('CompanyAddress')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={this._openAddressPicker}>
                        <Text style={companyAddress.village? styles.label : styles.lightText}>
                            {
                                companyAddress.village? (companyAddress.district + '/' + companyAddress.village) : t('pleaseChoose')
                            }
                        </Text>
                        <Icon name='arrow-right' style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.item}>
                    <TextInput value={companyAddress.address}
                        style={styles.input}
                        onChangeText={this._onChangeAddress}
                        maxLength={60}
                        placeholder={t('CompanyDetailAddressTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='default'
                     />
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('CompanyZipcode')}</Text>
                    <TextInput value={companyAddress.zipCode} 
                        style={styles.input}
                        onChangeText={this._onChangeAddressZipCode}
                        maxLength={6}
                        placeholder={t('CompanyZipcodeTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                     />
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('CompanyTelephone')}</Text>
                    <TextInput value={companyAddress.phone} 
                        style={styles.input}
                        onChangeText={this._onChangeAddressPhone}
                        maxLength={11}
                        placeholder={t('CompanyTelephoneTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='phone-pad'
                     />
                </View>


                <View style={[styles.item, {marginTop: px2rem(20)}]}>
                    <Text style={styles.label}>{t('CompanyContact')}</Text>
                    <TextInput value={contact.name} 
                        style={styles.input}
                        onChangeText={this._onChangeContactName}
                        maxLength={20}
                        placeholder={t('CompanyContactTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                    />
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>{t('CompanyContactNumber')}</Text>
                    <TextInput value={contact.mobile} 
                        style={styles.input}
                        onChangeText={this._onChangeContactMobile}
                        maxLength={11}
                        placeholder={t('CompanyContactNumberTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='phone-pad'
                    />
                </View>

                <TouchableOpacity activeOpacity={0.6} style={styles.nextBtn} onPress={this._next} >
                    <Button title={t('Next')} />
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
    touch: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    input: {
        textAlign: 'right',
        flex: 1
    },
    nextBtn: {
        marginTop: px2rem(130),
        marginBottom: px2rem(130),
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    icon: {
        color: '#999',
        fontSize: px2rem(28),
        marginLeft: px2rem(16),
        textAlignVertical: 'center'
    }
});
