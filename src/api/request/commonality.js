/**
 * 风控所需要的 公共参数获取
*/

const _commonality = {};

import { NetInfo } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { getCurrentTime } from '../../config';

_commonality.appId = 1;

_commonality.gap = 0;

/**
 * 平台/系统名称
 * iOS: "iOS" on newer iOS devices "iPhone OS" on older devices, including older iPad's.
 * Android: "Android"
*/
_commonality.platform = DeviceInfo.getSystemName()

/**
 * app 版本
 * iOS: "1.0"
 * Android: "1.0
*/
_commonality.version = DeviceInfo.getVersion()

/**
 * 系统版本
 * iOS: "11.0"
 * Android: "7.1.1"
*/
_commonality.systemVersion = DeviceInfo.getSystemVersion()

/**
 * 设备名称 device model
 * iOS: ?
 * Android: "SM-G9500"
*/
_commonality.model = DeviceInfo.getBrand() + ' ' + DeviceInfo.getModel()



/**
 * 获取设备的经纬度
*/
navigator.geolocation.getCurrentPosition( gps => {
    _commonality.longitude = gps.coords.longitude; //经度
    _commonality.latitude = gps.coords.latitude; //纬度
}, error => {
    _commonality.longitude = 0;
    _commonality.latitude = 0;
});





/**
 * 监听 app 网络状态 并更新 networkType/ip/bssid 值
*/
NetInfo.getConnectionInfo().then(handleFirstConnectivityChange);
function handleFirstConnectivityChange(connectionInfo) {
    _commonality.networkType = connectionInfo.effectiveType === 'unknown'? connectionInfo.type: connectionInfo.effectiveType;
    DeviceInfo.getMACAddress().then(mac=>_commonality.macAddress=mac);
    DeviceInfo.getIPAddress().then(ip=>_commonality.ip=ip);
}
NetInfo.addEventListener('connectionChange', handleFirstConnectivityChange);









/**
 * 将 axios.request.config 追加公共参数到 header 中
 * @param {object} config  axios request config
 */
export default configAppendCommonality = config => {
    config.headers.appId = _commonality.appId;
    config.headers.plat = _commonality.platform;
    config.headers.networkType = _commonality.networkType;
    config.headers.channel = _commonality.channel || '';
    config.headers.originalChannel = _commonality.originalChannel || '';
    config.headers.originalChannel = '';
    config.headers.version = _commonality.version;
    config.headers.systemVersion = _commonality.systemVersion;
    config.headers.model = _commonality.model;
    config.headers.gap = _commonality.gap;
    config.headers.lng = _commonality.longitude;
    config.headers.lat = _commonality.latitude;
    config.headers.bssid = _commonality.macAddress;
    config.headers.ip = _commonality.ip;
    config.headers.ts = getCurrentTime(); //加签时间
    config.headers.sysTime = (new Date()).getTime(); //系统时间
    return config;
}