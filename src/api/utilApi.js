import axios from './request/axios';

/**
 * GET /sea-gateway/api/v1/uc/time/currentTimeStamp
 * 获取服务器当前时间戳(非精确，缓存时间，误差为1s
 */
export function fetchcurrentTimeStamp() {
    return axios.get('/uc/time/currentTimeStamp')
}