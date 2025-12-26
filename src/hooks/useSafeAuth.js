// src/hooks/useSafeAuth.js
import { useAuth } from '../context/AuthContext';

export const useSafeAuth = () => {
  try {
    return useAuth();
  } catch (error) {
    // Return fallback auth state when provider not available
    console.warn('AuthProvider not available, using fallback state');
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      login: async () => ({ success: false, error: 'Auth system initializing' }),
      register: async () => ({ success: false, error: 'Auth system initializing' }),
      logout: () => {},
      isAdmin: () => false
    };
  }
};