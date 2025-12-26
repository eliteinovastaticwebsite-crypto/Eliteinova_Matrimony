import axios from "axios";

const axiosDashboard = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081",
});

axiosDashboard.interceptors.request.use((config) => {
  // Try admin token first, then office token
  const adminToken = localStorage.getItem("adminToken");
  const officeToken = localStorage.getItem("officeToken");
  const token = adminToken || officeToken;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
axiosDashboard.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear tokens and redirect to login
      localStorage.removeItem("adminToken");
      localStorage.removeItem("officeToken");
      localStorage.removeItem("adminUser");
      
      // Redirect based on current path
      const currentPath = window.location.pathname;
      if (currentPath.includes("/admin")) {
        window.location.href = "/admin/login";
      } else if (currentPath.includes("/office")) {
        window.location.href = "/office/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosDashboard;