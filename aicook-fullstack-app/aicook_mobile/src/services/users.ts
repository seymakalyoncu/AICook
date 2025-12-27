import api from "./api";

export const getUser = async (token: string) => {
  const res = await api.get("/api/users/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getUserById = async (
  userId: number | string,
  token: string
) => {
  const res = await api.get(`/api/users/${userId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateUser = async (
  userId: number,
  data: any,
  token: string
) => {
  return api.patch(`/api/users/${userId}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
