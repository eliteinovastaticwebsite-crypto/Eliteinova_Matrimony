import React, { useState } from "react";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function LoginForm({ onLoginSuccess, onRegister, onForgotPassword, isInModal }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onLoginSuccess({
        email: form.email,
        password: form.password
      });
    } catch (err) {
      let errorMessage = "Invalid email or password. Please check your credentials and try again.";
      
      if (err.error) {
        errorMessage = err.error;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setLoading(false);
      setError(errorMessage);
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event bubbling
    console.log("Forgot password clicked"); // For debugging
    setShowForgotPassword(true); // This should open the modal
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  return (
    <>
      <div className={`${isInModal ? "w-full h-full flex flex-col" : "flex items-center justify-center bg-gradient-to-br from-blue-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8"}`}>
        <div className={`${isInModal ? "w-full h-full flex flex-col px-6 py-4" : "bg-gray-800/50 backdrop-blur-lg shadow-xl rounded-2xl w-full max-w-md p-8 mx-auto border border-gray-700"}`}>
          
          {!isInModal && (
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white">Elitinova Matrimony</h1>
              <p className="text-gray-300 text-sm mt-1">
                Welcome back! Please login to continue.
              </p>
            </div>
          )}

          <form 
            onSubmit={handleSubmit} 
            className={`space-y-4 ${isInModal ? "flex-1 flex flex-col" : ""}`}
            noValidate
            id="login-form"
          >
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${isInModal ? "text-gray-700" : "text-gray-300"}`}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                disabled={loading}
                className={`w-full mt-1 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                  isInModal 
                    ? "border border-gray-300 bg-white text-gray-900 placeholder-gray-500" 
                    : "border border-gray-700 bg-gray-900/50 text-white placeholder-gray-400"
                }`}
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${isInModal ? "text-gray-700" : "text-gray-300"}`}>
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                disabled={loading}
                className={`w-full mt-1 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                  isInModal 
                    ? "border border-gray-300 bg-white text-gray-900 placeholder-gray-500" 
                    : "border border-gray-700 bg-gray-900/50 text-white placeholder-gray-400"
                }`}
              />
              
              {/* Forgot Password Link - Now below the password input */}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className={`text-sm font-medium hover:underline transition-colors ${
                    isInModal 
                      ? "text-red-600 hover:text-red-700" 
                      : "text-red-400 hover:text-red-300"
                  }`}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div 
                id="login-error-message"
                className="bg-red-100 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg mb-4 shadow-lg"
                role="alert"
              >
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <strong className="font-bold text-base text-red-900 block mb-1">Login Failed</strong>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError("")}
                    className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                    aria-label="Close error"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className={isInModal ? "mt-auto pt-4" : ""}>
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          {isInModal && onRegister && (
            <div className="flex justify-center items-center mt-4 pt-4 border-t border-gray-200 text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <button
                type="button"
                className="text-red-600 hover:text-red-700 font-medium transition-colors ml-1"
                onClick={onRegister}
              >
                Sign Up
              </button>
            </div>
          )}

          {!isInModal && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700 text-sm text-gray-300">
              <button
                type="button"
                className="hover:text-white font-medium transition-colors"
                onClick={onRegister}
              >
                Create an account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={handleCloseForgotPassword}
          initialEmail={form.email}
        />
      )}
    </>
  );
}