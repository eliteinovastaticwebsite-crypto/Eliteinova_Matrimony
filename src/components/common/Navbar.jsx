import React, { useState, useEffect, useRef } from "react";
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

const authenticatedExtraLinks = [
  { label: "Terms & Conditions", path: "/terms&conditions" },
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

  const moreDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const isStaffAdmin = isAdminTokenPresent();
  const isStaffOffice = isOfficeTokenPresent();

  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const shortSpacerPages = ["/", "/aboutus", "/upgrade", "/services", "/profiles", "/contact"];
  const needsShortSpacer = shortSpacerPages.includes(location.pathname);
  const spacerHeight = needsShortSpacer ? "h-10" : "h-20";

  const authNavLinks = [...navLinks, ...authenticatedExtraLinks];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target)) {
        setMoreDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    } else {
      navigate("/admin-login");
    }
    setUserDropdown(false);
    setOpen(false);
    setMoreDropdown(false);
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
    setMoreDropdown(false);
  };

  const handleRegisterClick = () => {
    setAuthModalMode("register");
    setShowAuthModal(true);
    setOpen(false);
    setMoreDropdown(false);
  };

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  const handleNavLinkClick = (e, link) => {
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
          const top = section.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top, behavior: "auto" });
        }
      };
      if (location.pathname === "/") {
        jumpToSection();
      } else {
        navigate("/", { replace: false });
        setTimeout(jumpToSection, 100);
      }
    }
    setOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white shadow-md"
        style={{ overflow: "visible" }}
      >
        {/* Top decorative strip */}
        <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400" />

        <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4 py-3">

          {/* ── Logo ── */}
          <div className="flex items-center space-x-3 group flex-shrink-0">
            <img
              src={Logo}
              alt="Eliteinova Matrimony Logo"
              className="w-[70px] h-[70px] rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
            />
            <Link
              to="/"
              className="text-xl tracking-tight bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent"
            >
              <span className="font-pacifico text-3xl">Elite</span>
              <span className="font-pacifico text-3xl">inova</span>{" "}
              <span className="font-pacifico text-xl">Matrimony</span>
              <br />
              <span className="text-base font-normal">Eliteinova Tech Pvt Ltd</span>
            </Link>
          </div>

          {/* ── Desktop Nav Links ── */}
          <ul className="hidden lg:flex items-center gap-1 font-semibold text-[13.5px] tracking-wide flex-wrap justify-center flex-1 px-4">
            {(isAuthenticated ? authNavLinks : publicNavLinks).map((link) => (
              <li key={link.path} className="relative group">
                <Link
                  to={link.path}
                  onClick={(e) => handleNavLinkClick(e, link)}
                  className={`relative py-2 px-1 transition-all duration-200 whitespace-nowrap ${
                    location.pathname === link.path
                      ? "text-yellow-400 font-bold"
                      : "text-white hover:text-yellow-300"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full ${
                      location.pathname === link.path ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              </li>
            ))}
            {isStaffAdmin && (
              <li className="relative group">
                <button
                  onClick={handleAdminDashboard}
                  className="relative py-2 px-1 transition-all duration-200 flex items-center gap-1 text-yellow-300 hover:text-yellow-200"
                >
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              </li>
            )}
          </ul>

          {/* ── Desktop Auth Buttons ── */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {!isStaffAdmin && !isStaffOffice && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate("/notifications")}
                      className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
                    >
                      <BellIcon className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-pulse">3</span>
                    </button>
                    <button
                      onClick={() => navigate("/messages")}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
                    >
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* User Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className={`flex items-center gap-2 rounded-full pl-1 pr-4 py-1 border-2 transition-all duration-300 ${
                      isAdmin()
                        ? "bg-yellow-400/20 border-yellow-400 hover:border-yellow-500"
                        : "bg-white/10 border-yellow-400/30 hover:border-yellow-400"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-lg relative ${
                      isAdmin() ? "bg-gradient-to-br from-yellow-500 to-yellow-600" : "bg-gradient-to-br from-yellow-400 to-yellow-500"
                    }`}>
                      {getInitials(user?.name)}
                      {isAdmin() && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />}
                    </div>
                    <span className="font-semibold text-white text-sm">
                      {isAdmin() ? "Admin" : `Hi, ${user?.name?.split(" ")[0] || "User"}`}
                    </span>
                    <ChevronDownIcon className={`w-4 h-4 text-yellow-300 transition-transform duration-300 ${userDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {userDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-[9999] animate-fadeIn">
                      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold relative ${
                          isAdmin() ? "bg-gradient-to-br from-yellow-500 to-yellow-600" : "bg-gradient-to-br from-yellow-400 to-yellow-500"
                        }`}>
                          {getInitials(user?.name)}
                          {isAdmin() && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                          <p className="text-xs text-gray-500">{isAdmin() ? "Administrator" : user?.email}</p>
                        </div>
                      </div>

                      {isStaffAdmin && (
                        <button onClick={handleAdminDashboard} className="w-full px-4 py-3 text-left hover:bg-yellow-50 text-yellow-700 font-medium text-sm transition-colors flex items-center gap-3 border-b border-gray-100">
                          <ShieldCheckIcon className="w-5 h-5" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      {!isAdmin() && (
                        <button onClick={handleProfile} className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors flex items-center gap-3">
                          <UserIcon className="w-5 h-5" />
                          <span>My Profile</span>
                        </button>
                      )}

                      <button onClick={handleLogout} className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 font-medium text-sm transition-colors flex items-center gap-3 border-t border-gray-100">
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRegisterClick}
                  className="px-4 py-2.5 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:scale-105 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <UserPlusIcon className="w-4 h-4" />
                  Register
                </button>

                <button
                  onClick={handleLoginClick}
                  className="px-4 py-2.5 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:scale-105 whitespace-nowrap"
                >
                  Login
                </button>

                {/* Staff Access Dropdown */}
                <div className="relative" ref={moreDropdownRef}>
                  <button
                    onClick={() => setMoreDropdown(!moreDropdown)}
                    className="p-2.5 bg-white/10 border border-yellow-400/50 text-white rounded-full font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-1"
                    title="Staff Access"
                  >
                    <Bars3Icon className="w-4 h-4" />
                    <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-300 ${moreDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {moreDropdown && (
                    <div
                      className="absolute mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 animate-fadeIn"
                      style={{ right: 0, top: "100%", zIndex: 9999 }}
                    >
                      <p className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-100">
                        Staff Access
                      </p>
                      <button
                        onClick={() => { navigate("/office-login"); setMoreDropdown(false); }}
                        className="w-full px-4 py-3 text-left hover:bg-yellow-50 text-gray-700 font-medium text-sm transition-colors flex items-center gap-3"
                      >
                        <ShieldCheckIcon className="w-5 h-5 text-yellow-600" />
                        <span>Office Login</span>
                      </button>
                      <button
                        onClick={() => { navigate("/admin-login"); setMoreDropdown(false); }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 text-gray-700 font-medium text-sm transition-colors flex items-center gap-3 border-t border-gray-100"
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
            className="md:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden bg-gradient-to-b from-red-700 via-red-600 to-red-500 ${
            open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-6 space-y-3">
            {(isAuthenticated ? authNavLinks : publicNavLinks).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => { handleNavLinkClick(e, link); setOpen(false); }}
                className={`block py-3 text-base font-semibold transition-all duration-300 border-l-4 pl-5 ${
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
                className="w-full text-left py-3 text-base font-semibold border-l-4 border-yellow-400 pl-5 text-yellow-300 bg-white/10 rounded-r-xl flex items-center gap-2"
              >
                <ShieldCheckIcon className="w-5 h-5" />
                Admin Dashboard
              </button>
            )}

            {isAuthenticated && (
              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg relative ${
                    isAdmin() ? "bg-gradient-to-br from-yellow-500 to-yellow-600" : "bg-gradient-to-br from-yellow-400 to-yellow-500"
                  }`}>
                    {getInitials(user?.name)}
                    {isAdmin() && <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />}
                  </div>
                  <div>
                    <p className="font-bold text-white">{user?.name || "User"}</p>
                    <p className="text-sm text-yellow-100">
                      {isAdmin() ? "Administrator" : user?.membership ? `${user.membership} Member` : "Premium Member"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/20 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {!isAdmin() && (
                      <button onClick={handleProfile} className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg">
                        <UserIcon className="w-5 h-5" />
                        My Profile
                      </button>
                    )}
                    {isStaffAdmin && (
                      <button onClick={handleAdminDashboard} className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl font-bold transition-all shadow-lg">
                        <ShieldCheckIcon className="w-5 h-5" />
                        Admin Panel
                      </button>
                    )}
                    <button onClick={handleLogout} className="px-4 py-3 rounded-2xl font-bold border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-red-900 transition-all">
                      Logout
                    </button>
                  </div>

                  {!isStaffAdmin && !isStaffOffice && (
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => navigate("/notifications")} className="relative p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white flex flex-col items-center gap-1">
                        <BellIcon className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-pulse">3</span>
                        <span className="text-xs">Alerts</span>
                      </button>
                      <button onClick={() => navigate("/messages")} className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white flex flex-col items-center gap-1">
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        <span className="text-xs">Messages</span>
                      </button>
                      <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white flex flex-col items-center gap-1">
                        <HeartIcon className="w-5 h-5" />
                        <span className="text-xs">Matches</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-center p-4 rounded-2xl bg-white/10 text-yellow-100">
                    <HeartIcon className="w-7 h-7 mx-auto mb-2 text-red-300" />
                    <p className="text-sm">Start your journey today</p>
                  </div>

                  <button
                    onClick={() => { handleRegisterClick(); setOpen(false); }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    Register Now
                  </button>

                  <button
                    onClick={() => { handleLoginClick(); setOpen(false); }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Login
                  </button>

                  <div className="border-t border-white/20 pt-3">
                    <p className="text-white/60 text-xs text-center mb-3 uppercase tracking-wider">Staff Access</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { navigate("/office-login"); setOpen(false); }}
                        className="px-4 py-3 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                      >
                        <ShieldCheckIcon className="w-5 h-5 text-yellow-400" />
                        Office
                      </button>
                      <button
                        onClick={() => { navigate("/admin-login"); setOpen(false); }}
                        className="px-4 py-3 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                      >
                        <ShieldCheckIcon className="w-5 h-5 text-red-300" />
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

      <div className={spacerHeight} />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
      `}</style>
    </>
  );
}