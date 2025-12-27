import api from "./api";

type UploadFile = {
  uri: string;
  name: string;
  type: string;
};

export const uploadFridgePhoto = async (
  file: UploadFile,
  description: string | null,
  token: string
) => {
  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    name: file.name ?? "photo.jpg",
    type: file.type ?? "image/jpeg",
  } as any);

  formData.append("description", description ?? "");

  const res = await api.post(
    "/api/fridge_photos/upload/",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    }
  );

  return res.data;
};

export const getFridgePhotos = async (token: string) => {
  const res = await api.get("/api/fridge_photos/list/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
