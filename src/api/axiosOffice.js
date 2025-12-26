import axios from "axios";

const axiosOffice = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

axiosOffice.interceptors.request.use((config) => {
  const token = localStorage.getItem("officeToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosOffice;
