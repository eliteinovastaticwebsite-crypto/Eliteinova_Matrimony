import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import adminService from '../../services/adminService';
import officeAuthService from '../../services/officeAuthService';

const ProtectedAdminRoute = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    role: null
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
        // Check for office token first
        const officeToken = localStorage.getItem('officeToken');
        if (officeToken) {
          const officeAuth = await officeAuthService.checkAuth();
          console.log('🛡️ ProtectedAdminRoute: Office auth result:', officeAuth);
          
          if (officeAuth.authenticated) {
            setAuthState({
              isAuthenticated: true,
              loading: false,
              role: 'OFFICE'
            });
            checkInProgress.current = false;
            return;
          }
        }

        // Check for admin token
        const adminAuth = await adminService.checkAuth();
        console.log('🛡️ ProtectedAdminRoute: Admin auth result:', adminAuth);
        
        // Allow both ADMIN and OFFICE roles to access
        const isAuthenticated = adminAuth.authenticated === true && 
          (adminAuth.role === 'ADMIN' || adminAuth.role === 'OFFICE');
        
        setAuthState({
          isAuthenticated: isAuthenticated,
          loading: false,
          role: adminAuth.role || null
        });
        
      } catch (error) {
        console.error('🛡️ ProtectedAdminRoute: Auth check error:', error);
        setAuthState({
          isAuthenticated: false,
          loading: false,
          role: null
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
    if (location.pathname !== '/admin-login' && location.pathname !== '/office-login') {
      // Check if there's an office token but auth failed - redirect to office login
      if (localStorage.getItem('officeToken')) {
        return <Navigate to="/office-login" state={{ from: location }} replace />;
      }
      // Otherwise redirect to admin login
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
    
    // If already on login page but not authenticated, stay there
    return children;
  }

  console.log('🛡️ ProtectedAdminRoute: Authenticated, rendering children');
  return children;
};

export default ProtectedAdminRoute;