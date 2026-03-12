import React, { useState } from 'react';

export default function ForgotPasswordModal({ isOpen, onClose, initialEmail = '' }) {
  const [step, setStep] = useState('request'); // 'request', 'verify', 'reset'
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('A verification code has been sent to your email address. (Demo: Use 123456)');
      setStep('verify');
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length < 4) {
      setError('Please enter a valid verification code');
      return;
    }

    if (otp !== '123456') {
      setError('Invalid verification code. Please try again.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Code verified successfully. Please set your new password.');
      setStep('reset');
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password validation function matching RegisterForm
  const validatePassword = (password) => {
    if (!password || password.trim() === "") {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    
    return ""; // No error
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validate password using the same function as RegisterForm
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Password reset successfully!');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('A new verification code has been sent to your email. (Demo: Use 123456)');
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset all states when closing
    setStep('request');
    setEmail(initialEmail);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    onClose();
  };

  const handleBackToLogin = () => {
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
          aria-hidden="true"
        ></div>

        {/* Modal panel - styled like a form */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-6 py-5 sm:p-8">
            {/* Header with close button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 'request' && 'Forgot Password'}
                {step === 'verify' && 'Verify Code'}
                {step === 'reset' && 'Create New Password'}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Demo Info */}
            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              <strong>Demo Mode:</strong> Use code <span className="font-mono font-bold">123456</span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Step 1: Request Reset */}
            {step === 'request' && (
              <form onSubmit={handleRequestReset} className="space-y-5">
                <p className="text-sm text-gray-600">
                  Enter your email address and we'll send you a verification code to reset your password.
                </p>
                
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="reset-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {step === 'verify' && (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <p className="text-sm text-gray-600">
                  We've sent a verification code to <span className="font-semibold text-gray-900">{email}</span>. 
                  Please enter it below.
                </p>
                
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('request')}
                    className="text-sm text-gray-600 hover:text-gray-700 transition-colors"
                  >
                    Change Email
                  </button>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Reset Password - Updated with RegisterForm password validation */}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <p className="text-sm text-gray-600">
                  Please enter your new password.
                </p>
                
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Enter new password"
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Confirm new password"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password Requirements - Same as RegisterForm */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-700 mb-1">Password must contain:</p>
                  <ul className="space-y-1">
                    <li className={`flex items-center gap-2 ${newPassword?.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{newPassword?.length >= 6 ? '✅' : '⬜'}</span> At least 6 characters
                    </li>
                    <li className={`flex items-center gap-2 ${/[A-Z]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{/[A-Z]/.test(newPassword || '') ? '✅' : '⬜'}</span> At least one uppercase letter (A-Z)
                    </li>
                    <li className={`flex items-center gap-2 ${/[a-z]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{/[a-z]/.test(newPassword || '') ? '✅' : '⬜'}</span> At least one lowercase letter (a-z)
                    </li>
                    <li className={`flex items-center gap-2 ${/[0-9]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{/[0-9]/.test(newPassword || '') ? '✅' : '⬜'}</span> At least one number (0-9)
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}

            {/* Footer with back to login link */}
            {step !== 'reset' && (
              <div className="mt-6 pt-5 border-t border-gray-200 text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}