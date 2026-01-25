import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import adminService from '../services/adminService';

const AdminResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      const result = await adminService.resetPassword(token, newPassword);
      
      if (result.success) {
        setSuccess(result.message);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/admin-login');
        }, 2000);
      } else {
        setError(result.error || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <button
          onClick={handleBackToLogin}
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
          <span className="hidden md:inline">Back to Login</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Reset Password
          </h2>
          <p className="text-gray-400 text-sm">
            Enter your new password below
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

          {success && (
            <div className="mb-6 bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{success}</span>
                <p className="text-sm mt-2">Redirecting to login page...</p>
              </div>
            </div>
          )}

          {!success && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white transition-all duration-200"
                    placeholder="Enter new password (min 6 characters)"
                    disabled={loading || !token}
                    minLength={6}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white transition-all duration-200"
                    placeholder="Confirm new password"
                    disabled={loading || !token}
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting Password...
                    </>
                  ) : 'Reset Password'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/admin-login"
              className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;

