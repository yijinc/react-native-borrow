import axios from './request/axios';


/**
 * POST /sea-loan-service/api/v1/account/basic-info/create
 * 保存用户基本信息接口
 * @param {Object} data
 */
export function updateBasicInfo(data) {
    return axios.post('/account/basic-info/create', data)
}




/**
 * POST /sea-loan-service/api/v1/account/bind/card
 * 保存用户银行卡信息接口.
 * @param {Object} data
 */
export function bindBankCard(data) {
    return axios.post('/account/bind/card', data)
}




/**
 * POST /sea-loan-service/api/v1/account/company-info/create
 * 保存用户工作信息接口
 * @param {Object} data
 */
export function updateCompanyInfo(data) {
    return axios.post('/account/company-info/create', data)
}




/**
 * POST /sea-gateway/api/v1/account/image/upload
 * 上传用户身份证图片接口
 * @param {number} photoType 0:正面照，1：背面照：2手持照
 * @param {File} uri
 */
export function uploadImage(uri, photoType=0, fileName='fileName') {
    let formData = new FormData();
    let file = { uri: uri, type: 'multipart/form-data', name: fileName }; //这里的key(uri和type和name)不能改变
    formData.append("imageFile", file);
    return axios.post('/account/image/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'photoType': photoType
        }
    })
}