import axios from "axios";

const port = import.meta.env.VITE_PORT;
const BASE_URL = import.meta.env.MODE === 'development' ? `http://localhost:${port}/` : '/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

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
