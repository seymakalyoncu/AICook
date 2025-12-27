import axios from "axios";

export const analyzeFridgePhoto = (photoId, token) => {
  return axios.get(
    `/api/fridge_photos/analyze-photo/${photoId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
