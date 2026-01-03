// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/authService';
import ProfileService from '../services/profileService';
import api from '../api/axiosUser'; // Remove testBackendConnection import

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Check for stored auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setAuthLoading(true);
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('authToken');
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          
          // Debug: Log membership field from localStorage
          console.log('🔍 AuthContext: User data from localStorage:', userData);
          console.log('🔍 AuthContext: Membership from localStorage:', userData.membership || userData.membershipType);
          
          // Verify token is still valid
          try {
            await AuthService.verifyToken(storedToken);
            
            // Set auth header
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            
            setUser(userData);
            setIsAuthenticated(true);
            
            console.log('✅ Auto-login successful:', userData.name);
            console.log('✅ Membership from localStorage:', userData.membership || userData.membershipType || 'NOT FOUND');
          } catch (verifyError) {
            // If it's a 403 error, still allow login (backend might not have verify endpoint)
            if (verifyError.message?.includes('403') || verifyError.response?.status === 403) {
              console.warn('⚠️ Token verification returned 403, but allowing login anyway');
              
              // Set auth header
              api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
              
              setUser(userData);
              setIsAuthenticated(true);
              
              console.log('✅ Auto-login successful (with 403):', userData.name);
              console.log('✅ Membership from localStorage (403):', userData.membership || userData.membershipType || 'NOT FOUND');
            } else {
              console.warn('❌ Token verification failed, clearing storage:', verifyError);
              logout();
            }
          }
        } catch (error) {
          console.error('❌ Error parsing stored user data:', error);
          logout();
        }
      }
      setAuthLoading(false);
    };

    initializeAuth();
  }, []);

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  // Check if user has premium status
  const isPremium = () => {
    return user?.isPremium === true;
  };

  // Enhanced login function
  const login = async (email, password) => {
  setLoading(true);
  
  try {
    console.log('🔐 Attempting login for:', email);
    const credentials = { email, password };
    const result = await AuthService.login(credentials);
    
    console.log('🔍 Raw login result from AuthService:', result);
    
    // ✅ FIX: Check the actual response structure from your backend
    if (result.token && result.user) {
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
      
      // Update state
      const userData = result.user;
      
      // Debug: Log membership field
      console.log('🔍 AuthContext: Login response user data:', userData);
      console.log('🔍 AuthContext: Membership field:', userData.membership || userData.membershipType);
      console.log('🔍 AuthContext: Full user object keys:', Object.keys(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', result.token);

      console.log('✅ User logged in:', userData.name);
      console.log('✅ User membership stored:', userData.membership || userData.membershipType || 'NOT FOUND');
      
      // ✅ CORRECT: Return success based on actual backend response
      return {
        success: true,  // This was incorrectly set to false!
        user: userData,
        token: result.token,
        isAdmin: userData.role === 'ADMIN',
        isPremium: userData.isPremium === true,
        message: result.message || 'Login successful!'
      };
    } else {
      console.warn('❌ Login failed - missing token or user:', result);
      return {
        success: false,
        error: result.message || 'Login failed. Invalid response from server.'
      };
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      error: error.message || 'Login failed. Please check your credentials and try again.'
    };
  } finally {
    setLoading(false);
  }
};

  // SIMPLIFIED: Single registration function that uses the correct backend endpoint
  const register = async (userData) => {
    setLoading(true);
    
    try {
      console.log('🚀 Starting registration...', {
        name: userData.name,
        email: userData.email,
        profileFor: userData.profileFor
      });

      // Use the correct single endpoint that exists in your backend
      const result = await AuthService.register(userData);
      
      if (result.token && result.user) {
        // Auto-login after registration
        api.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
        setUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('authToken', result.token);

        console.log('✅ Registration successful:', result.user.name);
        
        return {
          success: true,
          user: result.user,
          token: result.token,
          isAdmin: result.user.role === 'ADMIN',
          message: result.message || 'Registration completed successfully! Welcome to EliteNXT Matrimony!'
        };
      } else {
        return {
          success: false,
          error: result.message || 'Registration failed. Invalid response from server.'
        };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed. Please check your information and try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Add this function to your AuthContext
const uploadPendingFiles = async (userId, token) => {
  try {
    const pendingFiles = localStorage.getItem('pendingFileUploads');
    const pendingUserId = localStorage.getItem('pendingUploadUserId');
    
    if (!pendingFiles || pendingUserId !== userId.toString()) {
      return;
    }

    const files = JSON.parse(pendingFiles);
    console.log("📤 Uploading pending files for user:", userId);

    // Upload photos
    if (files.photos && files.photos.length > 0) {
      for (const photo of files.photos) {
        try {
          const formData = new FormData();
          formData.append('file', photo);
          
          const { buildApiUrl } = await import('../config/api');
          const response = await fetch(buildApiUrl('api/files/upload-profile-photo'), {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });
          
          if (response.ok) {
            console.log("✅ Uploaded pending photo:", photo.name);
          }
        } catch (error) {
          console.error("❌ Failed to upload pending photo:", error);
        }
      }
    }

    // Clear pending files
    localStorage.removeItem('pendingFileUploads');
    localStorage.removeItem('pendingUploadUserId');
    console.log("✅ All pending files processed");
    
  } catch (error) {
    console.error("❌ Error uploading pending files:", error);
  }
};

// Call this after successful login in your AuthContext
// Add this after setting the user in your login function
// await uploadPendingFiles(user.id, token);

  // REMOVED: All multi-step registration functions since backend doesn't support them
  // - registerMultiStep
  // - registerComplete

  // Profile management
  const createProfile = async (profileData) => {
    setLoading(true);
    
    try {
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated. Please log in again.'
        };
      }

      console.log('📝 Creating profile for user:', user.id);
      const result = await ProfileService.updateProfile(profileData);
      
      // Update local user data
      if (result.user) {
        const updatedUser = { ...user, ...result.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return {
        success: true,
        profile: result,
        user: result.user || user,
        message: result.message || 'Profile created successfully!'
      };
    } catch (error) {
      console.error('❌ Profile creation error:', error);
      return {
        success: false,
        error: error.message || 'Profile creation failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    
    try {
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated. Please log in again.'
        };
      }

      console.log('📝 Updating profile for user:', user.id);
      const result = await ProfileService.updateProfile(profileData);
      
      // Update local user data
      if (result.user) {
        const updatedUser = { ...user, ...result.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return {
        success: true,
        user: result.user || user,
        profile: result,
        message: result.message || 'Profile updated successfully!'
      };
    } catch (error) {
      console.error('❌ Update profile error:', error);
      return {
        success: false,
        error: error.message || 'Profile update failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    setLoading(true);
    
    try {
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated'
        };
      }

      console.log('📋 Getting profile for user:', user.id);
      const result = await ProfileService.getMyProfile();
      
      return {
        success: true,
        profile: result,
        message: 'Profile loaded successfully'
      };
    } catch (error) {
      console.error('❌ Get profile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to load profile. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Enhanced logout function
  const logout = () => {
    console.log('👋 Logging out user:', user?.name);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    console.log('✅ User logged out successfully');
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      if (!user) return;
      
      const profileResult = await getProfile();
      if (profileResult.success && profileResult.user) {
        setUser(profileResult.user);
        localStorage.setItem('user', JSON.stringify(profileResult.user));
      }
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
    }
  };

  // Sync authentication state from localStorage
  const syncAuthFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('authToken');
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        
        // Set auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        
        console.log('✅ Auth state synced from storage:', userData.name);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error syncing auth from storage:', error);
      return false;
    }
  };

  // Get user initials for avatars
  const getUserInitials = (name = user?.name) => {
    if (!name) return 'U';
    
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if using mock mode
  const isUsingMock = () => {
    return AuthService.isUsingMock && AuthService.isUsingMock();
  };

  const value = {
    // State
    user,
    loading: loading || authLoading,
    isAuthenticated,
    
    // Auth methods
    login,
    register, // Only single registration method
    logout,
    refreshUser,
    syncAuthFromStorage, // Sync auth state from localStorage

    // Profile methods
    updateProfile,
    createProfile,
    getProfile,
    
    // Utility methods
    getUserInitials,
    isAdmin,
    isPremium,
    isUsingMock: isUsingMock(),

    // Status
    hasProfile: user?.profileCompleted || false,
    isProfileComplete: user?.profileCompleted || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};