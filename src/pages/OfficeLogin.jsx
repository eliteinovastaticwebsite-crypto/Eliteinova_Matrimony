import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import officeService from "../services/officeAuthService";

const OfficeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // If already logged in
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
      console.log("Office login response:", res);
      
      if (res.success) {
        console.log("✅ Office login successful, redirecting to dashboard");
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError(res.message || res.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Office login error:", err);
      setError(err.message || err.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white text-center">
          Office Login
        </h2>
        <p className="text-gray-400 text-sm text-center mt-1">
          Eliteinova Matrimony
        </p>

        {error && (
          <div className="mt-4 bg-red-900/40 text-red-300 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="office@eliteinova.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfficeLogin;
