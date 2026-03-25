// src/api/axiosClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://192.168.237.15:8080",
});

// Rutas de auth donde NO queremos redirigir en 401/403
const AUTH_ROUTES = [
  "/api/auth/login",
  "/api/auth/login/verify-otp",
  "/api/auth/first-login",
  "/api/auth/first-login/complete",
];

// ===============================
// Interceptor de REQUEST: meter token
// ===============================
apiClient.interceptors.request.use(
  (config) => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      try {
        const { token } = JSON.parse(saved);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Error leyendo auth de localStorage", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// Interceptor de RESPONSE: manejar 401/403
// ===============================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    const isAuthRoute = AUTH_ROUTES.some((path) => url.includes(path));

    // Solo desloguear/redirigir si:
    //  - es 401 o 403
    //  - NO es una ruta de autenticación (login, otp, first-login)
    if ([401, 403].includes(status) && !isAuthRoute) {
      try {
        localStorage.removeItem("auth");
        localStorage.removeItem("authToken");
        localStorage.removeItem("authRole");
        localStorage.removeItem("authName");
        localStorage.removeItem("authEmail");
      } catch (e) {
        console.error("Error limpiando localStorage", e);
      }

      window.location.href = "/login";
    }

    // Dejamos que el componente que llamó maneje el error
    return Promise.reject(error);
  }
);

export default apiClient;
