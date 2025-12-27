import api from './api';

export const getIngredients = () => {return api.get("/api/ingredients/");};