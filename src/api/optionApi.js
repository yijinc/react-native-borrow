import axios from './request/axios';


/**
 * GET /sea-gateway/api/v1/configurationItems/parent/{parentCategoryID}/items
 * 根据 parentCategoryID 获取配置项
 * @param {string} parentCategoryID
 */
export function fetchOptions(parentCategoryID='gen-config') {
    return axios.get(`/configurationItems/parent/${parentCategoryID}/items`);
}


/**
 * GET /sea-gateway/api/v1/loan/transaction/product-info
 * 获取贷款产品信息
 */
export function fetchProductInfo() {
    return axios.get('/loan/transaction/product-info');
}


/**
 * GET /sea-gateway/api/v1/provinces/{country}
 * 根据country获取省信息列表
 * @param {string} country
 */
export function getProvinces(country='Indonesia') {
    return axios.get(`/provinces/${country}`);
}


/**
 * GET /sea-gateway/api/v1/citys/{provinceCode}
 * 根据provinceCode获取城市信息列表
 * @param {string} provinceCode
 */
export function getCities(provinceCode='') {
    return axios.get(`/citys/${provinceCode}`);
}


/**
 * GET /sea-gateway/api/v1/districts/{cityCode}
 * 根据cityCode获取区信息列表
 * @param {string} cityCode
 */
export function getDistricts(cityCode='') {
    return axios.get(`/districts/${cityCode}`);
}

/**
 * GET /sea-gateway/api/v1/villages/{districtCode}
 * 根据districtCode获取村信息列表
 * @param {string} districtCode
 */
export function getVillages(districtCode='') {
    return axios.get(`/villages/${districtCode}`);
}