import api from './api';

export const addCognitive = (payload, token) => api.post("/api/cognitive_development_records/", payload, {headers: { Authorization: `Bearer ${token}`}});
export const getCognitiveByChild = (childId, token) => api.get(`/api/cognitive_development_records/`, {headers: { Authorization: `Bearer ${token}`}, params: {child: childId}});
export const updateCognitive = (id, payload, token) => api.put(`/api/cognitive_development_records/${id}/`, payload, {headers: { Authorization: `Bearer ${token}`}});
