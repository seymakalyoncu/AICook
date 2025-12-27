import api from "./api";

export const getTimeType = () => { return api.get("/api/time_type/");};
