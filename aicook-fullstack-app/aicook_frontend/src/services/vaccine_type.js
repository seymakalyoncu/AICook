import api from './api';

export const getVaccineTypes = () => api.get("/api/vaccines/");