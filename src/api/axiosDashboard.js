import axios from "axios";

const axiosDashboard = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
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
    // Only redirect on 401 (Unauthorized) - not on 403 (Forbidden)
    // 403 means user is authenticated but doesn't have permission for that specific action
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem("adminToken");
      localStorage.removeItem("officeToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("officeUser");
      
      // Redirect based on current path
      const currentPath = window.location.pathname;
      if (currentPath.includes("/admin") || currentPath.includes("/dashboard")) {
        window.location.href = "/admin-login";
      } else if (currentPath.includes("/office")) {
        window.location.href = "/office-login";
      }
    }
    // For 403 errors, just reject the promise - let components handle the error
    return Promise.reject(error);
  }
);

export default axiosDashboard;