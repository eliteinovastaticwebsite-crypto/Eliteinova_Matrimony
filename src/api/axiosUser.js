import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    const token = localStorage.getItem('token');
    const actualToken = authToken || token;
    
    console.log('🔑 Axios Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      hasAuthToken: !!authToken,
      hasToken: !!token,
      tokenPreview: actualToken ? actualToken.substring(0, 20) + '...' : 'NO TOKEN'
    });
    
    if (actualToken) {
      config.headers.Authorization = `Bearer ${actualToken}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Axios Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ Axios Response Success:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      data: response.data
    });
    return response;
  },
  (error) => {
    const errorDetails = {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    };
    
    console.error('❌ Axios Response Error:', errorDetails);
    
    return Promise.reject(error);
  }
);

export const testBackendConnection = async () => {
  try {
    console.log('🔍 Testing backend connection via axios...');
    console.log('🌐 Using API URL:', import.meta.env.VITE_API_URL);
    
    
    const testEndpoints = [
      '/api/auth/login',  
      '/api/plans',       
      '/api/profiles'     
    ];

    for (const endpoint of testEndpoints) {
      try {
        const response = await api.options(endpoint);
        console.log(`✅ Backend responding at ${endpoint} (Status: ${response.status})`);
        return true;
      } catch (error) {
        if (error.response) {
          console.log(`✅ Backend available at ${endpoint} (Status: ${error.response.status})`);
          return true;
        }
        
        console.log(`❌ ${endpoint}: ${error.message}`);
      }
    }
    
    console.error('❌ Backend not reachable at any endpoint');
    return false;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
};

export default api;