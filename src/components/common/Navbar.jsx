import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { navLinks } from "../../config/footerLinks";
import Logo from "../../assets/Logo.png";
import AuthModal from "../auth/AuthModal";
import { useAuth } from "../../context/AuthContext";

const publicNavLinks = [
  { label: "Home", path: "/" },
  { path: "/mobileapp", label: "MobileApp" },
  { label: "About", path: "/aboutus" },
  { path: "/faqs", label: "FAQs" },
  { path: "/services", label: "Services" },
  { path: "/upgrade", label: "Upgrade" },
  { label: "Privacy-Policy", path: "/privacypolicy" },
  { label: "Contact Us", path: "/contact" },
];

const isAdminTokenPresent = () => !!localStorage.getItem("adminToken");
const isOfficeTokenPresent = () => !!localStorage.getItem("officeToken");

export default function Navbar({ onLogin, onRegister }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");

  const isStaffAdmin = isAdminTokenPresent();
const isStaffOffice = isOfficeTokenPresent();


  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  // Check if we're on the FAQ page - more explicit check
  const isFAQPage = location.pathname === "/faqs" || 
                     location.pathname === "/faqs/" ||
                     location.pathname.startsWith("/faqs");
  
  // Debug log (remove in production)
  useEffect(() => {
    console.log("Current pathname:", location.pathname, "isFAQPage:", isFAQPage);
  }, [location.pathname, isFAQPage]);

  // Pages that need h-10 spacer
  const shortSpacerPages = [
    "/",
    "/aboutus",
    "/upgrade",
    "/services",
    "/profiles",
    "/contact",
  ];

  useEffect(() => {
    console.log("🔄 Navbar Re-rendered with auth state:", {
      isAuthenticated,
      user: user?.name,
      role: user?.role,
      isAdmin: isAdmin?.(),
    });
  }, [isAuthenticated, user, isAdmin]);

  // Check if current page needs short spacer
  const needsShortSpacer = shortSpacerPages.includes(location.pathname);
  const spacerHeight = needsShortSpacer ? "h-10" : "h-20";

  // Check scroll position (keeping for other functionality)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    console.log("🚪 Logging out user:", user?.name);
    logout();
    setUserDropdown(false);
    setOpen(false);
    navigate("/");
    console.log("✅ Logout completed");
  };

  const handleAdminDashboard = () => {
  console.log("🛠️ Navigating to admin dashboard");
  
  // Check if user is admin using adminService, not regular auth
  const adminToken = localStorage.getItem('adminToken');
  if (adminToken) {
    navigate("/admin/dashboard");
    setUserDropdown(false);
    setOpen(false);
  } else {
    console.log("🔄 No admin token, redirecting to admin login");
    navigate('/admin-login');
  }
};

  const handleProfile = () => {
    navigate("/my-profile");
    setOpen(false);
    setUserDropdown(false);
  };

  const handleLoginClick = () => {
    setAuthModalMode("login");
    setShowAuthModal(true);
    setOpen(false);
  };

  const handleRegisterClick = () => {
    setAuthModalMode("register");
    setShowAuthModal(true);
    setOpen(false);
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  const handleMessagesClick = () => {
    navigate("/messages");
  };

  // Debug info - remove in production
  useEffect(() => {
    console.log("🔍 Navbar State Update:", {
      isAuthenticated,
      user: user?.name,
      role: user?.role,
      isAdmin: isAdmin(),
    });
  }, [isAuthenticated, user, isAdmin]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white shadow-lg`}
      >
        {/* Top decorative strip */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>

        <div className="max-w-7xl mx-auto flex justify-between items-center px-2 py-2">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src={Logo}
                alt="BalaSabari Matrimony Logo"
                className="w-[80px] h-[80px] rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <Link
              to="/"
              className="text-2xl tracking-tight bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent group-hover:scale- transition-transform duration-300"
            >
              <span className="font-pacifico text-4xl">Elite</span>
              <span className="font-pacifico text-2xl">inova</span> <br />{" "}
              Matrimony
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center space-x-3 font-semibold text-[15px] tracking-wide">
            {(isAuthenticated ? navLinks : publicNavLinks).map((link) => (
              <li key={link.path} className="relative group">
                <Link
                  to={link.path}
                  onClick={(e) => {
                    const scrollTargets = {
                      "/faqs": "faq-section",
                      "/mobileapp": "mobileapp-section",
                    };

                    if (scrollTargets[link.path]) {
                      e.preventDefault();
                      const sectionId = scrollTargets[link.path];

                      const jumpToSection = () => {
                        const section = document.getElementById(sectionId);
                        if (section) {
                          const offset = 100;
                          const top =
                            section.getBoundingClientRect().top +
                            window.scrollY -
                            offset;
                          window.scrollTo({ top, behavior: "auto" });
                        }
                      };

                      if (location.pathname === "/") {
                        jumpToSection();
                      } else {
                        navigate("/", { replace: false });
                        setTimeout(() => jumpToSection(), 100);
                      }

                      setOpen(false);
                      return;
                    }

                    setOpen(false);
                  }}
                  className={`relative py-2 transition-all duration-50 ${
                    location.pathname === link.path
                      ? "text-yellow-400 font-bold"
                      : "text-white hover:text-yellow-300"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full ${
                      location.pathname === link.path ? "w-full" : ""
                    }`}
                  ></span>
                </Link>
              </li>
            ))}

            {/* Admin Dashboard Link - Only show for admin users */}
            {isStaffAdmin && (
              <li className="relative group">
                <Link
                  to="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAdminDashboard();
                  }}
                  className={`relative py-2 transition-all duration-50 flex items-center space-x-1 ${
                    location.pathname.startsWith("/admin")
                      ? "text-yellow-400 font-bold"
                      : "text-white hover:text-yellow-300"
                  }`}
                >
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span>Admin</span>
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full ${
                      location.pathname.startsWith("/admin") ? "w-full" : ""
                    }`}
                  ></span>
                </Link>
              </li>
            )}
          </ul>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex space-x-4 items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                {/* Notification Icons - Hide for admin if needed */}
                {!isStaffAdmin && !isStaffOffice && (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleNotificationsClick}
                      className="p-2 rounded-full transition-all duration-300 hover:scale-110 relative bg-white/10 hover:bg-white/20 text-white"
                    >
                      <BellIcon className="w-6 h-6" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        3
                      </span>
                    </button>

                    <button
                      onClick={handleMessagesClick}
                      className="p-2 rounded-full transition-all duration-300 hover:scale-110 bg-white/10 hover:bg-white/20 text-white"
                    >
                      <ChatBubbleLeftRightIcon className="w-6 h-6" />
                    </button>
                  </div>
                )}

                {/* User Profile with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className={`flex items-center space-x-3 rounded-full pl-1 pr-4 py-1 border-2 transition-all duration-300 ${
                      isAdmin()
                        ? "bg-yellow-400/20 border-yellow-400 hover:border-yellow-500"
                        : "bg-white/10 border-yellow-400/30 hover:border-yellow-400"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg relative ${
                        isAdmin()
                          ? "bg-gradient-to-br from-yellow-500 to-yellow-600"
                          : "bg-gradient-to-br from-yellow-400 to-yellow-500"
                      }`}
                    >
                      {getInitials(user?.name)}
                      {isAdmin() && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-white">
                        {isAdmin()
                          ? "Admin"
                          : `Hi, ${user?.name?.split(" ")[0] || "User"}`}
                      </span>
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform duration-300 text-yellow-300 ${
                          userDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {userDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-fadeIn">
                      {/* User Info */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold relative ${
                              isAdmin()
                                ? "bg-gradient-to-br from-yellow-500 to-yellow-600"
                                : "bg-gradient-to-br from-yellow-400 to-yellow-500"
                            }`}
                          >
                            {getInitials(user?.name)}
                            {isAdmin() && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {user?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {isAdmin() ? "Administrator" : user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Admin Dashboard Link */}
                      {isStaffAdmin && (
  <button onClick={handleAdminDashboard}
                          className="w-full px-4 py-3 text-left hover:bg-yellow-50 text-yellow-700 font-medium transition-colors flex items-center space-x-3 border-b border-gray-100"
                        >
                          <ShieldCheckIcon className="w-5 h-5" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      {/* Regular User Options */}
                      {!isAdmin() && (
                        <button
                          onClick={handleProfile}
                          className="w-full px-4 py-3 text-left hover:bg-yellow-50 text-gray-700 font-medium transition-colors flex items-center space-x-3"
                        >
                          <UserIcon className="w-5 h-5" />
                          <span>My Profile</span>
                        </button>
                      )}

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 font-medium transition-colors flex items-center space-x-3 border-t border-gray-100"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex space-x-4 items-center">
                {/* Auth Buttons */}
                <button
                  onClick={handleLoginClick}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Login
                </button>

                <button
        onClick={() => navigate('/office-login')}
        className="px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center"
      >
        <ShieldCheckIcon className="w-5 h-5 mr-2" />
        Office
      </button>

                {/* ✅ ADD THIS ADMIN LOGIN BUTTON */}
      <button
        onClick={() => navigate('/admin-login')}
        className="px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center"
      >
        <ShieldCheckIcon className="w-5 h-5 mr-2" />
        Admin
      </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-3 rounded-xl transition-all duration-300 hover:scale-110 bg-white/10 text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden bg-gradient-to-b from-red-700 via-red-600 to-red-500 ${
            open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-6 space-y-4">
            {/* Navigation Links */}
            {(isAuthenticated ? navLinks : publicNavLinks).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  const scrollTargets = {
                    "/faqs": "faq-section",
                    "/mobileapp": "mobileapp-section",
                  };

                  if (scrollTargets[link.path]) {
                    e.preventDefault();
                    const sectionId = scrollTargets[link.path];

                    const jumpToSection = () => {
                      const section = document.getElementById(sectionId);
                      if (section) {
                        section.scrollIntoView({
                          behavior: "auto",
                          block: "start",
                        });
                      }
                    };

                    if (location.pathname === "/") {
                      jumpToSection();
                    } else {
                      navigate("/", { replace: false });
                      setTimeout(() => jumpToSection(), 100);
                    }

                    setOpen(false);
                    return;
                  }

                  setOpen(false);
                }}
                className={`block py-4 text-lg font-semibold transition-all duration-300 border-l-4 pl-6 relative group ${
                  location.pathname === link.path
                    ? "text-yellow-400 border-yellow-400 bg-white/10 rounded-r-xl"
                    : "text-white border-transparent hover:text-yellow-300 hover:border-yellow-300 hover:bg-white/5"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full ${
                    location.pathname === link.path ? "w-full" : ""
                  }`}
                ></span>
              </Link>
            ))}

            {/* Admin Dashboard Link in Mobile - Only for admin */}
            {isStaffAdmin && (
  <button onClick={handleAdminDashboard}
                className={`w-full text-left block py-4 text-lg font-semibold transition-all duration-300 border-l-4 pl-6 relative group ${
                  location.pathname.startsWith("/admin")
                    ? "text-yellow-400 border-yellow-400 bg-white/10 rounded-r-xl"
                    : "text-white border-transparent hover:text-yellow-300 hover:border-yellow-300 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span>Admin Dashboard</span>
                </div>
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full ${
                    location.pathname.startsWith("/admin") ? "w-full" : ""
                  }`}
                ></span>
              </button>
            )}

            {/* User Info if logged in */}
            {isAuthenticated && (
              <div className="pt-6 border-t border-white/20">
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg relative ${
                      isAdmin()
                        ? "bg-gradient-to-br from-yellow-500 to-yellow-600"
                        : "bg-gradient-to-br from-yellow-400 to-yellow-500"
                    }`}
                  >
                    {getInitials(user?.name)}
                    {isAdmin() && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-yellow-100">
                      {isAdmin() ? "Administrator" : "Premium Member"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Buttons - Conditional */}
            <div className="pt-6 border-t border-white/20 space-y-4">
              {isAuthenticated ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {!isAdmin() && (
                      <button
                        onClick={handleProfile}
                        className="flex items-center justify-center space-x-2 px-4 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 rounded-2xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg"
                      >
                        <UserIcon className="w-6 h-6" />
                        <span>My Profile</span>
                      </button>
                    )}
                    {isStaffAdmin && (
  <button onClick={handleAdminDashboard}
                        className="flex items-center justify-center space-x-2 px-4 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg"
                      >
                        <ShieldCheckIcon className="w-6 h-6" />
                        <span>Admin Panel</span>
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="px-4 py-4 rounded-2xl font-bold transition-all duration-300 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-red-900"
                    >
                      Logout
                    </button>
                  </div>

                  {/* Quick Actions - Hide for admin */}
                  {!isStaffAdmin && !isStaffOffice && (
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={handleNotificationsClick}
                        className="p-2 rounded-full transition-all duration-300 hover:scale-110 relative bg-white/10 hover:bg-white/20 text-white"
                      >
                        <BellIcon className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                          3
                        </span>
                      </button>

                      <button
                        onClick={handleMessagesClick}
                        className="p-2 rounded-full transition-all duration-300 hover:scale-110 bg-white/10 hover:bg-white/20 text-white"
                      >
                        <ChatBubbleLeftRightIcon className="w-6 h-6" />
                      </button>

                      <button className="p-3 rounded-xl text-center transition-all bg-white/10 hover:bg-white/20 text-white">
                        <HeartIcon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs">Matches</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-4 rounded-2xl bg-white/10 text-yellow-100">
                    <HeartIcon className="w-8 h-8 mx-auto mb-2 text-red-400" />
                    <p className="text-sm opacity-80">
                      Start your journey today
                    </p>
                  </div>

                  <div className="grid gap-4 grid-cols-1">
                    <button
                      onClick={handleLoginClick}
                      className="px-4 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-2xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg"
                    >
                      Login
                    </button>
                  </div>

                   <button
    onClick={() => {
      navigate('/office-login');
      setOpen(false);
    }}
    className="w-full px-4 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-2xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg flex items-center justify-center"
  >
    <ShieldCheckIcon className="w-5 h-5 mr-2" />
    Office
  </button>

                  <button
    onClick={() => {
      navigate('/admin-login');
      setOpen(false);
    }}
    className="w-full px-4 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-2xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg flex items-center justify-center"
  >
    <ShieldCheckIcon className="w-5 h-5 mr-2" />
    Admin
  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className={spacerHeight}></div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      {/* Close dropdown when clicking outside */}
      {userDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserDropdown(false)}
        ></div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
