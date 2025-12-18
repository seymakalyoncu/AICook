import api from './api';

export const searchRecipes = (payload) => {return api.post("/api/recipes/search/", payload);
};
