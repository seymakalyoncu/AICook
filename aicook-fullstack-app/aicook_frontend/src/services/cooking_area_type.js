import api from './api';

export const getCookingAreaType = () => api.get("/api/cooking_area_type/");