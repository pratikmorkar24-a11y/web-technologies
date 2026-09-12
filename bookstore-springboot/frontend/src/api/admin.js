import api from './client';

export const fetchAdminStats = () => api.get('/admin/stats').then(r => r.data);
export const fetchLowStock = () => api.get('/admin/low-stock').then(r => r.data);
export const fetchAdminBooks = () => api.get('/admin/books').then(r => r.data);
export const fetchAdminOrders = () => api.get('/admin/orders').then(r => r.data);
export const createBook = (data) => api.post('/admin/books', data).then(r => r.data);
export const updateBook = (id, data) => api.put(`/admin/books/${id}`, data).then(r => r.data);
export const deleteBook = (id) => api.delete(`/admin/books/${id}`).then(r => r.data);
export const adjustStock = (id, delta, reason) => api.post(`/admin/books/${id}/stock`, { delta, reason }).then(r => r.data);
