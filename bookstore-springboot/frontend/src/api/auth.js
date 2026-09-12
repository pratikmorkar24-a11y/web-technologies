import api from './client';

export const registerUser = (data) => api.post('/auth/register', data).then(r => r.data);
export const loginUser = (data) => api.post('/auth/login', data).then(r => r.data);
export const logoutUser = () => api.post('/auth/logout').then(r => r.data);
export const fetchCurrentUser = () => api.get('/auth/me').then(r => r.data);

export const checkout = (payload) => api.post('/orders/checkout', payload).then(r => r.data);
export const fetchMyOrders = () => api.get('/orders/my').then(r => r.data);
