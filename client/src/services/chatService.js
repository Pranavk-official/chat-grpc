import api from "../utils/api";

export const getChatMessages = async () => {
  const response = await api.get("/chat/messages");
  return response.data;
};

export const sendChatMessage = async (message) => {
  const response = await api.post("/chat/messages", { message });
  return response.data;
};
