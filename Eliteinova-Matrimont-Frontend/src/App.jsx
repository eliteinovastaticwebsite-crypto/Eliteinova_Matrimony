import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Upgrade from "./pages/Upgrade";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import AdminDashboard from "./components/admin/AdminDashBoard";
import ProfilesList from "./components/profiles/ProfilesList";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";
import "./index.css";
import { AuthProvider, useAuth } from "./context/AuthContext"; // ✅ CHANGED: Real AuthContext
import MyProfile from "./pages/MyProfile";
import Dashboard from "./components/common/Dashboard";
import Matches from "./components/common/Matches";
import Messages from "./components/common/Messages";
import ScrollToTop from "./components/common/ScrollToTop";
import DetailedProfilePage from "./pages/DetailedProfilePage";
import FullFAQPage from "./pages/FullFAQPage";
import FloatingActions from "./components/common/FloatingActions";
import ChatWidget from "./components/common/ChatWidget";
import Notifications from "./components/common/Notifications";
import NotificationDetails from "./pages/NotificationDetails";
import AdminLogin from "./pages/AdminLogin";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

function AppContent() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, login, register, logout, isAuthenticated, loading } = useAuth(); // ✅ CHANGED: Real auth context
  const navigate = useNavigate();

  const openRegisterModal = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const openLoginModal = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleLoginSuccess = async (credentials) => {
    try {
      console.log("🚀 App: Attempting login with credentials:", credentials);
      
      const result = await login(credentials.email, credentials.password);
      console.log("✅ App: Login result:", result);
      
      if (result.success) {
        setShowLogin(false);
        setShowRegister(false);
        navigate("/profiles");
      } else {
        alert(result.error || "Login failed");
      }
    } catch (error) {
      console.error("❌ App: Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleRegisterSuccess = async (userData) => {
    try {
      console.log("🚀 App: Attempting registration with data:", userData);
      
      // ✅ FIX: Use the real register function that handles multi-step registration
      const result = await register(userData);
      console.log("✅ App: Registration result:", result);
      
      if (result.success) {
        setShowLogin(false);
        setShowRegister(false);
        navigate("/profiles");
      } else {
        alert(result.error || "Registration failed");
      }
    } catch (error) {
      console.error("❌ App: Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* Only show Navbar and Footer for non-admin routes */}
      {!window.location.pathname.startsWith('/admin') && (
        <>
          <Navbar
            user={user}
            isAuthenticated={isAuthenticated}
            onLogin={() => setShowLogin(true)}
            onRegister={() => setShowRegister(true)}
            onLogout={logout}
          />
          <ScrollToTop />
        </>
      )}

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <Home onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal}/>
              </MainLayout>
            }
          />
          
          {/* Protected Routes */}
          <Route
            path="/profiles"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <ProfilesList onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal}/>
                </MainLayout>
              ) : (
                <div className="flex justify-center items-center min-h-screen">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">
                      Authentication Required
                    </h2>
                    <p className="text-gray-600 mb-4">Please log in to view profiles</p>
                    <button
                      onClick={openLoginModal}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors mr-2"
                    >
                      Login
                    </button>
                    <button
                      onClick={openRegisterModal}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Register
                    </button>
                  </div>
                </div>
              )
            }
          />
          
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? <Dashboard /> : (
                <div className="flex justify-center items-center min-h-screen">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Please Login</h2>
                    <button
                      onClick={openLoginModal}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Login to Continue
                    </button>
                  </div>
                </div>
              )
            } 
          />
          
          <Route 
            path="/matches" 
            element={
              isAuthenticated ? <Matches /> : (
                <div className="flex justify-center items-center min-h-screen">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Please Login</h2>
                    <button
                      onClick={openLoginModal}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Login to View Matches
                    </button>
                  </div>
                </div>
              )
            } 
          />
          
          <Route 
            path="/messages" 
            element={
              isAuthenticated ? <Messages /> : (
                <div className="flex justify-center items-center min-h-screen">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Please Login</h2>
                    <button
                      onClick={openLoginModal}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Login to View Messages
                    </button>
                  </div>
                </div>
              )
            } 
          />
          
          <Route 
            path="/my-profile" 
            element={
              isAuthenticated ? <MyProfile /> : (
                <div className="flex justify-center items-center min-h-screen">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Please Login</h2>
                    <button
                      onClick={openLoginModal}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Login to View Profile
                    </button>
                  </div>
                </div>
              )
            } 
          />

          {/* Public Routes */}
          <Route path="/aboutus" element={<AboutUs />} />
          <Route
            path="/upgrade"
            element={
              <MainLayout>
                <Upgrade onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal}/>
              </MainLayout>
            }
          />
          <Route
            path="/services"
            element={
              <MainLayout>
                <Services onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal}/>
              </MainLayout>
            }
          />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          
          <Route 
            path="/notifications" 
            element={
              isAuthenticated ? <Notifications /> : (
                <div className="flex justify-center items-center min-h-screen">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Please Login</h2>
                    <button
                      onClick={openLoginModal}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Login to View Notifications
                    </button>
                  </div>
                </div>
              )
            }             
          />
          
          <Route path="/bride-profile/:id" element={<DetailedProfilePage />} />
          <Route path="/groom-profile/:id" element={<DetailedProfilePage />} />
          <Route path="/faqs" element={<FullFAQPage />} />

          <Route path="/notifications/:id" element={<NotificationDetails />} />

          <Route path="/admin-login" element={<AdminLogin />} />
<Route 
  path="/admin/*" 
  element={
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  } 
/>

          <Route
            path="/contact"
            element={
              <MainLayout>
                <Contact />
              </MainLayout>
            }
          />
          
          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                  <div className="text-6xl mb-4">😕</div>
                  <h2 className="text-2xl font-bold text-red-600 mb-2">
                    404 - Page Not Found
                  </h2>
                  <p className="text-gray-600">
                    The page you're looking for doesn't exist.
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Only show Footer and other components for non-admin routes */}
      {!window.location.pathname.startsWith('/admin') && (
        <>
          <Footer />
          <FloatingActions
            whatsappNumber="+917845554882"
            phoneNumber="+917845554882"
          />
          <ChatWidget />
        </>
      )}

      {/* Auth Modals - Show for all routes */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center animate-fadeIn">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform scale-100 transition-all duration-300">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
            >
              ✕
            </button>
            <LoginForm
              onLoginSuccess={handleLoginSuccess} // ✅ CHANGED: Use onLoginSuccess
              onRegister={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
            />
          </div>
        </div>
      )}

      {showRegister && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center animate-fadeIn">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform scale-100 transition-all duration-300">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
            >
              ✕
            </button>
            <RegisterForm
              onRegisterSuccess={handleRegisterSuccess} // ✅ CHANGED: Use onRegisterSuccess
              onSwitchToLogin={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
  
}

export default function App() {
  return (
    <AuthProvider> {/* ✅ CHANGED: Use real AuthProvider */}
      <AppContent />
    </AuthProvider>
  );
}