import axios from "axios";

const port = import.meta.env.VITE_PORT;
const BASE_URL =
  import.meta.env.MODE === "development" ? `http://localhost:${port}/` : "/";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthRoute =
      originalRequest.url.includes("/login") ||
      originalRequest.url.includes("/register") ||
      originalRequest.url.includes("/logout") ||
      originalRequest.url.includes("/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = apiClient.post("/api/auth/refresh");
        }

        await refreshPromise;

        return apiClient(originalRequest);
      } catch (refreshError) {
        await logoutUser();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  },
);
export default apiClient;
