import apiClient from "../apiClient.js";

const createOrderService = async (orderData) => {
  try {
    const res = await apiClient.post("/api/order", orderData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const fetchOrderService = async () => {
  try {
    const res = await apiClient.get("/api/order");
    return res.data;
  } catch (error) {
    throw error;
  }
};

const fetchOrderByIdService = async (orderId) => {
  try {
    const res = await apiClient.get(`/api/order/${orderId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const orderService = {
  createOrderService,
  fetchOrderService,
  fetchOrderByIdService,
  apiClient,
};

export default orderService;
