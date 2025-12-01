import api from './api';

export const addPhysical = (payload, token) => api.post("/api/physical_development_records/", payload, {headers: { Authorization: `Bearer ${token}`}});
export const getPhysicalByChild = (childId, token) => api.get(`/api/physical_development_records/`, {headers: { Authorization: `Bearer ${token}`}, params: {child: childId}});
export const updatePhysical = (id, payload, token) => api.put(`/api/physical_development_records/${id}/`, payload, {headers: { Authorization: `Bearer ${token}`}});