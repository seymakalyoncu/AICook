import api from './api';

export const getParent = (token) => api.get("/api/parents/", {headers: { Authorization: `Bearer ${token}`}});
export const getParentById = (parentId, token) => api.get(`/api/parents/${parentId}/`, {headers: { Authorization: `Bearer ${token}`}});
export const updateParent = (id, payload, token) => api.put(`/api/parents/${id}/`, payload, {headers: { Authorization: `Bearer ${token}`}});