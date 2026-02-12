import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// attach access token in every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// RESPONSE INTERCEPTOR (IMPORTANT PART)
API.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

    // if access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      try {

        const refreshToken = localStorage.getItem("refreshToken");

        // call refresh API
        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        // save new token
        localStorage.setItem("accessToken", newAccessToken);

        // attach new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // retry original request
        return API(originalRequest);

      } catch (refreshError) {

        // refresh failed → logout
        localStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
