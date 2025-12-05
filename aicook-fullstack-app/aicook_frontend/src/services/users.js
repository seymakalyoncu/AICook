import api from './api';

export const getUser = (token) => api.get("/api/users/", {headers: { Authorization: `Bearer ${token}`}});
export const getUserById = (userId, token) => api.get(`/api/users/${userId}/`, {headers: { Authorization: `Bearer ${token}`}});
export const updateUser = (id, payload, token) => api.put(`/api/users/${id}/`, payload, {headers: { Authorization: `Bearer ${token}`}});