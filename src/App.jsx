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
import TermsAndConditions from "./pages/TermsAndConditions"; // ✅ NEW
import "./index.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import MyProfile from "./pages/MyProfile";
import Matches from "./components/common/Matches";
import Messages from "./components/common/Messages";
import ScrollToTop from "./components/common/ScrollToTop";
import DetailedProfilePage from "./pages/DetailedProfilePage";
import FullFAQPage from "./pages/FullFAQPage";
import FloatingActions from "./components/common/FloatingActions";
import Notifications from "./components/common/Notifications";
import NotificationDetails from "./pages/NotificationDetails";
import AdminLogin from "./pages/AdminLogin";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import AdminResetPassword from "./pages/AdminResetPassword";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import PaymentProtectedRoute from "./components/common/PaymentProtectedRoute";
import OfficeLogin from "./pages/OfficeLogin";
import PaymentSuccess from "./pages/PaymentSuccess";
import RegistrationCompletion from "./pages/RegistrationCompletion";

function AppContent() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, login, register, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (showLogin || showRegister) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLogin, showRegister]);

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
      if (result && result.success) {
        setShowLogin(false);
        setShowRegister(false);
        navigate("/profiles");
      } else {
        const error = new Error(result?.error || "Login failed");
        error.error = result?.error || "Login failed";
        throw error;
      }
    } catch (error) {
      console.error("❌ App: Login error:", error);
      throw error;
    }
  };

  const handleRegisterSuccess = async (userData) => {
    try {
      console.log("🚀 App: Attempting registration with data:", userData);
      const result = await register(userData);
      console.log("✅ App: Registration result:", result);
      if (result.success) {
        setShowLogin(false);
        setShowRegister(false);
        navigate("/profiles", { replace: true });
      } else {
        alert(result.error || "Registration failed");
      }
    } catch (error) {
      console.error("❌ App: Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

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
    <div className="flex flex-col min-h-screen bg-gray-50 w-full max-w-full overflow-x-hidden">

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

          <Route
            path="/profiles"
            element={
              <PaymentProtectedRoute>
                <MainLayout>
                  <ProfilesList onOpenRegister={openRegisterModal} onOpenLogin={openLoginModal}/>
                </MainLayout>
              </PaymentProtectedRoute>
            }
          />

          <Route
            path="/matches"
            element={
              <PaymentProtectedRoute>
                <Matches />
              </PaymentProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <PaymentProtectedRoute>
                <Messages />
              </PaymentProtectedRoute>
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

          {/* ✅ NEW: Terms & Conditions route — supports both URL variants */}
          <Route path="/terms&conditions" element={<TermsAndConditions />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

          <Route
            path="/notifications"
            element={
              <PaymentProtectedRoute>
                <Notifications />
              </PaymentProtectedRoute>
            }
          />

          <Route path="/bride-profile/:id" element={<DetailedProfilePage />} />
          <Route path="/groom-profile/:id" element={<DetailedProfilePage />} />
          <Route path="/faqs" element={<FullFAQPage onOpenRegister={openRegisterModal} />} />
          <Route path="/notifications/:id" element={<NotificationDetails />} />

          <Route
            path="/registration-completion"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <RegistrationCompletion />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/payment-success"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <PaymentSuccess />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/office-login" element={<OfficeLogin />} />
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

          {/* 404 */}
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

      {!window.location.pathname.startsWith('/admin') && (
        <>
          <Footer
            onRegister={openRegisterModal}
            onLogin={openLoginModal}
          />
          <FloatingActions
            whatsappNumber="+919940200736"
            phoneNumber="+919940200736"
            onRegister={openRegisterModal}
            onLogin={openLoginModal}
            isAuthenticated={isAuthenticated}
          />
        </>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center animate-fadeIn p-4 overflow-hidden"
          onClick={(e) => { if (e.target === e.currentTarget) setShowLogin(false); }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[95vh] transform scale-100 transition-all duration-300 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-t-2xl p-5 text-white shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Welcome Back</h2>
                  <p className="text-red-100 mt-1">Sign in to your account</p>
                </div>
                <button
                  onClick={() => setShowLogin(false)}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200 ml-4 shrink-0"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>
            <div
              className="flex-1 overflow-y-auto min-h-0 overscroll-contain"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
                onRegister={() => { setShowLogin(false); setShowRegister(true); }}
                isInModal={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center animate-fadeIn p-4 overflow-hidden"
          onClick={(e) => { if (e.target === e.currentTarget) setShowRegister(false); }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[95vh] transform scale-100 transition-all duration-300 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-t-2xl p-5 text-white shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Create Your Account</h2>
                  <p className="text-red-100 mt-1">Join our matrimony service</p>
                </div>
                <button
                  onClick={() => setShowRegister(false)}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200 ml-4 shrink-0"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>
            <div
              className="flex-1 overflow-y-auto min-h-0 overscroll-contain"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <RegisterForm
                onRegisterSuccess={handleRegisterSuccess}
                onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
                onClose={() => setShowRegister(false)}
                isInModal={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}