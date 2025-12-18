import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import adminService from '../../services/adminService';

const ProtectedAdminRoute = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true
  });
  const location = useLocation();
  const checkInProgress = useRef(false);

  useEffect(() => {
    // Prevent multiple simultaneous checks
    if (checkInProgress.current) return;
    
    checkInProgress.current = true;
    console.log('🛡️ ProtectedAdminRoute: Starting auth check...');

    const checkAuth = async () => {
      try {
        const authStatus = await adminService.checkAuth();
        console.log('🛡️ ProtectedAdminRoute: Auth result:', authStatus);
        
        setAuthState({
          isAuthenticated: authStatus.authenticated || false,
          loading: false
        });
        
      } catch (error) {
        console.error('🛡️ ProtectedAdminRoute: Auth check error:', error);
        setAuthState({
          isAuthenticated: false,
          loading: false
        });
      } finally {
        checkInProgress.current = false;
      }
    };

    checkAuth();
    
    return () => {
      checkInProgress.current = false;
    };
  }, []); // Empty array = run once

  // Show loading while checking
  if (authState.loading) {
    console.log('🛡️ ProtectedAdminRoute: Loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!authState.isAuthenticated) {
    console.log('🛡️ ProtectedAdminRoute: Not authenticated, redirecting to login');
    console.log('🛡️ Current path:', location.pathname);
    
    // Don't redirect if we're already on login page
    if (location.pathname !== '/admin-login') {
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
    
    // If already on login page but not authenticated, stay there
    return children;
  }

  console.log('🛡️ ProtectedAdminRoute: Authenticated, rendering children');
  return children;
};

export default ProtectedAdminRoute;