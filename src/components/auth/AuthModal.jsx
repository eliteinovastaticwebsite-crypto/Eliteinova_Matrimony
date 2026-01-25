// src/components/AuthModal.jsx - UPDATED & FIXED
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, isAuthenticated } = useAuth(); // ✅ REMOVED: register - not needed here
  const [mode, setMode] = useState(initialMode);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [isOpen]);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
      navigate('/profiles');
    }
  }, [isAuthenticated, isOpen, onClose, navigate]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  const switchMode = (newMode) => setMode(newMode);

  // Login handler
  // In AuthModal.jsx - login handler
const handleLoginSuccess = async ({ email, password }) => {
  console.log("Login Modal Received:", email, password);
  
  // Check if trying to login as admin
  if (email.toLowerCase().includes('admin') || email.endsWith('@eliteinovamatrimony.com')) {
    throw new Error("Admin users must login through Admin Login page.");
  }
  
  try {
    const res = await login(email, password);
    
    if (res && res.success === true) {
      console.log("✅ Login successful in modal, user:", res.user?.name);
      // Close modal immediately
      onClose();
      // Navigate after a brief delay to ensure modal closes first
      setTimeout(() => {
        // ✅ CHANGED: Navigate directly to profiles page (dashboard removed)
        // navigate("/dashboard"); // ❌ OLD: Commented out - dashboard removed
        navigate("/profiles"); // ✅ NEW: Navigate directly to profiles page
      }, 50);
      return { success: true };
    } else {
      // Login failed - extract error message
      const errorMsg = res?.error || res?.message || "Invalid email or password. Please check your credentials and try again.";
      console.error("❌ Login failed in modal:", errorMsg);
      // Throw error so LoginForm can catch and display it
      const loginError = new Error(errorMsg);
      loginError.error = errorMsg; // Add error property for LoginForm
      throw loginError;
    }
  } catch (error) {
    // Ensure error message is properly formatted
    console.error("❌ Login error in handleLoginSuccess:", error);
    
    // Extract error message from various possible sources
    let errorMessage = "Invalid email or password. Please check your credentials and try again.";
    
    if (error.message) {
      errorMessage = error.message;
    } else if (error.error) {
      errorMessage = error.error;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    // Create a new error with the extracted message
    const formattedError = new Error(errorMessage);
    formattedError.error = errorMessage;
    throw formattedError;
  }
};

  // ✅ FIXED: User is already registered and auto-logged in
  const handleRegisterSuccess = async (registrationResult) => {
    console.log("Register Modal Received Success:", registrationResult);
    
    // User is already registered and auto-logged in by AuthContext
    // Close the modal - payment redirect is handled in RegisterForm
    if (onClose) {
      onClose();
    }
    
    // The RegisterForm component will handle redirecting to payment page
    // So we don't need to navigate here
    console.log('✅ User registered and auto-logged in:', registrationResult.user?.name);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-t-2xl p-5 text-white shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">
                {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
              </h2>
              <p className="text-red-100 mt-1">
                {mode === 'login'
                  ? 'Sign in to your account'
                  : 'Join our matrimony service'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200 ml-4 shrink-0"
              aria-label="Close modal"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mx-4 mt-3 shrink-0">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-3 rounded-md transition-all duration-300 font-semibold ${
              mode === 'login'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => switchMode('register')}
            className={`flex-1 py-3 rounded-md transition-all duration-300 font-semibold ${
              mode === 'register'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
          <div className="pb-4">

            {mode === 'login' ? (
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
                onRegister={() => switchMode('register')}
                isInModal={true}
              />
            ) : (
              <RegisterForm
                isInModal={true}
                onRegisterSuccess={handleRegisterSuccess} // ✅ This receives the SUCCESS result, not registration data
                onSwitch={() => switchMode('login')}
                onClose={onClose}
              />
            )}

          </div>
        </div>

        <div className="h-4 shrink-0"></div>
      </div>
    </div>
  );
};

export default AuthModal;