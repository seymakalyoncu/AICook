import api from './api';

export const addVaccine = (payload, token) => api.post("/api/vaccination_records/", payload, {headers: { Authorization: `Bearer ${token}`}});
export const getVaccineByChild = (childId, token) => api.get(`/api/vaccination_records/`, {headers: { Authorization: `Bearer ${token}`}, params: {child: childId}});
export const updateVaccine = (id, payload, token) => api.put(`/api/vaccination_records/${id}/`, payload, {headers: { Authorization: `Bearer ${token}`}});
