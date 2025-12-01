import api from './api';

export const addChild = (payload, token) => api.post("/api/children/", payload, {headers: { Authorization: `Bearer ${token}`}});
export const getChildrenByParent = (parentId, token) => api.get(`/api/children/`, {headers: { Authorization: `Bearer ${token}`}, params: {parentId: parentId}});
export const updateChild = (id, payload, token) => api.put(`/api/children/${id}/`, payload, {headers: { Authorization: `Bearer ${token}`}});
