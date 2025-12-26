// src/layout/MainLayout.jsx - FIXED VERSION
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginCard from "../components/auth/LoginCard";

export default function MainLayout({ children, onLogin, onRegister }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Define paths where sidebar should be hidden
  const hideSidebarPaths = [
    "/contact", 
    "/", 
    "/services", 
    "/admin", 
    "/upgrade",
    "/login",
    "/register",
    "/profiles",
    "/dashboard",
    "/my-profile"
  ];

  // Define paths where login sidebar should always be shown (even when authenticated)
  const alwaysShowLoginSidebarPaths = [
    "/",
    "/services",
    "/contact"
  ];

  // Check if current path should hide sidebar
  const hideSidebar = hideSidebarPaths.includes(location.pathname);
  
  // Check if we should show login sidebar
  // ✅ FIX: Remove useAuth dependency for now
  const shouldShowLoginSidebar = 
    !hideSidebar && 
    alwaysShowLoginSidebarPaths.includes(location.pathname);

  // Handle login success
  const handleLoginSuccess = (userData) => {
    console.log("✅ Login successful in MainLayout:", userData);
    if (onLogin) {
      onLogin(userData);
    }
    // Navigate to profiles page after successful login
    navigate("/profiles");
  };

  // Handle register click
  const handleRegisterClick = () => {
    if (onRegister) {
      onRegister();
    } else {
      // Default behavior - navigate to register page
      navigate("/register");
    }
  };

  // Quick stats for the sidebar
  const quickStats = {
    totalProfiles: 1250,
    successfulMatches: 350,
    premiumMembers: 280,
    verifiedProfiles: 890
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6 py-8 px-0 sm:px-0">
          
          {/* Sidebar - Conditional Rendering */}
          {shouldShowLoginSidebar && (
            <aside className="lg:col-span-1 space-y-6">
              {/* Login Card */}
              <LoginCard 
                onLoginSuccess={handleLoginSuccess}
                onRegister={handleRegisterClick}
              />
              
              {/* Quick Stats Card - Only show on home page */}
              {location.pathname === "/" && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                    💫 Why Choose Us?
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Total Profiles</span>
                      <span className="font-bold text-red-600">{quickStats.totalProfiles}+</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Successful Matches</span>
                      <span className="font-bold text-green-600">{quickStats.successfulMatches}+</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Verified Profiles</span>
                      <span className="font-bold text-blue-600">{quickStats.verifiedProfiles}+</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Premium Members</span>
                      <span className="font-bold text-purple-600">{quickStats.premiumMembers}+</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      Join thousands of successful matches today!
                    </p>
                  </div>
                </div>
              )}

              {/* User Welcome Card - REMOVED for now to fix AuthProvider issue */}
              {/* We'll add this back once the auth system is working */}
            </aside>
          )}

          {/* Main content */}
          <section className={
            hideSidebar || !shouldShowLoginSidebar 
              ? "lg:col-span-4" 
              : "lg:col-span-3"
          }>
            {/* Content Header for Authenticated Users - REMOVED for now */}
            
            {/* Page Content */}
            <div className={
              !hideSidebar && !shouldShowLoginSidebar
                ? "bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                : ""
            }>
              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}