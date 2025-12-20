import api from "./api";

export const uploadFridgePhoto = (file, description, token) => {
  const formData = new FormData();
  formData.append("file", file);

  if (description) {
    formData.append("description", description);
  }

  return api.post(
    "/api/fridge-photos/upload/",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
