import api from "./api";

export const sendChatMessage = (message, token) => {return api.post("/api/openai/chat/",{ prompt: message },{headers: {Authorization: `Bearer ${token}`}});};
