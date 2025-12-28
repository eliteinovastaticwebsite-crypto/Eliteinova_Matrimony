import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function LoginForm({ onLoginSuccess, onRegister, isInModal }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🔥 FIXED: We are NOT logging in here.
      // The AuthModal will call AuthContext.login(email, password)
      onLoginSuccess({
        email: form.email,
        password: form.password
      });
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isInModal ? "" : "flex items-center justify-center bg-gradient-to-br from-blue-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8"}`}>
      <div className={`${isInModal ? "w-full" : "bg-gray-800/50 backdrop-blur-lg shadow-xl rounded-2xl w-full max-w-md p-8 mx-auto border border-gray-700"}`}>
        
        {!isInModal && (
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white">Elitnxt Matrimony</h1>
            <p className="text-gray-300 text-sm mt-1">
              Welcome back! Please login to continue.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

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
  );
}
