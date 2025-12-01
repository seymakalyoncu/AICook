import api from './api';

export const getEmotionalState = () => api.get("/api/emotional_states/");