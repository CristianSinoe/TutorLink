// src/api/axiosClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.100.12:8080",
});

// Interceptor para meter token
apiClient.interceptors.request.use(
  (config) => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const { token } = JSON.parse(saved);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para errores 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if ([401, 403].includes(error?.response?.status)) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
