import api from "./api";

/* 📊 Kategori Bazlı Yemek Raporu */
export const getHistoryCategoryListReport = async (
  userId: number,
  token: string
) => {
  const res = await api.get(
    `/api/reports/history_category/${userId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* 📅 Tarih Bazlı Yemek Raporu */
export const getHistoryDateReport = async (
  userId: number,
  token: string
) => {
  const res = await api.get(
    `/api/reports/history_date/${userId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* 🧄 Malzeme Bazlı Rapor */
export const getHistoryIngredientListReport = async (
  userId: number,
  token: string
) => {
  const res = await api.get(
    `/api/reports/history_ingredient/${userId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* ⭐ Puan Bazlı Rapor */
export const getHistoryRatingListReport = async (
  userId: number,
  token: string
) => {
  const res = await api.get(
    `/api/reports/history_rating/${userId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
