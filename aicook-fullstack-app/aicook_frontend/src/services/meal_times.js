import api from './api';

export const getMealTimes = () => api.get("/api/meal_times/");