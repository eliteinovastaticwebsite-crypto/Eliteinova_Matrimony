// src/services/AuthService.js
import api from '../api/axiosUser';

class authService {
  // Step 1: Basic Registration

  // In AuthService.js - register method
// Update the register method in AuthService.js to show more details
 async register(userData) {
    try {
      console.log("🚀 Registration attempt:", userData);
      
      // Make the API call
      const response = await api.post('/api/auth/register', userData);
      console.log("✅ Registration successful:", response.data);
      
      return response.data;
      
    } catch (error) {
      console.error("❌ Registration failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });
      
      // Throw the actual error message from backend
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Registration failed';
      throw new Error(errorMessage);
    }
  }


  async login(credentials) {
  try {
    console.log("🚀 Login attempt:", { email: credentials.email });
    
    // Check if admin email
    const isAdminEmail = credentials.email.toLowerCase().includes('admin') || 
                         credentials.email.endsWith('@eliteinovamatrimony.com');
    
    if (isAdminEmail) {
      console.log("⚠️ Admin detected - should use admin login endpoint");
      throw new Error("Admin users must use Admin Login page");
    }
    
    // First, check if backend is reachable
    const isBackendReachable = await this.checkBackendStatus();
    
    if (!isBackendReachable) {
      console.warn("⚠️ Backend not reachable, using mock response");
      return this.getMockLoginResponse(credentials);
    }
    
    // Try real backend
    const response = await api.post('/api/auth/login', credentials);
    console.log("✅ Login successful:", response.data);
    return response.data;
    
  } catch (error) {
    console.error("❌ Login error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // If it's a network error (backend offline), use mock
    if (this.isNetworkError(error)) {
      console.log("🔄 Using mock login response (backend offline)");
      return this.getMockLoginResponse(credentials);
    }
    
    // If backend responded with an error (like wrong password), throw it
    const backendMessage = error.response?.data?.message || error.response?.data?.error;
    throw new Error(backendMessage || 'Login failed');
  }
}

// Add this method to check backend status
async checkBackendStatus() {
  try {
    await api.options('/api/auth/login');
    return true;
  } catch (error) {
    return false;
  }
}

  // Complete Profile Creation
  async createProfile(profileData) {
    try {
      console.log("🚀 Creating profile:", profileData);
      const response = await api.post('/api/profiles', profileData);
      console.log("✅ Profile created:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Profile creation error:", error);
      
      if (this.isNetworkError(error)) {
        console.log("🔄 Using mock profile creation due to network error");
        return { success: true, message: 'Profile created successfully (Mock)' };
      }
      
      throw new Error(error.response?.data?.message || 'Profile creation failed');
    }
  }

  async verifyToken(token) {
  try {
    console.log('🔐 Verifying token...');
    const response = await api.get('/api/auth/check', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Token verification response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Token verification error:', error.response?.status);
    
    // Also try the /me endpoint as fallback
    if (error.response?.status === 403 || error.response?.status === 404) {
      console.log('🔄 Trying /me endpoint as fallback...');
      try {
        const meResponse = await api.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ /me endpoint worked:', meResponse.data);
        return {
          success: true,
          valid: true,
          user: meResponse.data.user,
          message: 'Token valid (verified via /me)'
        };
      } catch (meError) {
        console.error('❌ /me endpoint also failed:', meError.response?.status);
      }
    }
    
    throw new Error('Token verification failed');
  }
}

  // ========== IMPROVED MOCK LOGIC ==========
  
  // Better network error detection
  isNetworkError(error) {
    return !error.response || 
           error.code === 'NETWORK_ERROR' || 
           error.code === 'ECONNREFUSED' ||
           error.message?.includes('Network Error') ||
           error.message?.includes('Failed to fetch');
  }

  shouldUseMock() {
    // More conservative mock usage
    return (process.env.NODE_ENV === 'development' && 
            window.location.hostname === 'localhost') ||
           this.isNetworkError;
  }

  getMockStep1Response(data) {
    return {
      success: true,
      user: {
        id: Date.now(),
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        role: 'USER',
        isPremium: false,
        profileCompleted: false
      },
      token: 'mock-step1-token-' + Date.now(),
      message: 'Step 1 completed successfully (Mock - Backend Not Available)'
    };
  }

  getMockStepResponse(stepName) {
    return {
      success: true,
      message: `${stepName} completed successfully (Mock - Backend Not Available)`,
      tempUserId: Date.now()
    };
  }

  getMockFinalResponse(data) {
    return {
      success: true,
      user: {
        id: Date.now(),
        name: data.name || 'Test User',
        email: data.email || 'test@example.com',
        mobile: data.mobile || '9876543210',
        role: 'USER',
        isPremium: false,
        profileCompleted: true
      },
      profile: {
        id: Date.now(),
        ...data,
        completed: true,
        createdAt: new Date().toISOString()
      },
      token: 'mock-final-token-' + Date.now(),
      message: 'Registration completed successfully! (Mock Mode - Backend Not Available)'
    };
  }

  getMockCompleteRegistration(data) {
    return {
      success: true,
      user: {
        id: Date.now(),
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        role: 'USER',
        isPremium: false,
        profileCompleted: true,
        createdAt: new Date().toISOString()
      },
      profile: {
        id: Date.now(),
        ...data,
        completed: true,
        createdAt: new Date().toISOString()
      },
      token: 'mock-complete-token-' + Date.now(),
      message: 'Complete registration successful! (Mock Mode - Backend Not Available)'
    };
  }

  getMockLoginResponse(credentials) {
    return {
      success: true,
      user: {
        id: 1,
        name: 'Demo User',
        email: credentials.email,
        mobile: '9876543210',
        role: 'USER',
        isPremium: false,
        profileCompleted: true
      },
      token: 'mock-login-token-' + Date.now(),
      message: 'Login successful (Development Mode - Backend Not Available)'
    };
  }

  // Utility method to check if we're using mock responses
  isUsingMock() {
    return this.shouldUseMock();
  }
}

export default new authService();