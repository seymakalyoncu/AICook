import api from './api';

export const getDiseaseTypes = () => api.get("/api/disease_types/");