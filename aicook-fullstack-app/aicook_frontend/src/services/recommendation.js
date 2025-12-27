import axios from "axios";

export const getDailyRecommendation = (token) => {return axios.get("/api/recommendation/daily/",{headers: {Authorization: `Bearer ${token}`,},});};
