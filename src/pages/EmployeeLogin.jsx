// EmployeeLogin.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import adminService from '../services/adminService';

const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = adminService.getAuthToken();
        if (token) {
          const authStatus = await adminService.checkAuth();
          if (authStatus.authenticated) {
            const from = location.state?.from?.pathname || '/admin/dashboard';
            navigate(from, { replace: true });
          }
        }
      } catch (error) {
        // Not authenticated
      }
    };
    
    checkAuth();
  }, [navigate, location]);

  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {

    adminService.clearAdminData();
    localStorage.clear();
    // Use employeeLogin method (separate endpoint for office staff)
    const result = await adminService.employeeLogin(email, password);
    
    if (result.success) {
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('employeeRememberMe', 'true');
      } else {
        localStorage.removeItem('employeeRememberMe');
      }

      // Store user type as 'office'
      localStorage.setItem('adminUserType', 'office');
      localStorage.setItem('adminLoginType', 'employee');
      
      // After successful office login
const from = location.state?.from?.pathname || '/office/dashboard';  // Go to office dashboard
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Office Staff Portal
          </h2>
          <p className="text-gray-400 text-sm">
            Eliteinova Matrimony - Office Staff Panel
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
                Office Staff Email
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
                  className="appearance-none block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-200"
                  placeholder="staff@eliteinovamatrimony.com"
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
                  className="appearance-none block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-200"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 bg-gray-900 rounded"
                disabled={loading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in to Office Panel'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-500">Office Staff Access Only</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                For admin access, please use the admin portal.
              </p>
              <p className="mt-1 text-xs text-gray-600">
                © {new Date().getFullYear()} Eliteinova Matrimony. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;