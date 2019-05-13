
/**
 * 全局配置文件
 */

export const baseURL = __DEV__? 'http://api.test.borrowShe.com/api/' : 'https://api.borrowShe.com/api/';

// console.disableYellowBox = true; // 关闭黄屏警告

global.ENV = __DEV__? 'development': 'test'; //
// global.ENV = 'production';

export const getCurrentTime = () => global.appStartTime? global.appStartTime+global.appExperience : -1

/**
 * **************************************************** *
 * **************** global 命名空间 变量说明 ************  *
 * **************************************************** *
 * app 定时器变量
 * @param {number} global.appStartTime       app开始计时 时间戳   must have
 * @param {number} global.appExperience      app计时 时间        must have
 * 
 * 
 * 借用产品 product
 * @param {Object} global.product     
 * 
 * **/