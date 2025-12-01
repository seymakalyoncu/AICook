import api from './api';

export const addMeal = (payload, token) => api.post("/api/meal_records/", payload, {headers: { Authorization: `Bearer ${token}`}});
export const getMealsByChild = (childId, token) => api.get(`/api/meal_records/`, {headers: { Authorization: `Bearer ${token}`}, params: {child: childId}});
export const updateMeal = (id, payload, token) => api.put(`/api/meal_records/${id}/`, payload, {headers: { Authorization: `Bearer ${token}`}});
