import api from "./api"; // senin axios instance dosyan

export const analyzeFridgePhoto = async (
  photoId: number,
  token: string
) => {
  const res = await api.get(
    `/api/fridge_photos/analyze-photo/${photoId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
