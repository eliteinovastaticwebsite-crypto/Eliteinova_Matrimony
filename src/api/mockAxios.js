const mockAxios = {
  defaults: {
    baseURL: 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    }
  },
  
  interceptors: {
    request: {
      use: (callback) => {
        console.log('Mock request interceptor registered');
      }
    },
    response: {
      use: (callback) => {
        console.log('Mock response interceptor registered');
      }
    }
  },

  get: async (url) => {
    console.log('Mock GET:', url);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null };
  },

  post: async (url, data) => {
    console.log('Mock POST:', url, data);
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: null };
  },

  put: async (url, data) => {
    console.log('Mock PUT:', url, data);
    await new Promise(resolve => setTimeout(resolve, 600));
    return { data: null };
  },

  delete: async (url) => {
    console.log('Mock DELETE:', url);
    await new Promise(resolve => setTimeout(resolve, 400));
    return { data: null };
  }
};

export default mockAxios;