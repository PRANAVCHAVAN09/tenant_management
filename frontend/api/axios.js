import axios from "axios";
import { showLoader, hideLoader } from "../services/loaderService";

// create API instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});



API.interceptors.request.use(
  (config) => {

    

    showLoader();

    


    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    

    return config;
  },
  (error) => {
    hideLoader();
    
    return Promise.reject(error);
  }
);



API.interceptors.response.use(
  (response) => {
    hideLoader();
    return response;
  },

  async (error) => {

    hideLoader();

    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    // Skip refresh for login/register/refresh
    const isAuthRoute =
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/refresh");

    if (error.response.status === 401 && !originalRequest._retry && !isAuthRoute) {

      originalRequest._retry = true;

      try {

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          localStorage.clear();
          return Promise.reject(error);
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);

      } catch (refreshError) {
        localStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
