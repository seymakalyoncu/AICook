import api from './api';

export const addSleep = (payload, token) => api.post("/api/sleep_records/", payload, {headers: { Authorization: `Bearer ${token}`}});
export const getSleepByChild = (childId, token) => api.get(`/api/sleep_records/`, {headers: { Authorization: `Bearer ${token}`}, params: {child: childId}});
export const updateSleep = (id, payload, token) => api.put(`/api/sleep_records/${id}/`, payload, {headers: { Authorization: `Bearer ${token}`}});


