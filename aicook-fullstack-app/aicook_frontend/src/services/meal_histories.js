import api from "./api";

export const getMealHistories = (token) => {return api.get("/api/meal_histories/", {headers: {Authorization: `Bearer ${token}`,},});};
export const addMealHistory = (payload, token) => {return api.post("/api/meal_histories/create/", payload, { headers: {Authorization: `Bearer ${token}`,}, });};
