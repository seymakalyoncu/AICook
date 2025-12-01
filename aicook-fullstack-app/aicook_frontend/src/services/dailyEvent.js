import api from './api';

export const addDailyEvent = (payload, token) => api.post("/api/daily_event_records/", payload, {headers: { Authorization: `Bearer ${token}`}});
export const getDailyEventByChild = (childId, token) => api.get(`/api/daily_event_records/`, {headers: { Authorization: `Bearer ${token}`}, params: {child: childId}});
export const updateDailyEvent = (id, payload, token) => api.put(`/api/daily_event_records/${id}/`, payload, {headers: { Authorization: `Bearer ${token}`}});