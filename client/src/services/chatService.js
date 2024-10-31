import api from "../utils/api";

export const getChatMessages = async ({ username, recipient_username }) => {
  const response = await api.get(`/chat/messages/${recipient_username}`);
  return response.data;
};

export const sendChatMessage = async (messageData) => {
  const response = await api.post("/chat/send", messageData);
  return response.data;
};
