// AdminLogin.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import adminService from '../services/adminService';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await adminService.checkAuth();
        if (authStatus.authenticated) {
          const from = location.state?.from?.pathname || '/admin/dashboard';
          navigate(from, { replace: true });
        }
      } catch (error) {
        // Not authenticated
      }
    };
    
    checkAuth();
  }, [navigate, location]);

  useEffect(() => {
  // Clear office token when on admin login page
  if (localStorage.getItem('officeToken')) {
    console.log('🔄 AdminLogin: Clearing office token');
    localStorage.removeItem('officeToken');
  }
}, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await adminService.login(email, password);
      
      if (result.success) {
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('adminRememberMe', 'true');
        } else {
          localStorage.removeItem('adminRememberMe');
        }

        // Redirect to dashboard or intended page
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <button
          onClick={handleBackToHome}
          className="inline-flex items-center px-4 py-2 bg-red-600/70 hover:bg-red-600/90 border border-red-700 rounded-lg text-gray-300 hover:text-white transition-all duration-200 group"
        >
          <svg 
            className="w-5 h-5 md:mr-2 group-hover:-translate-x-1 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="hidden md:inline">Back to Home</span>
        </button>
      </div>      

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Admin Portal
          </h2>
          <p className="text-gray-400 text-sm">
            Eliteinova Matrimony - Administration Panel
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-lg py-8 px-6 shadow-2xl sm:rounded-lg sm:px-10 border border-gray-700">
          {error && (
            <div className="mb-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Admin Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white transition-all duration-200"
                  placeholder="admin@eliteinovamatrimony.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white transition-all duration-200"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-700 bg-gray-900 rounded"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/admin/forgot-password" className="font-medium text-red-400 hover:text-red-300 transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in to Admin Panel'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-500">Restricted Access</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Unauthorized access is strictly prohibited.
              </p>
              <p className="mt-1 text-xs text-gray-600">
                © {new Date().getFullYear()} Eliteinova Matrimony. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700">
          <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-gray-400">
            Secure connection • Encrypted with AES-256
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;