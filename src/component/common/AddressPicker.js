import Picker1 from 'react-native-picker';
import Picker2 from 'react-native-picker';
import Picker3 from 'react-native-picker';
import Picker4 from 'react-native-picker';
import i18n from '../../i18n';
import px2rem from '../../utils/px2rem'

export const pickerCommon = {
    pickerConfirmBtnColor: [255, 255, 255, 1],
    pickerCancelBtnColor: [254, 196, 180, 1],
    pickerTitleColor: [255, 255, 255, 1],
    pickerToolBarBg: [255, 106, 58, 1],
    pickerBg: [255, 255, 255, 1],
    pickerToolBarFontSize: px2rem(32),
    wheelFlex: [1, 0, 0],
    pickerFontSize: px2rem(30),
    pickerFontColor: [51, 51, 51, 1],
    pickerRowHeight: px2rem(50),
    pickerTextEllipsisLen: px2rem(40),
    pickerConfirmBtnText: 'confirm',
    pickerCancelBtnText: 'cancel',
    pickerTitleText: 'please select',
}

export const getPickerCommon = () => {
    return {
        ...pickerCommon,
        pickerConfirmBtnText: i18n.t('Confirm'),
        pickerCancelBtnText: i18n.t('Cancel'),
        pickerTitleText: i18n.t('pleaseSelect'),
    }
}

import { getProvinces,
    getCities,
    getDistricts,
    getVillages,
} from '../../api/optionApi';

let _provinces = [

];
let _cities = [
    
];
let _districts = [
    
];
let _villages = [
    
];

let selected = ['', '', '', ''];

let _callback = null;


async function openCity(provinceCode) {
    try {
        const response = await getCities(provinceCode);
        _cities = response.cityDTOList;
        let pickerData2 = _cities.map(i=>i.name);
        Picker2.init({
            ...getPickerCommon(),
            pickerTitleText: i18n.t('PlsSelectCity'),
            pickerData: pickerData2,
            selectedValue: [pickerData2[0]],
            onPickerConfirm: (data, index) => {
                selected[1] = data[0];
                let code = _cities[index[0]].code;
                openDistrict(code);
            },
        });
        Picker2.show();   
    } catch (error) {

    }
}

async function openDistrict(cityCode) {
    try {
        const response = await getDistricts(cityCode);
        _districts = response.districtDTOList;
        let pickerData3 = _districts.map(i=>i.name);
        Picker3.init({
            ...pickerCommon,
            pickerTitleText: i18n.t('PlsSelectDistrict'),
            pickerData: pickerData3,
            selectedValue: [pickerData3[0]],
            onPickerConfirm: (data, index) => {
                selected[2] = data[0];
                let code = _districts[index[0]].code;
                openVillage(code);
            },
        });
        Picker3.show();   
    } catch (error) {

    }
}

async function openVillage(distritCode) {
    try {
        const response = await getVillages(distritCode);
        _villages = response.villageDTOList;
        let pickerData4 = _villages.map(i=>i.name);
        Picker4.init({
            ...pickerCommon,
            pickerTitleText: i18n.t('PlsSelectVillage'),
            pickerData: pickerData4,
            selectedValue: [pickerData4[0]],
            onPickerConfirm: (data, index) => {
                selected[3] = data[0];
                if(_callback!==null) {
                    _callback(selected);
                    _callback = null;
                }
            },
        });
        Picker4.show();   
    } catch (error) {

    }
}


export default async function selectAddress(callback) {
    try {
        if(_provinces.length === 0) {
            const response = await getProvinces();
            _provinces = response.provinceDTOList;
        }
        let pickerData1 = _provinces.map(i=>i.name);
        Picker1.init({
            ...getPickerCommon(),
            pickerTitleText: i18n.t('PlsSelectProvice'),
            pickerData: pickerData1,
            selectedValue: [pickerData1[0]],
            onPickerConfirm: (data, index) => {
                selected[0] = data[0];
                let code = _provinces[index[0]].code;
                openCity(code);
            },
        });
        _callback = callback;
        Picker1.show();
    } catch (error) {

    }
}