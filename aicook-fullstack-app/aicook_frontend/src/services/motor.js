import api from './api';

export const addMotor = (payload, token) => api.post("/api/motor_development_records/", payload, {headers: { Authorization: `Bearer ${token}`}});
export const getMotorByChild = (childId, token) => api.get(`/api/motor_development_records/`, {headers: { Authorization: `Bearer ${token}`}, params: {child: childId}});
export const updateMotor = (id, payload, token) => api.put(`/api/motor_development_records/${id}/`, payload, {headers: { Authorization: `Bearer ${token}`}});

