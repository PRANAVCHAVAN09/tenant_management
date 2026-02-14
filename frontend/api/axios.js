import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true 
});


// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  async (error) => {

    if (!error.response) return Promise.reject(error);

    const originalRequest = error.config;

    // ignore auth endpoints
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/check") ||
      originalRequest.url.includes("/auth/refresh") ||
      originalRequest.url.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      try {
        await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        return API(originalRequest);

      } catch {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);


export default API;
