import axios from "axios";
const port = import.meta.env.VITE_PORT;
const BASE_URL = import.meta.env.MODE === 'development' ? `http://localhost:${port}/` : '/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  // Enable sending cookies with requests for better security
});

const getAll = async () => {
  try {
    const res = await apiClient.get("api/product");
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getProduct = async (productId) => {
  try {
    const res = await apiClient.get(`api/product/${productId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const createNewProduct = async (productData) => {
  try {
    const res = await apiClient.post(`api/product`, productData);
    // Axios will automatically include the httpOnly cookie in the request
    return res.data;
  } catch (error) {
    throw error;
  }
};

const update = async (product) => {
  try {
    const res = await apiClient.put(`api/product/${product._id}`, product);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (productId) => {
  if (typeof productId !== 'string') {
    throw new Error("Invalid product ID");
  }
  await apiClient.delete(`api/product/${productId}`);
};

const productService = {
  getAll,
  getProduct,
  createNewProduct,
  update,
  deleteProduct,
  apiClient,
};

export default productService;