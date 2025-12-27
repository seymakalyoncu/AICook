import api from "./api";

export const uploadFridgePhoto = (file, description, token) => {
  const formData = new FormData();
  formData.append("file", file);

  if (description) {
    formData.append("description", description);
  }

  return api.post(
    "/api/fridge_photos/upload/",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getFridgePhotos = (token) => {return api.get("/api/fridge_photos/list/", {headers: {Authorization: `Bearer ${token}`,},});};
