import api from './client';

export const fetchBooks = (params) => api.get('/books', { params }).then(r => r.data);
export const fetchFeatured = (limit = 6) => api.get('/books/featured', { params: { limit } }).then(r => r.data);
export const fetchBookById = (id) => api.get(`/books/${id}`).then(r => r.data);
export const fetchBooksLookup = (ids) => api.get('/books/lookup', { params: { ids: ids.join(',') } }).then(r => r.data);
export const fetchGenres = () => api.get('/genres').then(r => r.data);
export const fetchAuthors = () => api.get('/authors').then(r => r.data);
