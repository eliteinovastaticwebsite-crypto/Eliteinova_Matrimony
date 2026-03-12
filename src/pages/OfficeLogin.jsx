import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import officeService from "../services/officeAuthService";
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const OfficeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

          {/* ✅ FIXED: form with onSubmit handler */}
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

            {/* ✅ FIXED: type="submit" so Enter key works */}
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
    </div>
  );
};

export default OfficeLogin;