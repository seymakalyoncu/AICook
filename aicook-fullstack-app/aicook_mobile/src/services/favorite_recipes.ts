import api from "./api";

export const getFavoriteStatus = async (
  recipeId: number,
  token: string
) => {
  const res = await api.get(
    `/api/favorite/status/?recipe_id=${recipeId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.active === 1;
};

export const toggleFavoriteRecipe = async (
  payload: { recipe_id: number },
  token: string
) => {
  const res = await api.post(
    "/api/favorite/toggle/",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getFavoriteList = async (token: string) => {
  const res = await api.get("/api/favorite/list/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
