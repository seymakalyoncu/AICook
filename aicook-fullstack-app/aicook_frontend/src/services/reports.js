import api from './api';

export const getPhysicalListReport = (child_id, token) => api.get(`/api/reports/physical-development/${child_id}/`, {headers: { Authorization: `Bearer ${token}`}})
export const getTotalSleepReport = (child_id, token) => api.get(`/api/reports/total-sleep/${child_id}/`, {headers: { Authorization: `Bearer ${token}`}})
export const getTotalMealNutritiveListReport = (child_id, token) => api.get(`/api/reports/total-meal-nutritive/${child_id}/`, {headers: { Authorization: `Bearer ${token}`}})