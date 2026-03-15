import apiClient from "../apiClient.js";

const registerUser = async (userData) => {
  try {
    const res = await apiClient.post("/api/auth/register", userData);
    startSilentRefresh();
    return res.data;
  } catch (error) {
    console.log("error");
    throw error;
  }
};

const loginUser = async (userData) => {
  try {
    const res = await apiClient.post("/api/auth/login", userData);
    startSilentRefresh();
    return res.data;
  } catch (error) {
    throw error;
  }
};

const logoutUser = async () => {
  try {
    const res = await apiClient.post("/api/auth/logout", {});
    stopSilentRefresh();
    return res.data;
  } catch (error) {
    throw error;
  }
};

//Forgot Password function - Lägga till i framtiden i Backend & Frontend
const forgotPassword = async (email) => {
  try {
    const res = await apiClient.post("/api/auth/forgot-password", { email });
    return res.data; //  { message: "Reset email sent" })
  } catch (error) {
    throw error;
  }
};

// function to check auth
const checkAuth = async () => {
  try {
    const res = await apiClient.get(`/api/auth/me?t=${Date.now()}`);
    // return res.data; // { email, role }
    startSilentRefresh();
    return res.data;
  } catch (error) {
    throw error; // Let Redux handle rejection
  }
};

let refreshTimeout = null;

const startSilentRefresh = () => {
  const REFRESH_TIME = 13 * 60 * 1000; // 13 minutes

  if (refreshTimeout) clearTimeout(refreshTimeout);

  const refreshFn = async () => {
    try {
      await apiClient.post("/api/auth/refresh");
      console.log("Silent refresh success");
    } catch (err) {
      console.log("Silent refresh failed");
      await logoutUser(); // logout if refresh fails
    } finally {
      // Schedule next refresh
      refreshTimeout = setTimeout(refreshFn, REFRESH_TIME);
    }
  };

  refreshTimeout = setTimeout(refreshFn, REFRESH_TIME);
};

const stopSilentRefresh = () => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
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
