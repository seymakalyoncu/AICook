import api from './api';

export const getChildPercentile = (childId, token) => api.get(`/api/child/${childId}/percentile/`, {headers: { Authorization: `Bearer ${token}` }});
export const getMealRecommendation = (childId, token) => api.get(`/api/child/${childId}/meal-recommendation/`, {headers: { Authorization: `Bearer ${token}` }});
export const getChildPrediction = (childId, token) => api.post(`/api/child/${childId}/writing-prediction/`, {}, {headers: { Authorization: `Bearer ${token}` }});

