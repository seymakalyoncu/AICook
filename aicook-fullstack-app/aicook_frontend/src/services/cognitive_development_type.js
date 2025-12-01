import api from './api';

export const getCognitiveDevelopmentType = () => api.get("/api/cognitive_development_types/");