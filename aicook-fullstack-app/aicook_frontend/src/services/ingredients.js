import api from './api';

export const getIngredients = () => api.get("/api/ingredients/");