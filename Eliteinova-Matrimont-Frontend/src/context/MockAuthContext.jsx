// src/contexts/MockAuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Enhanced mock user data WITH ADMIN USER
const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    mobile: '9876543210',
    profileFor: 'Myself',
    gender: 'Male',
    dob: '1990-01-15',
    token: 'mock-jwt-token-admin-123',
    isVerified: true,
    isPremium: true,
    createdAt: '2024-01-01T00:00:00Z',
    membership: 'Premium',
    role: 'ADMIN' // Added admin role
  },
  {
    id: 2,
    name: 'Raj Kumar',
    email: 'raj@example.com',
    mobile: '9876543210',
    profileFor: 'Myself',
    gender: 'Male',
    dob: '1990-01-15',
    token: 'mock-jwt-token-123',
    isVerified: true,
    isPremium: true,
    createdAt: '2024-01-01T00:00:00Z',
    membership: 'Premium',
    role: 'USER'
  },
  {
    id: 3,
    name: 'Priya Sharma',
    email: 'priya@example.com',
    mobile: '9876543211',
    profileFor: 'Myself',
    gender: 'Female',
    dob: '1992-05-20',
    token: 'mock-jwt-token-456',
    isVerified: true,
    isPremium: false,
    createdAt: '2024-01-02T00:00:00Z',
    membership: 'Free',
    role: 'USER'
  },
  {
    id: 4,
    name: 'Arun Patel',
    email: 'arun@example.com',
    mobile: '9876543212',
    profileFor: 'Myself',
    gender: 'Male',
    dob: '1988-08-10',
    token: 'mock-jwt-token-789',
    isVerified: false,
    isPremium: false,
    createdAt: '2024-01-03T00:00:00Z',
    membership: 'Free',
    role: 'USER'
  }
];

// Mock profiles database
const mockProfiles = [
  {
    id: 1,
    userId: 2, // This profile belongs to Raj Kumar (user ID 2)
    fullName: 'Raj Kumar',
    gender: 'Male',
    age: 34,
    location: 'Chennai, Tamil Nadu, India',
    religion: 'Hindu',
    caste: 'OBC',
    dateOfBirth: '1990-01-15',
    subcaste: 'Vanniyar',
    dosham: 'No',
    willingOtherCaste: false,
    maritalStatus: 'Single',
    height: 5.6,
    familyStatus: 'Middle Class',
    familyType: 'Joint',
    education: 'Bachelor\'s',
    employedIn: 'Private',
    occupation: 'Software Engineer',
    annualIncome: '5-10 L',
    district: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    about: 'Software professional looking for a compatible partner.',
    photos: [],
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  }
];

const MockAuthContext = createContext();

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
};

export const useAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const MockAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mockAuthUser');
    const storedToken = localStorage.getItem('mockAuthToken');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('mockAuthUser');
        localStorage.removeItem('mockAuthToken');
      }
    }
  }, []);

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  // Check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem('mockAuthToken');
    const userData = localStorage.getItem('mockAuthUser');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        return {
          isAuthenticated: true,
          user: user,
          isAdmin: user.role === 'ADMIN'
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
        return { isAuthenticated: false, user: null, isAdmin: false };
      }
    }
    
    return { isAuthenticated: false, user: null, isAdmin: false };
  };

  // Mock login function
  const login = async (email, password) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Find user by email
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        return {
          success: false,
          error: 'No account found with this email address'
        };
      }

      // Mock password validation (any password with 6+ chars works for demo)
      if (password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters long'
        };
      }

      // Set user and store in localStorage
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('mockAuthUser', JSON.stringify(foundUser));
      localStorage.setItem('mockAuthToken', foundUser.token);

      console.log('✅ User logged in:', foundUser.name);
      console.log('👤 User role:', foundUser.role);

      return {
        success: true,
        user: foundUser,
        token: foundUser.token,
        isAdmin: foundUser.role === 'ADMIN'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Mock register function
  const register = async (userData) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'An account with this email already exists'
        };
      }

      // Check if mobile already exists
      const existingMobile = mockUsers.find(u => u.mobile === userData.mobile);
      if (existingMobile) {
        return {
          success: false,
          error: 'An account with this mobile number already exists'
        };
      }

      // Create new user (always as regular USER)
      const newUser = {
        id: mockUsers.length + 1,
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        profileFor: userData.profileFor || 'Myself',
        gender: userData.gender || 'Male',
        dob: userData.dob,
        token: `mock-jwt-token-${Date.now()}`,
        isVerified: false,
        createdAt: new Date().toISOString(),
        membership: 'Free',
        role: 'USER' // Default role for new registrations
      };

      // Add to mock database
      mockUsers.push(newUser);

      // Auto-login after registration
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('mockAuthUser', JSON.stringify(newUser));
      localStorage.setItem('mockAuthToken', newUser.token);

      return {
        success: true,
        user: newUser,
        token: newUser.token
      };
    } catch (error) {
      return {
        success: false,
        error: 'Registration failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Mock profile creation function
  const createProfile = async (profileData) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated'
        };
      }

      // Check if profile already exists
      const existingProfile = mockProfiles.find(p => p.userId === user.id);
      if (existingProfile) {
        return {
          success: false,
          error: 'Profile already exists for this user'
        };
      }

      // Create new profile
      const newProfile = {
        id: mockProfiles.length + 1,
        userId: user.id,
        ...profileData,
        createdAt: new Date().toISOString(),
        isActive: true,
        lastUpdated: new Date().toISOString()
      };

      // Add to mock database
      mockProfiles.push(newProfile);

      return {
        success: true,
        profile: newProfile,
        message: 'Profile created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Profile creation failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Get user profile
  const getProfile = async (userId = null) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      const targetUserId = userId || (user ? user.id : null);
      if (!targetUserId) {
        return {
          success: false,
          error: 'User ID required'
        };
      }

      const profile = mockProfiles.find(p => p.userId === targetUserId);
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      return {
        success: true,
        profile: profile
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get profile'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('mockAuthUser');
    localStorage.removeItem('mockAuthToken');
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('mockAuthUser', JSON.stringify(updatedUser));
      
      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      return {
        success: false,
        error: 'Profile update failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Get user initials
  const getUserInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  // Update user data
  const updateUserData = (updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem('mockAuthUser', JSON.stringify(newUser));
    return newUser;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    createProfile,
    getProfile,
    checkAuthStatus,
    getUserInitials,
    updateUserData,
    isAdmin // Added this function
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
};