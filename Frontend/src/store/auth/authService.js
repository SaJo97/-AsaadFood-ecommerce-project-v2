import axios from "axios";
const port = import.meta.env.VITE_PORT;
const BASE_URL = import.meta.env.MODE === 'development' ? `http://localhost:${port}/` : '/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  // Enable sending cookies with requests for better security
});

const registerUser = async (userData) => {
  try {
    const res = await apiClient.post("api/auth/register", userData);
    return res.data;
  } catch (error) {
    console.log("error")
    throw error;
  }
};

const loginUser = async (userData) => {
  try {
    const res = await apiClient.post("api/auth/login", userData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const logoutUser = async () => {
  try {
    const res = await apiClient.post("api/auth/logout",{}, );
    return res.data;
  } catch (error) {
    throw error;
  }
};

//Forgot Password function - Lägga till i framtiden i Backend & Frontend
const forgotPassword = async (email) => {
  try {
    const res = await apiClient.post("api/auth/forgot-password", { email });
    return res.data;  //  { message: "Reset email sent" })
  } catch (error) {
    throw error;
  }
};

// function to check auth
const checkAuth = async () => {
  try {
    const res = await apiClient.get(`api/auth/me?t=${Date.now()}`);
    // return res.data; // { email, role }
    return res;
  } catch (error) {
    throw error; // Let Redux handle rejection
  }
};

const authService = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  checkAuth,
  apiClient,
};

export default authService;