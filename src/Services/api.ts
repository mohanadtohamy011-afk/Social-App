import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (!config.baseURL) {
    return Promise.reject(
      new Error("VITE_BASE_URL is not configured. Add it to your Vite environment."),
    );
  }

  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
