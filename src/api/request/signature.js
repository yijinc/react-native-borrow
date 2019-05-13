import md5 from 'js-md5';
import { getCurrentTime } from '../../config';

/**
 * 加签
 * @param {object} config  axios request config
 */
export default signature = config => {

    const urlData = config.url.split('?');
    const url = urlData[0];
    let params =  urlData[1] || '';

    let signStr = params;
    if(config.method === 'post' && config.data) {
        if(!(config.data instanceof FormData)) {
            signStr = signStr + `${signStr===''? '' : '&' }body=${JSON.stringify(config.data)}`
        }
    }
    const ts = `ts=${getCurrentTime()}`;
    params = `${params===''? '' : params+'&' }${ts}`
    signStr = `${signStr===''? '' : signStr+'&' }${ts}`
    config.url = `${url}?${params}&sign=${encodeURIComponent(md5.base64(signStr))}`
    return config;
}