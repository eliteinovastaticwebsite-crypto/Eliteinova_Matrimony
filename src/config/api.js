// API Configuration - Centralized API URL management
const getApiBaseUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development fallback
  if (import.meta.env.DEV) {
    return 'http://localhost:8080';
  }
  
  // Production fallback - should be set via environment variable
  return window.location.origin;
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Helper function to build file URLs
export const buildFileUrl = (filePath) => {
  if (!filePath) return '';
  
  // If already a full URL, return as is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  // Remove leading slash if present
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  
  // Build the full URL
  return `${API_BASE_URL}/${cleanPath}`;
};

// Helper function to build image URLs
export const buildImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Check if it's already a full path
  if (cleanPath.startsWith('api/files/')) {
    return `${API_BASE_URL}/${cleanPath}`;
  }
  
  // Default to images endpoint
  return `${API_BASE_URL}/api/files/images/${cleanPath}`;
};

// Helper function to build document URLs
export const buildDocumentUrl = (documentPath) => {
  if (!documentPath) return '';
  
  // If already a full URL, return as is
  if (documentPath.startsWith('http://') || documentPath.startsWith('https://')) {
    return documentPath;
  }
  
  // Remove leading slash if present
  const cleanPath = documentPath.startsWith('/') ? documentPath.slice(1) : documentPath;
  
  // Check if it's already a full path
  if (cleanPath.startsWith('api/files/')) {
    return `${API_BASE_URL}/${cleanPath}`;
  }
  
  // Default to documents endpoint
  return `${API_BASE_URL}/api/files/documents/${cleanPath}`;
};

export default {
  API_BASE_URL,
  buildApiUrl,
  buildFileUrl,
  buildImageUrl,
  buildDocumentUrl,
};

