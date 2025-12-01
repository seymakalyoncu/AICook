import api from './api';

export const getDailyEventTypes = () => api.get("/api/daily_event_types/");