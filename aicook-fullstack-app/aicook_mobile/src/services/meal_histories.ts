import api from "./api";

export const getMealHistories = async (token: string) => {
  const res = await api.get("/api/meal_histories/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const addMealHistory = async (
  payload: any,
  token: string
) => {
  const res = await api.post(
    "/api/meal_histories/create/",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
