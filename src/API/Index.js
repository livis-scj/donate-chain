/**
 * @file API列表
 * @date 2020-07-07
 */
import axios from '../http';

export const submitDonate = data => axios.post('/api/donate/submit', data);
