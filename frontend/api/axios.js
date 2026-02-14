import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



API.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

  
    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      try {

        const refreshToken = localStorage.getItem("refreshToken");

   
        const res = await axios.post(`
          ${VITE_API_URL}/refresh`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

       
        localStorage.setItem("accessToken", newAccessToken);

    
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    
        return API(originalRequest);

      } catch (refreshError) {


        localStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default API;