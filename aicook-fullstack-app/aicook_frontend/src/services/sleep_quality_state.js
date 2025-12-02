import api from './api';

export const getSleepQualityState = () => api.get("/api/sleep_quality_states/");