import api from './api';

export const addEmotional = (payload, token) => api.post("/api/emotional_development_records/", payload, {headers: { Authorization: `Bearer ${token}`}});
export const getEmotionalByChild = (childId, token) => api.get(`/api/emotional_development_records/`, {headers: { Authorization: `Bearer ${token}`}, params: {child: childId}});
export const updateEmotional = (id, payload, token) => api.put(`/api/emotional_development_records/${id}/`, payload, {headers: { Authorization: `Bearer ${token}`}});
