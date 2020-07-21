/**
 * @file http.js
 * @author zhangzhicheng
 * @date 2019-04-12
 */

import axios from 'axios';
import {Notification} from 'element-ui';

// 请求拦截
axios.interceptors.request.use(config => {
    return config;
}, error => Promise.reject(error));

// 响应拦截
axios.interceptors.response.use(response => {
    return response.data;
}, error => {
    const {
        response: {
            status,
            data
        }
    } = error;
    Notification.error({
        title: '请求错误',
        dangerouslyUseHTMLString: true,
        message: `<div><span style = "color: red" > ${status} </span> : ${data.path} </div>`
    });
    return Promise.reject(error);
});

export default axios;
