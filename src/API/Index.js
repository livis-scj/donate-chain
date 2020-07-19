/**
 * @file API列表
 * @date 2020-07-07
 */
import axios from '../http';

// 管理员登录
export const adminLogin = data => axios.post('/api/donor/adminLogin', data);
// 用户登录
export const userLogin = data => axios.post('/api/donor/login', data);
// 获取捐款人列表
export const getAllDonators = () => axios.get('/api/donor/all');
// 获取捐款列表
export const getDonations = params => axios.get('/api/donate/allDonations', {params});
// 提交捐款
export const submitDonate = data => axios.post('/api/donate/submit', data);
// 获取活动列表
export const getActivity = params => axios.get('/api/activity/query', {params});
// 获取追溯详情
export const getDonateTrace = params => axios.get('/api/donate/queryByDonorCertCode', {params});
// 受捐人登录
export const receiveLogin = data => axios.post('/api/donatory/login', data);
