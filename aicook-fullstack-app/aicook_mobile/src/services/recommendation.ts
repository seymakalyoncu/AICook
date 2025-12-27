import api from "./api";

export const getDailyRecommendation = async (token: string) => {
  const res = await api.get("/api/recommendation/daily/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
