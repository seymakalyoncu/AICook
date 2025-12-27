import api from './api';

export const getHistoryCategoryListReport = (user_id, token) => api.get(`/api/reports/history_category/${user_id}/`, {headers: { Authorization: `Bearer ${token}`}})
export const getHistoryDateReport = (user_id, token) => api.get(`/api/reports/history_date/${user_id}/`, {headers: { Authorization: `Bearer ${token}`}})
export const getHistoryIngredientListReport = (user_id, token) => api.get(`/api/reports/history_ingredient/${user_id}/`, {headers: { Authorization: `Bearer ${token}`}})
export const getHistoryRatingListReport = (user_id, token) => api.get(`/api/reports/history_rating/${user_id}/`, {headers: { Authorization: `Bearer ${token}`}})