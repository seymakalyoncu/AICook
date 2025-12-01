import api from './api';

export const addIllness = (payload, token) => api.post("/api/health_records/", payload, {headers: { Authorization: `Bearer ${token}`}});
export const getIllnessByChild = (childId, token) => api.get(`/api/health_records/`, {headers: { Authorization: `Bearer ${token}`}, params: {child: childId}});
export const updateIllness = (id, payload, token) => api.put(`/api/health_records/${id}/`, payload, {headers: { Authorization: `Bearer ${token}`}});