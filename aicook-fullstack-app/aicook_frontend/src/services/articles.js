import api from './api';

export const getArticles = () => api.get("/api/articles/");
export const getArticle = (id) => api.get(`/api/articles/${id}/`);
export const createArticle = (data) => api.post("/api/articles/", data);
export const updateArticle = (id, data) => api.put(`/api/articles/${id}/`, data);
export const deleteArticle = (id) => api.delete(`/api/articles/${id}/`);