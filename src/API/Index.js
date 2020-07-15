/**
 * @file API列表
 * @date 2020-07-07
 */
import axios from '../http';

export const adminLogin = data => axios.post('/api/donor/adminLogin', data);

export const userLogin = data => axios.post('/api/donor/login', data);

export const getAllDonators = () => axios.get('/api/donor/all');

export const getDonations = params => axios.get('/api/donate/allDonations', {params});

export const submitDonate = data => axios.post('/api/donate/submit', data);

export const getActivity = params => axios.get('/api/activity/query', {params});
