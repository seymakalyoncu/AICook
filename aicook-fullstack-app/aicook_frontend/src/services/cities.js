import api from './api';

export const getCities = () => api.get("/api/cities/");
