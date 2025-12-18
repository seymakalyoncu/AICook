import api from "./api";

export const getFavoriteStatus = (recipeId, token) => {return api.get(`/api/favorite/status/?recipe_id=${recipeId}`,{ headers: {Authorization: `Bearer ${token}`,},});};
export const toggleFavoriteRecipe = (payload, token) => {return api.post("/api/favorite/toggle/",payload,{headers: {Authorization: `Bearer ${token}`, },} );};
export const getFavoriteList = (token) =>api.get("/api/favorite/list/",{ headers: { Authorization: `Bearer ${token}` } });

