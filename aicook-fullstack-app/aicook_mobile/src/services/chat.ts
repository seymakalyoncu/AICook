import api from "./api";

export const sendChatMessage = async (
  message: string,
  token: string
) => {
  return api.post(
    "/api/openai/chat/",
    { prompt: message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
