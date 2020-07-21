/**
 * @file API列表
 * @date 2020-07-07
 */
import axios from '../http';

// 管理员登录
export const adminLogin = data => axios.post('/api/admin/adminLogin', data);
// 用户登录
export const userLogin = data => axios.post('/api/donor/login', data);
// 捐款人注册
export const regisetrDonator = data => axios.post('/api/donor/register', data);
// 获取捐款人列表
export const getAllDonators = () => axios.get('/api/donor/all');
// 获取捐款列表
export const getDonations = params => axios.get('/api/donate/allDonations', {params});
// 提交捐款
export const submitDonate = data => axios.post('/api/donate/submit', data);

// 获取所有受捐人
export const getDonatory = params => axios.get('/api/donatory/query', {params});
// 获取活动列表
export const getActivity = params => axios.get('/api/activity/query', {params});
// 获取活动详情
export const getActivityDetail = id => axios.get(`/api/activity/detail/${id}`);
// 创建活动
export const submitActivity = data => axios.post('/api/activity/create', data);
// 调拨
export const allocation = (id, token) => axios({
    method: 'POST',
    url: `/api/allocation/execute/${id}`,
    headers: {
        'X-TOKEN': token
    }
});
// 分发
export const submitAssign = (data, token) => axios({
    method: 'POST',
    url: '/api/assign/assign',
    headers: {
        'X-TOKEN': token
    },
    data
});
// 获取追溯详情
export const getDonateTrace = params => axios.get('/api/donate/queryByDonorCertCode', {params});
// 受捐人登录
export const receiveLogin = data => axios.post('/api/donatory/login', data);
// 获取库存余额
export const getDonateStock = token => axios({
    method: 'POST',
    url: '/api/admin/donate/balance',
    headers: {
        'X-TOKEN': token
    }
});
