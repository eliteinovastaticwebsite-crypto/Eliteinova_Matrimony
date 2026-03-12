import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import officeService from "../services/officeAuthService";
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const OfficeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Reset password states
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStep, setResetStep] = useState("email"); // email, otp, newPassword
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await officeService.checkAuth();
        if (res.authenticated) {
          navigate("/admin/dashboard", { replace: true });
        }
      } catch (_) {}
    };
    checkAuth();
  }, [navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await officeService.login(email, password);
      if (res.success) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError(res.message || res.error || "Invalid credentials");
      }
    } catch (err) {
      setError(err.message || err.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password - send OTP
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetLoading(true);
    
    try {
      // Call your API to send OTP
      const res = await officeService.sendPasswordResetOTP(resetEmail);
      if (res.success) {
        setResetStep("otp");
        setCountdown(60); // Start 60 second countdown for resend
        setResetSuccess("OTP sent successfully to your email");
      } else {
        setResetError(res.message || "Failed to send OTP");
      }
    } catch (err) {
      setResetError(err.message || "An error occurred. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  // Handle verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetLoading(true);
    
    try {
      // Call your API to verify OTP
      const res = await officeService.verifyPasswordResetOTP(resetEmail, otp);
      if (res.success) {
        setResetStep("newPassword");
        setResetSuccess("");
        setOtp("");
      } else {
        setResetError(res.message || "Invalid OTP");
      }
    } catch (err) {
      setResetError(err.message || "OTP verification failed");
    } finally {
      setResetLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    
    // Validate passwords
    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }
    
    setResetLoading(true);
    
    try {
      // Call your API to reset password
      const res = await officeService.resetPassword(resetEmail, otp, newPassword);
      if (res.success) {
        setResetSuccess("Password reset successful! You can now login with your new password.");
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      } else {
        setResetError(res.message || "Failed to reset password");
      }
    } catch (err) {
      setResetError(err.message || "An error occurred");
    } finally {
      setResetLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setResetError("");
    setResetLoading(true);
    
    try {
      const res = await officeService.sendPasswordResetOTP(resetEmail);
      if (res.success) {
        setCountdown(60);
        setResetSuccess("OTP resent successfully");
      } else {
        setResetError(res.message || "Failed to resend OTP");
      }
    } catch (err) {
      setResetError(err.message || "An error occurred");
    } finally {
      setResetLoading(false);
    }
  };

  // Close modal and reset states
  const handleCloseModal = () => {
    setShowResetModal(false);
    setResetStep("email");
    setResetEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setResetError("");
    setResetSuccess("");
    setCountdown(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-red-100 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-100 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-100 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md mx-4 relative z-10">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 px-8 py-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-500 opacity-50 animate-pulse"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-xl">
                <ShieldCheckIcon className="w-9 h-9 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white drop-shadow">Office Login</h2>
              <p className="text-white/80 text-sm mt-1">Eliteinova Matrimony — Staff Portal</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Office Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="office@eliteinova.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200 bg-gray-50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword
                    ? <EyeSlashIcon className="w-5 h-5" />
                    : <EyeIcon className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-all"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span>Login to Office Portal</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-medium">STAFF ACCESS ONLY</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Back link */}
            <p className="text-center text-sm text-gray-500">
              Not staff?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-red-600 font-semibold hover:text-red-700 transition-colors"
              >
                Back to Home
              </button>
            </p>

          </form>
        </div>

        {/* Bottom note */}
        <p className="text-center text-gray-400 text-xs mt-4">
          © {new Date().getFullYear()} Eliteinova Tech Pvt Ltd. All rights reserved.
        </p>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
          ></div>

          {/* Modal */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Reset Password</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {resetSuccess && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{resetSuccess}</span>
                  </div>
                )}

                {resetError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">⚠️</span>
                    <span>{resetError}</span>
                  </div>
                )}

                {/* Step 1: Email */}
                {resetStep === "email" && (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Office Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      We'll send a password reset OTP to this email address.
                    </p>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {resetLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send OTP</span>
                      )}
                    </button>
                  </form>
                )}

                {/* Step 2: OTP Verification */}
                {resetStep === "otp" && (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enter OTP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit OTP"
                        maxLength="6"
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 text-center text-lg tracking-widest"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={countdown > 0 || resetLoading}
                        className="text-sm text-red-600 hover:text-red-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setResetStep("email")}
                        className="text-sm text-gray-600 hover:text-gray-700"
                      >
                        Change Email
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={resetLoading || otp.length < 6}
                      className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {resetLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <span>Verify OTP</span>
                      )}
                    </button>
                  </form>
                )}

                {/* Step 3: New Password */}
                {resetStep === "newPassword" && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full px-4 py-2.5 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full px-4 py-2.5 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Password must be at least 6 characters long.
                    </p>

                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {resetLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Resetting...</span>
                        </>
                      ) : (
                        <span>Reset Password</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeLogin;