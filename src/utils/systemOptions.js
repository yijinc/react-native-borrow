import { AsyncStorage } from 'react-native';
import { fetchOptions, fetchProductInfo } from '../api/optionApi';

let _options = [
    {
        categoryID: '', // name === categoryID
        name: '',
        configurationItemDTOList: []
    }
]


export const fetchConfigOptions = async () => {
    try {
        const response = await fetchOptions();
        _options = response.configParentList[0].parentConfigItemList;
        AsyncStorage.setItem('systemConfigOptions', JSON.stringify(_options));
    } catch (error) {
        console.log('获取系统配置失败，尝试从 storage 获取缓存')
        try {
            const data = await AsyncStorage.getItem('systemConfigOptions');
            if(data) {
                _options = JSON.parse(data);
            }
        } catch (error){
            console.log('storage 获取 系统配置 失败！！')
        }
    }
}


let _products = [];

export const fetchProductOptions = async () => {
    try {
        const response = await fetchProductInfo();
        _products = response;
        AsyncStorage.setItem('systemProductInfoOptions', JSON.stringify(_products));
    } catch (error) {
        try {
            const data = await AsyncStorage.getItem('systemProductInfoOptions');
            if(data) {
                _options = JSON.parse(data);
            }
        } catch (error){
        }
    }
}
export const getProductOptions = async () => {
    if(_products.length > 0) {
        return _products
    }
    return await fetchProductInfo();
}


export default fetchSystemOptions = () => {
    fetchConfigOptions();
    fetchProductOptions();
}


/**
 * 
 * @param {string} kye  workInfo-jobType / userInfo-education / userInfo-loanPurpose / ...
 */
export const getConfigOptions = key => _options.find(item=>item.name===key).configurationItemDTOList