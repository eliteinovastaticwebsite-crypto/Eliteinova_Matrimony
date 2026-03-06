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
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
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
  { label: "Terms & Conditions", path: "/terms&conditions" },
  { label: "Contact Us", path: "/contact" },
];


const isAdminTokenPresent = () => !!localStorage.getItem("adminToken");
const isOfficeTokenPresent = () => !!localStorage.getItem("officeToken");

export default function Navbar({ onLogin, onRegister }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");

  const isStaffAdmin = isAdminTokenPresent();
  const isStaffOffice = isOfficeTokenPresent();

  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const isFAQPage =
    location.pathname === "/faqs" ||
    location.pathname === "/faqs/" ||
    location.pathname.startsWith("/faqs");

  useEffect(() => {
    console.log("Current pathname:", location.pathname, "isFAQPage:", isFAQPage);
  }, [location.pathname, isFAQPage]);

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

  const needsShortSpacer = shortSpacerPages.includes(location.pathname);
  const spacerHeight = needsShortSpacer ? "h-10" : "h-20";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    setOpen(false);
    navigate("/");
  };

  const handleAdminDashboard = () => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      navigate("/admin/dashboard");
      setUserDropdown(false);
      setOpen(false);
    } else {
      navigate("/admin-login");
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

  const handleNotificationsClick = () => navigate("/notifications");
  const handleMessagesClick = () => navigate("/messages");

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
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white shadow-md">
        {/* Top decorative strip */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>

        <div className="max-w-7xl mx-auto flex justify-between items-center px-2 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src={Logo}
                alt="Eliteinova Matrimony Logo"
                className="w-[80px] h-[80px] rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <Link
              to="/"
              className="text-xl tracking-tight bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent group-hover:scale- transition-transform duration-300"
            >
              <span className="font-pacifico text-3xl">Elite</span>
              <span className="font-pacifico text-xl">inova</span>{" "}
              <span className="font-pacifico text-xl">Matrimony</span> <br />
              <span className="text-1.5xl">Eliteinova Tech Pvt Ltd</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center space-x-2 font-semibold text-[13px] tracking-wide">
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
          <div className="hidden md:flex space-x-3 items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
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

                {/* User Profile Dropdown */}
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

                  {userDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-fadeIn">
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
                            <p className="font-semibold text-gray-800">{user?.name}</p>
                            <p className="text-sm text-gray-600">
                              {isAdmin() ? "Administrator" : user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {isStaffAdmin && (
                        <button
                          onClick={handleAdminDashboard}
                          className="w-full px-4 py-3 text-left hover:bg-yellow-50 text-yellow-700 font-medium transition-colors flex items-center space-x-3 border-b border-gray-100"
                        >
                          <ShieldCheckIcon className="w-5 h-5" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      {!isAdmin() && (
                        <button
                          onClick={handleProfile}
                          className="w-full px-4 py-3 text-left hover:bg-yellow-50 text-gray-700 font-medium transition-colors flex items-center space-x-3"
                        >
                          <UserIcon className="w-5 h-5" />
                          <span>My Profile</span>
                        </button>
                      )}

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
              <div className="flex space-x-3 items-center">
                <button
                  onClick={handleRegisterClick}
                  className="px-5 py-3 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center"
                >
                  <UserPlusIcon className="w-4 h-4 mr-1.5" />
                  Register
                </button>

                <button
                  onClick={handleLoginClick}
                  className="px-5 py-3 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Login
                </button>

                <div className="relative">
                  <button
                    onClick={() => setMoreDropdown(!moreDropdown)}
                    className="px-3 py-3 bg-white/10 border border-yellow-400/50 text-white rounded-full font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-1.5"
                    title="Staff Access"
                  >
                    <Bars3Icon className="w-4 h-4" />
                    <ChevronDownIcon
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        moreDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {moreDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-fadeIn">
                      <p className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-100">
                        Staff Access
                      </p>
                      <button
                        onClick={() => {
                          navigate("/office-login");
                          setMoreDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-yellow-50 text-gray-700 font-medium transition-colors flex items-center space-x-3"
                      >
                        <ShieldCheckIcon className="w-5 h-5 text-yellow-600" />
                        <span>Office Login</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/admin-login");
                          setMoreDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 text-gray-700 font-medium transition-colors flex items-center space-x-3 border-t border-gray-100"
                      >
                        <ShieldCheckIcon className="w-5 h-5 text-red-600" />
                        <span>Admin Login</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 bg-white/10 text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <Bars3Icon className="w-5 h-5" />
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
                        section.scrollIntoView({ behavior: "auto", block: "start" });
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
              </Link>
            ))}

            {isStaffAdmin && (
              <button
                onClick={handleAdminDashboard}
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
              </button>
            )}

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
                    <p className="font-bold text-lg text-white">{user?.name || "User"}</p>
                    <p className="text-sm text-yellow-100">
                      {isAdmin()
                        ? "Administrator"
                        : user?.membership
                        ? `${user.membership} Member`
                        : "Premium Member"}
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                      <button
                        onClick={handleAdminDashboard}
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
                    <p className="text-sm">Start your journey today</p>
                  </div>

                  <button
                    onClick={() => { handleRegisterClick(); setOpen(false); }}
                    className="w-full px-4 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-2xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    Register Now
                  </button>

                  <button
                    onClick={() => { handleLoginClick(); setOpen(false); }}
                    className="w-full px-4 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-2xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Login
                  </button>

                  <div className="border-t border-white/20 pt-4">
                    <p className="text-white/60 text-xs text-center mb-3 uppercase tracking-wider">
                      Staff Access
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { navigate("/office-login"); setOpen(false); }}
                        className="px-4 py-3 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <ShieldCheckIcon className="w-5 h-5" />
                        Office
                      </button>
                      <button
                        onClick={() => { navigate("/admin-login"); setOpen(false); }}
                        className="px-4 py-3 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <ShieldCheckIcon className="w-5 h-5" />
                        Admin
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className={spacerHeight}></div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      {(userDropdown || moreDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setUserDropdown(false); setMoreDropdown(false); }}
        ></div>
      )}

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