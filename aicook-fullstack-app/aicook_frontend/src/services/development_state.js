import api from './api';

export const getDevelopmentState = () => api.get("/api/development_states/");