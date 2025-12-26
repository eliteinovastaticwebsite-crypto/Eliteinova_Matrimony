import axios from "axios";

const axiosAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

axiosAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAdmin;
