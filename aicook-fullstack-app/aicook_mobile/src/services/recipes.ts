import api from "./api";

export const searchRecipes = (payload: any) => {return api.post("/api/recipes/search/", payload);};
