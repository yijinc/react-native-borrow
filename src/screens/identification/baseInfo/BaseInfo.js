import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ToastAndroid, NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Picker from 'react-native-picker';
import { is, fromJS, List } from 'immutable';
import px2rem from '../../../utils/px2rem';
import Button, { ActButton } from '../../../component/common/Button';
import selectAddress, { getPickerCommon } from '../../../component/common/AddressPicker';
import { getConfigOptions } from '../../../utils/systemOptions';

const androidContact = NativeModules.AndroidContactModule;

let RearingNumbers = [0, 1, 2, 3, 4];  // 抚养人数 可选
let Residences = [{
    itemKey: '',
    itemValue: ''
}] // 租房状态
let RelationShips = ['朋友', '同事', '亲戚'] // 联系人 关系
let Educations = [];
const formatRelation = key => {
    const r = RelationShips.find(i=>i.itemKey==key);
    return r? r.itemValue : ''
}
const formatResidence = key => {
    const r = Residences.find(i=>i.itemKey==key);
    return r? r.itemValue : ''
}
const formatEducation = key => {
    const r = Educations.find(i=>i.itemKey==key);
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

const defaultContactList = [
    {
        name: '',
        mobile: '',
        relation: '',
        level: 1,
    },
    {
        name: '',
        mobile: '',
        relation: '',
        level: 2,
    }
]

type Props = {
    
}
export default class BaseInfo extends Component<Props> {
    constructor(props) {
        super(props);
        Residences = getConfigOptions('residentialInfo-status');
        RelationShips = getConfigOptions('emergencyInfo-relation');
        Educations = getConfigOptions('userInfo-education')
        this._initState(props.basicInfo, true)
    }

    componentWillReceiveProps(nextProps) {
        if(!is(fromJS(this.props.basicInfo), fromJS(nextProps.basicInfo))) {
            this._initState(nextProps.basicInfo)
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    _initState = (basicInfo, inConstructor=false) => {
        const user = basicInfo || {};
        const state = {
            // accountId: user.accountId || 0,
            userName: user.userName || '',
            idCard: user.idCard || '',
            // mobile: user.mobile || '',
            gender: user.gender || 1,   // 1:男  2:女
            email: user.email || '',
            birthAddress: user.birthAddress || {...defaultAddress},
            address: user.address || {...defaultAddress},
            // birthday: user.birthday || Date.now(),
            contactList: user.contactList || defaultContactList,
            maritalStatus: user.maritalStatus || 1, // 婚姻状态 1:未婚 2:结婚
            motherName: user.motherName || '',
            numberOfDependents: user.numberOfDependents || 0, // 抚养人数
            motherName: user.motherName || '',
            education: user.education || ''
        }
        if(state.contactList.length===1) {
            state.contactList.push(defaultContactList[1])
        }
        if(inConstructor) {
            this.state = state;
        } else {
            this.setState(state)
        }
    }

    _onChangeUserName = userName => this.setState({userName})
    _onChangeIdCard = idCard => this.setState({idCard})
    _setSex = gender => this.setState({gender})
    _onChangeEmail = email => this.setState({email})
    _setMarried = maritalStatus => this.setState({maritalStatus})
    _onChangeRearing = rearing => this.setState({rearing})
    _onChangeMotherName = motherName => this.setState({motherName})
    _onChangeAddress = addressDetail => {
        const address = { ...this.state.address }
        address.address = addressDetail;
        this.setState({address})
    }
    _onChangeAddressZipCode = zipCode => {
        const address = { ...this.state.address }
        address.zipCode = zipCode.replace(/\D+/g, '');
        this.setState({address})
    }
    _onChangeAddressPhone = phone => {
        const address = { ...this.state.address }
        address.phone = phone.replace(/\D+/g, '');
        this.setState({address})
    }

    _openRearingPicker = () => {
        const { numberOfDependents } = this.state;
        Picker.init({
            ...getPickerCommon(),
            pickerData: RearingNumbers,
            selectedValue: [numberOfDependents],
            onPickerConfirm: data => this.setState({numberOfDependents: data[0]})
        });
        Picker.show();
    }

    _openResidencePicker = () => {
        const address = { ...this.state.address }
        Picker.init({
            ...getPickerCommon(),
            pickerData: Residences.map(i=>i.itemValue),
            selectedValue: [formatResidence(address.placeStatus)],
            onPickerConfirm: (data, index) => {
                address.placeStatus = Residences[index[0]].itemKey,
                this.setState({address})
            }
        });
        Picker.show();
    }

    _openEducationPicker = () => {
        let { education } = this.state;
        Picker.init({
            ...getPickerCommon(),
            pickerData: Educations.map(i=>i.itemValue),
            selectedValue: [formatEducation(education)],
            onPickerConfirm: (data, index) => {
                education = Educations[index[0]].itemKey,
                this.setState({education})
            }
        });
        Picker.show();
    }

    _openBirthAddressPicker = () => {
        selectAddress(res => {
            const birthAddress = { ...this.state.birthAddress }
            birthAddress.province = res[0];
            birthAddress.city = res[1];
            birthAddress.district = res[2];
            birthAddress.village = res[3];
            this.setState({birthAddress})
        })
    }

    _openAddressPicker = () => {
        selectAddress( res => {
            const address = { ...this.state.address }
            address.province = res[0];
            address.city = res[1];
            address.district = res[2];
            address.village = res[3];
            this.setState({address})
        })
    }

    _openAddressBook = async index => {
        try {
            const contact = await androidContact.openContact();
            const contactList = List(this.state.contactList).toJS();
            contactList[index].name = contact.name;
            contactList[index].mobile = contact.phone.replace(/\D+/g, '');
            this.setState({contactList})
        } catch(error) {
            console.log(error)
        }
    }

    _onChangeContactName = (name, index) => {
        const contactList = List(this.state.contactList).toJS();
        contactList[index].name = name;
        this.setState({contactList})
    }

    _onChangeContactPhone = (mobile, index) => {
        const contactList = List(this.state.contactList).toJS();
        contactList[index].mobile = mobile.replace(/\D+/g, '');
        this.setState({contactList})
    }

    _onChangeContactRelationShip = index => {
        const contactList = List(this.state.contactList).toJS();
        Picker.init({
            ...getPickerCommon(),
            pickerData: RelationShips.map(i=>i.itemValue),
            selectedValue: [formatRelation(contactList[index].relation)],
            onPickerConfirm: (data, index2) => {
                contactList[index].relation = RelationShips[index2[0]].itemKey,
                this.setState({contactList})
            }
        });
        Picker.show();
    }

    _next = () => {
        const { t } = this.props;
        const {
            userName,
            idCard,
            email,
            birthAddress,
            address,
            contactList,
            motherName,
            education,
        } = this.state;
        if (!userName) {
            ToastAndroid.show(t('NameTip'), ToastAndroid.SHORT);
            return;
        }
        if (!idCard) {
            ToastAndroid.show(t('IDTip'), ToastAndroid.SHORT);
            return;
        }
        if (!email) {
            ToastAndroid.show(t('EmailTip'), ToastAndroid.SHORT);
            return;
        }
        if(education==='') {
            ToastAndroid.show(t('EducationLevelTip'), ToastAndroid.SHORT);
            return;
        }
        if (!birthAddress.province) {
            ToastAndroid.show(t('birthAddressTip'), ToastAndroid.SHORT);
            return;
        }
        if (!address.province) {
            ToastAndroid.show(t('ResidentialAddressTip'), ToastAndroid.SHORT);
            return;
        }
        if (!address.address) {
            ToastAndroid.show(t('ResidentialDetailsAddressTip'), ToastAndroid.SHORT);
            return;
        }
        if (!motherName) {
            ToastAndroid.show(t('MothersNameTip'), ToastAndroid.SHORT);
            return;
        }
        this.props.updateBasicInfo(this.state, error => {
            if(!error) {
                this.props.next();
            } else {
                ToastAndroid.show(error, ToastAndroid.SHORT);
            }
        });
    }

    render() {
        const {
            userName,
            idCard,
            gender,
            email,
            birthAddress,
            address,
            contactList,
            maritalStatus,
            numberOfDependents,
            motherName,
            education
        } = this.state;

        const { basicInfo, t } = this.props;

        return (
            <ScrollView style={styles.container}>
                
                <View style={styles.item}>
                    <Text style={styles.label}>{t('Name')}</Text>
                    <TextInput value={userName} 
                        style={styles.input}
                        onChangeText={this._onChangeUserName}
                        maxLength={30}
                        placeholder={t('NameTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='default'
                        editable={!basicInfo.userName} />
                </View>
                
                <View style={styles.item}>
                    <Text style={styles.label}>{t('ID')}</Text>
                    <TextInput value={idCard}
                        style={styles.input}
                        onChangeText={this._onChangeIdCard}
                        maxLength={20}
                        placeholder={t('IDTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='numeric' 
                        editable={!basicInfo.idCard} />
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('birthAddress')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={this._openBirthAddressPicker} >
                        <Text style={birthAddress.village? styles.label : styles.lightText}>
                            {
                                birthAddress.village? (birthAddress.district + '/' + birthAddress.village) : t('pleaseChoose')
                            }
                        </Text>
                        <Icon name='arrow-right' style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('Gender')}</Text>
                    <View style={styles.touch}>
                        <TouchableOpacity activeOpacity={0.6} onPress={_=>this._setSex(1)}>
                            <ActButton title={t('GenderBoy')} active={gender===1} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} onPress={_=>this._setSex(2)} style={{marginLeft: px2rem(30)}}>
                            <ActButton title={t('GenderGirl')} active={gender===2} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('Email')}</Text>
                    <TextInput value={email} 
                        style={styles.input}
                        onChangeText={this._onChangeEmail}
                        maxLength={50}
                        placeholder={t('EmailTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='email-address'
                     />
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('Marriage')}</Text>
                    <View style={styles.touch}>
                        <TouchableOpacity activeOpacity={0.6} onPress={_=>this._setMarried(2)}>
                            <ActButton title={t('Married')} active={maritalStatus===2} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} onPress={_=>this._setMarried(1)} style={{marginLeft: px2rem(30)}}>
                            <ActButton title={t('Unmarried')} active={maritalStatus===1} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('EducationLevel')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={this._openEducationPicker}>
                        <Text style={education? styles.label : styles.lightText}>{formatEducation(education)||t('pleaseChoose')}</Text>
                        <Icon name='arrow-right' style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('NumberOfDependents')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={this._openRearingPicker}>
                        <Text style={styles.label}>{numberOfDependents}</Text>
                        <Icon name='arrow-right' style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('MothersName')}</Text>
                    <TextInput value={motherName} 
                        style={styles.input}
                        onChangeText={this._onChangeMotherName}
                        maxLength={20}
                        placeholder={t('MothersNameTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='default'
                     />
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('HousingSituation')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={this._openResidencePicker}>
                        <Text style={address.placeStatus? styles.label : styles.lightText}>{formatResidence(address.placeStatus)||t('pleaseChoose')}</Text>
                        <Icon name='arrow-right' style={styles.icon} />
                    </TouchableOpacity>
                    
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('ContactAddress')}</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={this._openAddressPicker}>
                        <Text style={address.village? styles.label : styles.lightText}>
                            {
                                address.village? (address.district + '/' + address.village) : t('pleaseChoose')
                            }
                        </Text>
                        <Icon name='arrow-right' style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.item}>
                    <TextInput value={address.address}
                        style={styles.input}
                        onChangeText={this._onChangeAddress}
                        maxLength={60}
                        placeholder={t('ContactAddressTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='default'
                     />
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('Zipcode')}</Text>
                    <TextInput value={address.zipCode} 
                        style={styles.input}
                        onChangeText={this._onChangeAddressZipCode}
                        maxLength={6}
                        placeholder={t('ZipcodeTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                     />
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>{t('ResidentialContactNumber')}</Text>
                    <TextInput value={address.phone} 
                        style={styles.input}
                        onChangeText={this._onChangeAddressPhone}
                        maxLength={11}
                        placeholder={t('ResidentialContactNumberTip')}
                        placeholderTextColor='#999'
                        underlineColorAndroid='transparent'
                        keyboardType='phone-pad'
                     />
                </View>


                { 
                    contactList.map( (contact, index) => <View key={index}>
                        <View style={[styles.item, {marginTop: px2rem(20)}]}>
                            <Text style={styles.label}>{t('Contact')} {index+1}</Text>
                            <TextInput value={contact.name}
                                style={styles.input}
                                onChangeText={value => this._onChangeContactName(value, index)}
                                maxLength={20}
                                placeholder={t('ContactNameTip')}
                                placeholderTextColor='#999'
                                underlineColorAndroid='transparent'
                                keyboardType='default'
                            />
                            <AntDesign name='contacts' size={px2rem(40)} color='#FF8131' style={{marginLeft: px2rem(10)}} onPress={_=>this._openAddressBook(index)} />
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>{t('Number')}</Text>
                            <TextInput value={contact.mobile}
                                style={styles.input}
                                onChangeText={value => this._onChangeContactPhone(value, index)}
                                maxLength={11}
                                placeholder={t('ContactPhoneTip')}
                                placeholderTextColor='#999'
                                underlineColorAndroid='transparent'
                                keyboardType='phone-pad'
                            />
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>{t('Relationship')}</Text>
                            <TouchableOpacity activeOpacity={1} style={styles.touch} onPress={_=>{this._onChangeContactRelationShip(index)}}>
                                <Text style={contact.relation? styles.label : styles.lightText}>{formatRelation(contact.relation)||t('pleaseChoose')}</Text>
                                <Icon name='arrow-right' style={styles.icon} />
                            </TouchableOpacity>
                        </View>

                    </View>)
                }
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
