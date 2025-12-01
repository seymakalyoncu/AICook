import api from './api';

export const addBabySitter = (payload, token) => api.post("/api/babysitters/", payload, {headers: { Authorization: `Bearer ${token}`}});
export const getBabySitterByParent = (parentId, token) => api.get(`/api/babysitters/`, {headers: { Authorization: `Bearer ${token}`}, params: {parentId: parentId}});
export const getBabySitterById = (id, token) => api.get(`/api/babysitters/${id}/`, {headers: { Authorization: `Bearer ${token}`}});
export const updateBabySitter = (id, payload, token) => api.put(`/api/babysitters/${id}/`, payload, {headers: { Authorization: `Bearer ${token}`}});




