import axios from "axios";

const port = import.meta.env.VITE_PORT;
const BASE_URL =
  import.meta.env.MODE === "development" ? `http://localhost:${port}/` : "/";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// let isRefreshing = false;
// let refreshPromise = null;

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (!originalRequest) {
//       return Promise.reject(error);
//     }

//     const isAuthRoute =
//       originalRequest.url.includes("/login") ||
//       originalRequest.url.includes("/register") ||
//       originalRequest.url.includes("/logout") ||
//       originalRequest.url.includes("/refresh");

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !isAuthRoute
//     ) {
//       originalRequest._retry = true;

//       try {
//         if (!isRefreshing) {
//           isRefreshing = true;
//           refreshPromise = apiClient.get("/api/auth/refresh");
//         }

//         const refreshResponse = await refreshPromise;
//         console.log("REFRESH SUCCESS", refreshResponse.status);
//         isRefreshing = false;

//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         console.log("REFRESH FAILED", refreshError.response?.status);
//         isRefreshing = false;
//         await logoutUser()
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

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
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try { // fixa
        // await apiClient.get("/api/auth/refresh");
        const refreshRes = await apiClient.get("/api/auth/refresh");

        // Small delay ensures browser applies cookie
        // await new Promise(res => setTimeout(res, 100));

        // Update the original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${refreshRes.data.accessToken}`;

        processQueue(null);

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
export default apiClient;
