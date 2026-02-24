import apiClient from "../apiClient.js";

const sendMessage = async (messageData) => {
  try {
    const res = await apiClient.post("/api/message", messageData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const messageService = {
  sendMessage,
};

export default messageService;
