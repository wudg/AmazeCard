import axios from 'axios'; 

/**
 * 请求成功回调
 * @param res 响应结果
 */
export function success(res) {
    return res.data;
}

/**
 * 请求失败回调
 * @param {*} res 响应结果
 */
export function error(res) {
    try {
        let data = res.response.data;
        data['error'] = true;
        return data;
    } catch (e) {
        return {
            error: true,
            code: res.response && res.response.status || null,
            message: '网络异常，请稍后重试',
            timestamp: new Date().getTime()
        };
    }
}

/**
 * 通用的get请求方式
 * @param url 接口地址
 * @param params 参数
 */
export function get({ url, params = {} }) {
    //添加公共请求参数
    params['token'] = localStorage.getItem('token') || '';    // 用户登录的会话标识
    params['_timestamp'] = new Date().getTime();    // 时间戳，禁止请求缓存

  
    return axios.get(url, { params }).then(
        //success callback
        res => success(res)
    ).catch(
        //error callback
        res => error(res)
    );
}
/**
 * 通用的post请求方式
 * @param url 接口地址
 * @param params 参数
 * @param configs 自定义的请求头部信息 
 */
export function post({ url, params = {}, configs = {} }) {
    //添加公共请求参数至url
    url += `?token=${localStorage.getItem('token') || ''}` +
        `&_timestamp=${new Date().getTime()}`;
 

    return axios.post(url, params, configs).then(
        //success callback
        res => success(res)
    ).catch(
        //error callback
        res => error(res)
    );
}