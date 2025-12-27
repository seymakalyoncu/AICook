import api from "./api";

export const getGender = () => {
  return api.get("/api/gender/");
};
