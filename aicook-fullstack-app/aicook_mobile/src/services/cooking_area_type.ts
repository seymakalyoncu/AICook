import api from './api';

export const getCookingAreaType = () => {return api.get("/api/cooking_area_type/");};