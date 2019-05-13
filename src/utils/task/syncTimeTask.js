import BackgroundTimer from 'react-native-background-timer';
import { refreshToken } from '../../api/request/axios';
import { fetchcurrentTimeStamp } from '../../api/utilApi';

global.appStartTime = 0;
global.appExperience = 0;


const INTERVAL = 1000;                      // 1 秒 定时器
const AUTO_REFRESH_TOKEN = 30 * 60 * 1000;  // 30分钟自动刷新token

/**
 * 同步服务器时间 必须
 * 因程序需要计算时间，导致时间定时器随着时间的增长，会与实际时间越来越慢
 * 开发模式下，大约10分钟 慢了1分钟（华为 Hisilicon Kirin 659）， 后端验签时间相差5分钟 拒绝
 * 所以 SYNC_SERVER_TIME 建议不能小于 50分钟
*/
const SYNC_SERVER_TIME = 5 * 60 * 1000;

const updateServerTime = async () => {
    try {
        global.appStartTime = await fetchcurrentTimeStamp();
        global.appExperience = 0;
    }catch(error) {
        console.log('系统初始化 获取服务器时间失败', error)
    }
}

const _timekeeping = _ => {
    let newTime = global.appExperience + INTERVAL;
    if(newTime >= AUTO_REFRESH_TOKEN) {
        refreshToken()
    } else if(newTime >= SYNC_SERVER_TIME) {
        updateServerTime();
    } else {
        global.appExperience = newTime;
    }
}

BackgroundTimer.runBackgroundTimer(_timekeeping, INTERVAL);