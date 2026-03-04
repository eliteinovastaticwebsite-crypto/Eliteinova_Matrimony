// src/pages/Home.jsx - FIXED VERSION WITH ID ATTRIBUTES
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../components/auth/LoginCard";
import CategoryNav from "../components/common/CategoryNav";
import { useAuth } from "../context/AuthContext"; 
import ProfileService from "../services/profileService";
import AuthModal from "../components/auth/AuthModal";
import FAQSection from "../components/common/FAQSection";
import Banner from "../components/common/Banner";
import MobilAppSection from "../components/common/MobilAppSection";

import BannerImage3 from "../assets/BannerImage3.jpg";
import BannerImage4 from "../assets/BannerImage4.png";

const homeBannerImages = [BannerImage3, BannerImage4];

const homeBannerTexts = [
  {
    title: "Find Your Perfect Match with Trust & Tradition",
    subtitle: "Trusted by thousands of Tamil families worldwide for authentic and compatible matches.",
    cta: "Register Now",
  },
];

export default function Home({ onOpenAuthModal }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("register");
  const [stats, setStats] = useState({
    profiles: 400,
    marriages: 100,
    cities: 50,
  });
  const [featuredProfiles, setFeaturedProfiles] = useState([]);
  const [communityStats, setCommunityStats] = useState({});
  const [loadingStates, setLoadingStates] = useState({
    featuredProfiles: true,
    communityStats: true,
    banners: false,
  });

  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth(); // ✅ Now using real AuthContext

  // Format numbers with commas
  const formatNumber = useCallback((num) => {
    return num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  }, []);

  useEffect(() => {
    loadHomePageData();

    // Animate stats counter with proper cleanup
    const interval = setInterval(() => {
      setStats((prev) => ({
        profiles: prev.profiles + Math.floor(Math.random() * 10),
        marriages: prev.marriages + Math.floor(Math.random() * 5),
        cities: prev.cities,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadHomePageData = async () => {
    try {
      setLoadingStates((prev) => ({
        ...prev,
        featuredProfiles: true,
        communityStats: true,
      }));

      // ✅ FIXED: Use real ProfileService instead of mock
      // Load featured profiles from real backend
      const featuredResult = await ProfileService.getAllProfiles(0, 6); // Get first 6 profiles
      if (featuredResult && featuredResult.content) {
        setFeaturedProfiles(featuredResult.content.slice(0, 3)); // Show first 3 as featured
      } else {
        setFeaturedProfiles(getDefaultFeaturedProfiles());
      }

      // For community stats, use real data or fallback
      setCommunityStats({
        Vanniyar: 1250,
        Gounder: 980,
        Thevar: 850,
        Nadar: 720,
        Iyer: 650,
        Chettiar: 580,
      });
    } catch (error) {
      console.error("Error loading home page data:", error);
      // Fallback to default data
      setFeaturedProfiles(getDefaultFeaturedProfiles());
      setCommunityStats({
        Vanniyar: 1250,
        Gounder: 980,
        Thevar: 850,
        Nadar: 720,
        Iyer: 650,
        Chettiar: 580,
      });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        featuredProfiles: false,
        communityStats: false,
      }));
    }
  };

  const handleLoginSuccess = useCallback(async (userData) => {
    console.log("Login successful from HomePage:", userData);
    setShowAuthModal(false);
    // Reload data if needed after login
    await loadHomePageData();
  }, []);

  const handleRegisterFromCard = useCallback(() => {
    setAuthModalMode("register");
    setShowAuthModal(true);
  }, []);

  const handleLoginFromCard = useCallback(() => {
    setAuthModalMode("login");
    setShowAuthModal(true);
  }, []);

  const handleViewAllProfiles = useCallback(() => {
    navigate("/profiles");
  }, [navigate]);

  const handleCategorySelect = useCallback(
    (category) => {
      if (isAuthenticated) {
        navigate("/profiles", { state: { selectedCategory: category } });
      } else {
        setAuthModalMode("register");
        setShowAuthModal(true);
      }
    },
    [isAuthenticated, navigate]
  );

  const handleProfileClick = useCallback((profileId) => {
    if (isAuthenticated) {
      navigate(`/profile/${profileId}`);
    } else {
      setAuthModalMode("register");
      setShowAuthModal(true);
    }
  }, [isAuthenticated, navigate]);

  // Get default featured profiles for fallback
  const getDefaultFeaturedProfiles = useCallback(() => {
    return [
      {
        id: 1,
        name: "Arun Kumar",
        age: 28,
        gender: "Male",
        education: "Software Engineer",
        location: "Chennai",
        caste: "Vanniyar",
        isPremium: true,
        isVerified: true,
      },
      {
        id: 2,
        name: "Deepa Priya",
        age: 25,
        gender: "Female",
        education: "IT Analyst",
        location: "Salem",
        caste: "Vanniyar",
        isPremium: false,
        isVerified: true,
      },
      {
        id: 3,
        name: "Suresh Gounder",
        age: 32,
        gender: "Male",
        education: "Agriculture Engineer",
        location: "Coimbatore",
        caste: "Gounder",
        isPremium: true,
        isVerified: true,
      },
    ];
  }, []);

  // Get top communities for display
  const getTopCommunities = useCallback(() => {
    const communities = Object.entries(communityStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([community, count]) => ({ community, count }));

    return communities.length > 0
      ? communities
      : [
          { community: "Vanniyar", count: 1250 },
          { community: "Gounder", count: 980 },
          { community: "Thevar", count: 850 },
          { community: "Nadar", count: 720 },
          { community: "Iyer", count: 650 },
          { community: "Chettiar", count: 580 },
        ];
  }, [communityStats]);

  const handleCreateProfile = useCallback(() => {
    if (isAuthenticated) {
      navigate("/create-profile");
    } else {
      setAuthModalMode("register");
      setShowAuthModal(true);
    }
  }, [isAuthenticated, navigate]);

  const isLoading = loadingStates.featuredProfiles || loadingStates.communityStats;

  return (
    <div className="w-full flex flex-col relative overflow-hidden min-h-screen bg-white">
      <Banner
        images={homeBannerImages}
        texts={homeBannerTexts}
        autoPlayInterval={3000}
        onOpenAuthModal={handleRegisterFromCard}
      />

      {/* Launch Offer Banner - Prominent Display */}
{!isAuthenticated && (
  <div className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 py-6 px-4 relative overflow-hidden shadow-2xl">
    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 opacity-75 animate-pulse"></div>
    <div className="container mx-auto relative z-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Register Now */}
        <div className="text-center md:text-left">
          <h3 className="text-white font-bold text-2xl md:text-3xl mb-2 animate-bounce">
            🎉 Register Now! 🎉
          </h3>
          <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="text-white/90 text-sm md:text-base">Silver ₹299</span>
            <span className="text-white font-bold">|</span>
            <span className="text-white/90 text-sm md:text-base">Gold ₹499</span>
            <span className="text-white font-bold">|</span>
            <span className="text-white/90 text-sm md:text-base">Diamond ₹749</span>
          </div>
        </div>

        {/* Middle: EliteInova Matrimonial Services */}
        <div className="text-center flex flex-col items-center gap-2 border-l border-r border-white/30 px-6 md:px-10">
          <h3 className="text-white font-bold text-xl md:text-2xl drop-shadow-md whitespace-nowrap">
            💍 EliteInova Matrimonial Services
          </h3>
          
           <a href="https://matrimonial-services.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-orange-600 px-5 py-2 rounded-lg hover:bg-orange-50 transition-all duration-300 font-semibold text-sm md:text-base shadow-md hover:shadow-lg hover:scale-105 transform whitespace-nowrap"
          >
            Visit Our Service Page →
          </a>
        </div>

        {/* Right: Register Now Button */}
        <button
          onClick={handleRegisterFromCard}
          className="bg-white text-red-600 px-8 py-4 rounded-xl hover:bg-red-50 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-110 transform flex items-center space-x-2 whitespace-nowrap"
        >
          <span>Register Now</span>
          <span className="text-2xl">👉</span>
        </button>
      </div>
    </div>
  </div>
)}

      {/* Category Navigation at the top */}
      <CategoryNav onSelect={handleCategorySelect} />

      {/* Quick Navigation Bar */}
<div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm overflow-x-auto">
  <div className="container mx-auto px-4 py-3">
    <div className="flex items-center space-x-2 min-w-max">
      {[
        { label: "Premium Plans",              id: "premium-plans" },
        { label: "Matrimonial Services",       id: "matrimonial-services" },
        { label: "Find by Profession",         id: "find-by-profession" },
        { label: "Matrimony Mobile App",       id: "mobile-app" },
        { label: "Trustful Services",          id: "trusted-matrimony" },
        { label: "Why Eliteinova",             id: "why-eliteinova" },
        { label: "Horoscope Matching",         id: "horoscope-matching" },
        { label: "Success Stories",            id: "success-stories" },
      ].map((link, i) => (
        <button
          key={i}
          onClick={() => {
            const element = document.getElementById(link.id);
            if (element) {
              const headerOffset = 100; // Height of the sticky header plus some padding
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              
              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
              });
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-red-50/50 text-red-600 text-xs sm:text-sm font-medium hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full group-hover:bg-white"></span>
          {link.label}
        </button>
      ))}
    </div>
  </div>
</div>

      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-200 via-white to-gray-200 py-8 lg:py-16">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Premium Registration */}
            <div className="space-y-8">
              <div className="space-y-6">
                {/* Trust Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 shadow-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-red-600 text-sm font-medium uppercase">
                    Most Trusted Matrimony Service
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Find Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-400">
                    Perfect Match
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed text-justify">
                  Join{" "}
                  {/* <span className="font-semibold text-red-500">
                    {formatNumber(stats.profiles)}+
                  </span>{" "} */}
                  verified members in their journey to find lifelong partners.
                  Where tradition meets modern matchmaking.
                </p>
              </div>

              {/* Quick Action Buttons */}
              {!isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleRegisterFromCard}
                    disabled={isLoading}
                    className="relative bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <>
                        <span>Register Now </span>
                        <span className="text-xl transform group-hover:scale-110 transition-transform">
                          🎯
                        </span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleLoginFromCard}
                    disabled={isLoading}
                    className="bg-white text-red-600 border-2 border-red-600 px-8 py-4 rounded-xl hover:bg-red-50 transition-all duration-300 font-bold text-lg hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleViewAllProfiles}
                    className="bg-gradient-to-r from-red-600 to-yellow-400 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-yellow-500 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2 group"
                  >
                    <span>Browse All Profiles</span>
                    <span className="text-xl transform group-hover:scale-110 transition-transform">
                      👥
                    </span>
                  </button>
                  <button
                    onClick={logout}
                    className="bg-white text-gray-600 border-2 border-gray-200 px-8 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 font-bold text-lg hover:shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* Quick Features */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {[
                  "100% Verified Profiles",
                  "Secure & Private",
                  "24/7 Support",
                  "Register Now",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <span className="text-green-500">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Integrated Cards */}
            <div className="space-y-6">
              {/* User Welcome Card if logged in */}
              {isAuthenticated && user && (
                <div className="bg-gradient-to-br from-green-200 to-gray-300 rounded-2xl border border-gray-300 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        Welcome back, {user.name?.split(" ")[0] || "User"}!
                      </h3>
                      <p className="text-gray-600">
                        Ready to find your perfect match?
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="text-sm font-semibold text-gray-700">
                        Profile Views
                      </div>
                      <div className="text-lg font-bold text-red-500">24</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="text-sm font-semibold text-gray-700">
                        Matches
                      </div>
                      <div className="text-lg font-bold text-red-500">12</div>
                    </div>
                  </div>
                  <button
                    onClick={handleViewAllProfiles}
                    className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                  >
                    Find Matches
                  </button>
                </div>
              )}

              {/* Login Card for quick access */}
              {!isAuthenticated && (
                <div className="transform hover:scale-[1.02] transition-all duration-300">
                  <LoginCard
                    onRegister={handleRegisterFromCard}
                    onLoginSuccess={handleLoginSuccess}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* ===================================================
    BOTTOM CTA BANNER - SEPARATE SECTION
    =================================================== */}

<section id="premium-plans" className="py-6 bg-gradient-to-b from-white via-gray-50 to-white">
  
  <div className="container mx-auto px-4 lg:px-8">
    {/* Badge OUTSIDE above the box */}
<div className="flex justify-start mb-3">
  <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 shadow-sm">
    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
    <span className="text-red-600 text-sm font-medium uppercase">Premium & Assisted Matrimony Services</span>
  </div>
</div>
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 shadow-2xl">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
       
      
      <div className="relative z-10 flex flex-col md:flex-row items-stretch">

        {/* ── LEFT ── */}
        
        <div className="flex-1 px-4 sm:px-6 md:px-8 py-6 text-center flex flex-col items-center justify-center">
          
          <div className="text-4xl mb-2 animate-bounce">💍</div>

          <h3 className="text-white font-bold text-xl sm:text-2xl md:text-3xl mb-2">
            Start Your Journey Today
          </h3>

          <p className="text-white/90 text-xs sm:text-sm max-w-md mx-auto mb-3 leading-relaxed text-justify">
            If you are searching for a trusted Tamil matrimony service, Eliteinova Matrimony is your ideal choice. We combine tradition, technology, and trust to help you find your perfect match.
          </p>

          <p className="text-white font-semibold text-xs sm:text-sm mb-4 flex items-center justify-center gap-2 px-2 text-center">
            <span>Register today and begin your beautiful marriage journey with Eliteinova Matrimony.</span>
          </p>

          {/* Pricing Cards */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4">
            {[
              { name: "Silver",  price: "₹299", featured: false },
              { name: "Gold",    price: "₹499", featured: true  },
              { name: "Diamond", price: "₹749", featured: false },
            ].map((plan, i) => (
              <div key={i}
                className={`bg-white/10 backdrop-blur rounded-xl px-3 sm:px-5 py-1.5 sm:py-2 text-center border border-white/30 hover:scale-105 transition-all duration-300
                  ${plan.featured ? "ring-2 ring-yellow-300 scale-105 shadow-xl bg-white/20" : ""}`}>
                <div className="text-white font-bold text-xs sm:text-base">{plan.name}</div>
                <div className="text-white/80 text-[10px] sm:text-xs">{plan.price}</div>
              </div>
            ))}
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1 text-white/80 text-[10px] sm:text-xs max-w-md mx-auto">
            {[
              "100% Verified Profiles",
              "Community-specific Matchmaking",
              "Confidential Bride and Groom Search",
              "Flexible Membership Plans",
              "24/7 Customer Assistance",
              "Premium Matchmaking Assistance",
            ].map((feature, i, arr) => (
              <span key={i} className="flex items-center gap-1 hover:text-white transition-colors">
                <span>✓</span>
                <span>{feature}</span>
                {i < arr.length - 1 && <span className="hidden md:inline text-white/40">•</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-white/20 my-6"></div>

        {/* ── RIGHT ── */}
        <div className="flex-1 px-4 sm:px-6 md:px-8 py-6 flex flex-col items-center justify-center gap-4">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-xl">
              <span className="text-2xl sm:text-3xl">🛡️</span>
            </div>
            <h2 className="text-white font-bold text-sm sm:text-base md:text-lg">Premium &amp; Assisted Matrimony Services</h2>
            <h3 className="text-white font-bold text-sm sm:text-base md:text-lg">Verified &amp; Genuine Profiles</h3>
            <p className="text-white/80 text-[10px] sm:text-xs">Safe · Authentic · Trusted</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-xs">
            {[
              { value: "100%", label: "Profile Review" },
              { value: "24/7", label: "Customer Assistance" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/15 backdrop-blur rounded-xl p-2 sm:p-3 text-center border border-white/25">
                <div className="text-base sm:text-lg md:text-xl font-bold text-white">{stat.value}</div>
                <div className="text-white/80 text-[8px] sm:text-[10px] md:text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Premium Features */}
          <div className="w-full max-w-xs bg-white/10 backdrop-blur rounded-2xl p-3 sm:p-4 border border-white/20">
            <h4 className="font-bold text-white text-xs sm:text-sm mb-1">Premium &amp; Assisted Matrimony Services</h4>
            <p className="text-white/70 text-[10px] sm:text-xs mb-2">Upgrade your membership to unlock:</p>
            <div className="space-y-1.5">
              {[
                "Direct contact details",
                "Unlimited profile viewing",
                "Priority profile listing",
                "Best Tamil Matrimony Site for best matchers",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/90 text-[10px] sm:text-xs">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>


      {/* ===================================================
    MATRIMONIAL SERVICES SECTION - BIGGER FONTS + WIDER IMAGE
    =================================================== */}

<section id="matrimonial-services" className="py-8 bg-gradient-to-b from-white via-gray-50 to-white">
  <div className="container mx-auto px-4 sm:px-2 lg:px-4">
    <div className="flex justify-start mb-3">
  <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 shadow-sm">
    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
    <span className="text-red-600 text-sm font-medium uppercase">Eliteinova Matrimonial Services</span>
  </div>
</div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
      
      {/* LEFT SIDE - CONTENT - BIGGER FONTS */}
      <div className="space-y-4 px-4 sm:px-0">
        {/* Main Heading - Much Bigger */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight text-center sm:text-left">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">Eliteinova Matrimonial Services</span>
        </h1>

        {/* Two-line Description - Bigger */}
        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify">
          Access our Vendor, Customer, and Matrimony portals.<br />
          Find your perfect partner with verified profiles and expert matchmaking.
        </p>

        {/* ADDED CONTENT - Portals Description */}
        <div className="grid grid-cols-3 gap-2 pt-0.2">
          <div className="bg-red-50 p-2 sm:p-3 rounded-lg border border-red-100 text-center">
            <span className="text-xl sm:text-2xl block mb-1">🏢</span>
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Vendor Portal</h4>
            <p className="text-[10px] sm:text-xs text-gray-600">Partner services access</p>
          </div>
          <div className="bg-red-50 p-2 sm:p-3 rounded-lg border border-red-100 text-center">
            <span className="text-xl sm:text-2xl block mb-1">👤</span>
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Customer Portal</h4>
            <p className="text-[10px] sm:text-xs text-gray-600">Access your profile</p>
          </div>
          <div className="bg-red-50 p-2 sm:p-3 rounded-lg border border-red-100 text-center">
            <span className="text-xl sm:text-2xl block mb-1">💍</span>
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Matrimony Portal</h4>
            <p className="text-[10px] sm:text-xs text-gray-600">Find your partner</p>
          </div>
        </div>

        {/* Button - Bigger */}
        <div className="pt-3 flex justify-center sm:justify-start">
          <a 
            href="https://matrimonial-services.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl"
          >
            Visit Our Service Page →
          </a>
        </div>
      </div>

      {/* RIGHT SIDE - IMAGE - WIDER TO MATCH SPACE */}
      <div className="lg:justify-self-end w-full flex justify-center px-4 sm:px-0">
  <div 
    className="bg-gradient-to-br from-red-50 to-amber-50 rounded-2xl p-3 border border-red-200 shadow-xl hover:shadow-2xl transition-all"
    style={{
      width: '100%',
      maxWidth: '500px',
      margin: '0 auto'
    }}
  >
          
          {/* Main Image - CUSTOM WIDTH AND HEIGHT */}
          <div className="bg-white rounded-xl overflow-hidden border-2 border-red-200 mb-1">
            <img 
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Indian Wedding Couple"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              style={{
                width: '100%',
                height: 'auto',
                minHeight: '160px',
                maxHeight: '190px',
                objectFit: 'cover'
              }}
            />
          </div>
          
          {/* Image Caption */}
          <p className="text-center text-xs sm:text-sm font-medium text-gray-700 mb-1">Matrimony • Vendor • Customer Portals</p>
          
          {/* Additional Content Below Image */}
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center bg-white/80 p-1 sm:p-0.5 rounded-lg">
              <div className="text-base sm:text-lg font-bold text-red-600">500+</div>
              <div className="text-[10px] sm:text-xs text-gray-600">Wedding Vendors</div>
            </div>
            <div className="text-center bg-white/80 p-1 sm:p-0.5 rounded-lg">
              <div className="text-base sm:text-lg font-bold text-red-600">1000+</div>
              <div className="text-[10px] sm:text-xs text-gray-600">Happy Couples</div>
            </div>
          </div>
          
          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 bg-green-50 p-1.5 sm:p-2 rounded-lg border border-green-100 mt-2 sm:mt-3">
            <span className="text-green-600 text-xs sm:text-sm">✓</span>
            <span className="text-[10px] sm:text-xs text-gray-700">All portals are verified and secure</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>


{/* ===================================================
    FIND BY PROFESSION SECTION - SEPARATE SECTION
    =================================================== */}

<section id="find-by-profession" className="py-8 sm:py-12 bg-gradient-to-b from-white via-gray-50 to-white">
  <div className="container mx-auto px-4 lg:px-8">
    {/* ── ROW: Content LEFT | Image RIGHT ── */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
      
      {/* Left Content */}
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
        <div className="inline-flex items-center gap-3 bg-red-50 px-4 py-2 rounded-full border border-red-100">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">Find by Profession</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-center sm:text-left">
          Find Brides & Grooms <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">by Profession</span>
        </h2>

        <p className="text-base sm:text-lg text-gray-600 text-center sm:text-left">We offer specialized searches for:</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          {[
            { icon: "🩺", label: "Doctors" },
            { icon: "⚙️", label: "Engineers" },
            { icon: "💻", label: "IT Professionals" },
            { icon: "🏛️", label: "Government Employees" },
            { icon: "💼", label: "Business Owners" },
            { icon: "📊", label: "Chartered Accountants" },
            { icon: "📚", label: "Teachers" },
            { icon: "🚀", label: "Entrepreneurs" },
            { icon: "⚖️", label: "Lawyers" },
            { icon: "🏦", label: "Bankers" },
            { icon: "✈️", label: "Pilots" },
            { icon: "🎓", label: "Professors" }
          ].map((profession, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center hover:border-red-300 hover:shadow-lg hover:scale-105 transition-all cursor-pointer group">
              <span className="text-xl sm:text-2xl block mb-1 group-hover:scale-110 transition-transform">{profession.icon}</span>
              <span className="text-gray-800 text-[10px] sm:text-xs font-medium group-hover:text-red-600 transition-colors text-center leading-tight">{profession.label}</span>
            </div>
          ))}
        </div>

        <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-justify">Our intelligent matchmaking system suggests profiles based on shared goals, lifestyle compatibility, and family background.</p>
      </div>

      {/* Right Panel */}
      <div className="lg:sticky lg:top-8 px-2 sm:px-0">
        <div className="bg-gradient-to-br from-amber-50 to-red-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-yellow-400 opacity-75 animate-pulse"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-xl">
                <span className="text-3xl sm:text-4xl">🌍</span>
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl">Global Presence</h3>
              <p className="text-white/90 text-sm sm:text-base">Serving Families Worldwide</p>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
             <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2">All Over India</h3>

             <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-xl p-3 sm:p-4 border border-red-100">
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-2">Specified Indian Cities:</h4>
              <p className="text-gray-600 text-xs sm:text-sm">Bangalore | Hyderabad | Mumbai | Delhi | Pune</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-xl p-3 sm:p-4 border border-red-100">
              <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-2">Tamil Nadu Cities:</h4>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">Chennai | Coimbatore | Madurai | Salem | Trichy | Erode | Tirunelveli | Vellore | Thanjavur | Tiruppur</p>
            </div>
             <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2">International Locations</h3>
            <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-xl p-3 sm:p-4 border border-red-100">
              <p className="text-gray-600 text-xs sm:text-sm">USA | UK | Canada | Australia | Singapore | Malaysia | Dubai | Sri Lanka</p>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 italic text-center">We help brides and grooms connect globally while preserving traditional values.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>
   
   <div id="mobile-app">
  <MobilAppSection onRegister={!isAuthenticated ? handleRegisterFromCard : null} />
</div>



    {/* ===================================================
    PASTE THIS BETWEEN HERO SECTION AND <MobilAppSection />
    =================================================== */}

<section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
  {/* Decorative Background Elements */}
  <div className="absolute inset-0 opacity-30">
    <div className="absolute top-40 left-20 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
    <div className="absolute top-60 right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-40 left-1/2 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
  </div>

  <div className="container mx-auto px-4 lg:px-8 relative z-10">

    {/* ── ROW 1: Content LEFT | Image RIGHT ── */}
    <div id="trusted-matrimony" className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-12 sm:mb-16 md:mb-20">
      
      {/* Content Column */}
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
        <div className="inline-flex items-center gap-3 bg-red-50 px-4 py-2 rounded-full border border-red-100">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">Trustful Services</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-center sm:text-left">
          Trusted Matrimony Service for <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">Meaningful Matches</span>
        </h2>
        
        <div className="space-y-3 sm:space-y-4 text-gray-600">
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-justify">Welcome to Eliteinova Matrimony, one of the most trusted and growing matrimony websites dedicated to helping brides and grooms find compatible matches based on tradition, values, and family preferences.</p>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-justify">Marriage is not just a union of two individuals but a bond between two families. At Eliteinova, we understand the importance of culture, community background, and compatibility in marriages. Whether you are searching for an All over the World bride or groom across India, and abroad, we help you connect with genuine profiles quickly and safely.</p>
        </div>

        {/* Benefits Card */}
        <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-2xl p-4 sm:p-6 border border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">Benefits of Online Tamil Matrimony</h4>
          <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">Choosing Eliteinova Matrimony gives you:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {[
              "Time-saving partner search",
              "Access to thousands of verified Tamil profiles",
              "Community-specific matchmaking",
              "Confidential bride and groom search",
              "Flexible membership plans",
              "24/7 customer assistance",
              "Premium matchmaking assistance"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-700">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-justify">Online matrimony platforms simplify the traditional marriage process while maintaining cultural values. Eliteinova is a premium Online Tamil Marriage Bureau offering online searching for matches. Leading Online Marriage Bureau in India. We serve families across Tamil Nadu, Chennai, Bangalore, Mumbai, Delhi, and global Tamil communities in the USA, UK, Singapore, Australia, and the Middle East.</p>
      </div>

      {/* Sticky Image Panel */}
      <div className="lg:sticky lg:top-8 px-4 sm:px-0">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
          {/* Header with gradient from Home.jsx */}
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-yellow-400 opacity-75 animate-pulse"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-xl">
                <span className="text-3xl sm:text-4xl">💍</span>
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl">Eliteinova Matrimony</h3>
              <p className="text-white/90 font-medium text-sm sm:text-base">Trusted · Verified · Growing</p>
            </div>
          </div>

          {/* Steps */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4 text-center">How to Register on Eliteinova Matrimony?</h4>
              <p className="text-xs sm:text-sm text-gray-500 text-center mb-3 sm:mb-4">Getting started is simple:</p>
              <div className="space-y-2 sm:space-y-3">
                {[
                  "Create a free account",
                  "Complete your profile with accurate details",
                  "Upload recent photographs",
                  "Start searching & sending interests",
                  "Upgrade to premium to directly connect with potential matches"
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3 group">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md group-hover:scale-110 transition-transform">
                      <span className="text-white text-[10px] sm:text-xs font-bold">{i + 1}</span>
                    </div>
                    <span className="text-gray-700 text-xs sm:text-sm group-hover:text-gray-900 transition-colors">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-xl p-4 sm:p-5 border border-red-100">
              <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2">Start Your Journey Today</h4>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 text-justify">If you are searching for a trusted Tamil matrimony service, Eliteinova Matrimony is your ideal choice. We combine tradition, technology, and trust to help you find your perfect match.</p>
              <p className="text-red-600 font-semibold text-xs sm:text-sm flex items-center gap-2">
                <span className="text-lg sm:text-xl">💍</span>
                <span>Register today and begin your beautiful marriage journey</span>
              </p>
            </div>
          </div>
        </div>
         {!isAuthenticated && (
  <div className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden w-[90%] sm:w-10/12 md:w-8/12 lg:w-7/12 mx-auto my-5">
    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 opacity-75 animate-pulse"></div>
    <div className="relative z-10 text-center">
      <h3 className="text-white font-bold text-base sm:text-xl md:text-2xl mb-1 animate-bounce">
        🎉 Register Now! 🎉
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mb-2">
        <span className="text-white/90 text-[11px] sm:text-sm">Silver ₹299</span>
        <span className="text-white font-bold text-[11px] sm:text-sm">|</span>
        <span className="text-white/90 text-[11px] sm:text-sm">Gold ₹499</span>
        <span className="text-white font-bold text-[11px] sm:text-sm">|</span>
        <span className="text-white/90 text-[11px] sm:text-sm">Diamond ₹749</span>
      </div>
      <button
        onClick={handleRegisterFromCard}
        className="bg-red-600 hover:bg-red-700 text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        Register Now
      </button>
    </div>
  </div>
)}
      </div>
    </div>

    {/* ── ROW 2: Image LEFT | Content RIGHT ── */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-12 sm:mb-16 md:mb-20">
      
      {/* Left Column with Two Panels */}
      <div className="lg:sticky lg:top-8 space-y-4 sm:space-y-6 px-4 sm:px-0">
        
        {/* Panel 1 */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
          <div className="bg-gradient-to-r from-amber-500 via-red-500 to-red-600 p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-red-500 to-red-600 opacity-75 animate-pulse"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-xl">
                <span className="text-3xl sm:text-4xl">💍</span>
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl">Eliteinova Matrimony</h3>
              <p className="text-white/90 text-sm sm:text-base">Trusted · Verified · Growing</p>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1 text-center">Communities We Serve</h4>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-3 sm:mb-4">Find your perfect match within your community</p>

            <div className="grid grid-cols-2 gap-1 sm:gap-2">
              {[
                "Mudaliar Matrimony",
                "Pillai Matrimony",
                "Naidu Matrimony",
                "Reddy Matrimony",
                "Kamma Matrimony",
                "Brahmin Matrimony",
                "Kshatriya Matrimony",
                "Vaishya Matrimony",
                "Viswakarma Matrimony",
                "Nair Matrimony",
                "Ezhava Matrimony",
                "Maravar Matrimony",
                "Kallar Matrimony",
                "Agamudayar Matrimony",
                "Balija Matrimony",
                "Bestha Matrimony",
                "Boyer Matrimony",
                "Chakkiliyar Matrimony",
                "Vanniyar Matrimony",
                "Gounder Matrimony",
                "Thevar Matrimony",
                "Nadar Matrimony",
                "Vellalar Matrimony",
                "Kongu Vellalar Matrimony",
                "Iyer Matrimony",
                "Iyengar Matrimony",
                "Chettiar Matrimony",
              ].map((community, i) => (
                <span
                  key={i}
                  className="px-2 sm:px-3 py-1 sm:py-2 rounded-full border border-red-200 text-gray-700 text-[10px] sm:text-xs hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-all duration-200 cursor-pointer text-center"
                >
                  {community}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column Content */}
      <div id="why-eliteinova" className="space-y-6 sm:space-y-8 px-4 sm:px-0">
        <div className="inline-flex items-center gap-3 bg-red-50 px-4 py-2 rounded-full border border-red-100">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">Why Eliteinova</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-center sm:text-left">
          Why is Eliteinova the Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">Tamil Matrimony Website?</span>
        </h2>

        <div className="space-y-6 sm:space-y-8">
          {/* Point 1 */}
          <div className="space-y-1 sm:space-y-2">
            <h4 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2 sm:gap-3">
              <span className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-md">1</span>
              Verified & Genuine Profiles
            </h4>
            <p className="text-gray-600 text-sm sm:text-base pl-8 sm:pl-10 text-justify">We prioritize authenticity. Every profile is reviewed to ensure it meets our quality standards. Our goal is to reduce fake profiles and create a safe matchmaking experience.</p>
          </div>

          {/* Point 2 */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2 sm:gap-3">
              <span className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-md">2</span>
              Community-Based Tamil Matrimony
            </h4>
            <p className="text-gray-600 text-sm sm:text-base pl-8 sm:pl-10 text-justify">We provide exclusive matchmaking services for major Tamil communities including:</p>
            <div className="pl-8 sm:pl-10 flex flex-wrap gap-1 sm:gap-2">
              {[
                "Vanniyar Matrimony", "Gounder Matrimony", "Thevar Matrimony", "Nadar Matrimony", "Vellalar Matrimony",
                "Kongu Vellalar Matrimony", "Iyer Matrimony", "Iyengar Matrimony", "Chettiar Matrimony", "Mudaliar Matrimony"
              ].map((community, i) => (
                <span key={i} className="bg-gradient-to-r from-red-50 to-amber-50 text-red-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border border-red-200 hover:border-red-300 hover:shadow-md transition-all">
                  {community}
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-sm sm:text-base pl-8 sm:pl-10 text-justify">Our community filters make it easy to find the perfect partner within your caste and tradition. Whether you are looking for a Tamil Bride Search or Tamil Groom Search, Eliteinova perfect matchmaking services tailored to your expectations.</p>
          </div>

          {/* Point 3 */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2 sm:gap-3">
              <span className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-md">3</span>
              Advanced Partner Search Options
            </h4>
            <p className="text-gray-600 text-sm sm:text-base pl-8 sm:pl-10">You can filter matches by:</p>
            <div className="pl-8 sm:pl-10 grid grid-cols-2 gap-2 sm:gap-3">
              {[
                "Age & Location",
                "Education & Profession",
                "Community & Sub-caste",
                "Income & Lifestyle Preferences"
              ].map((filter, i) => (
                <div key={i} className="flex items-center gap-1 sm:gap-2 text-gray-700">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs sm:text-sm">{filter}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs sm:text-sm pl-8 sm:pl-10">This ensures accurate and highly compatible results.</p>
          </div>

          {/* Point 4 */}
          <div>
            <h4 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2 sm:gap-3">
              <span className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-md">4</span>
              Safe & Secure Matrimony Platform
            </h4>
            <p className="text-gray-600 text-sm sm:text-base pl-8 sm:pl-10 text-justify">Your privacy is our top priority. We use strong security measures to protect user data and personal information.</p>
          </div>
        </div>
      </div>
    </div>

    {/* ── ROW 4: Image LEFT | Content RIGHT ── */}
    <div id="horoscope-matching" className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-12 sm:mb-16 md:mb-20">
      
      {/* Left Panel */}
      <div className="lg:sticky lg:top-8 px-4 sm:px-0">
        <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-500 p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-rose-400 opacity-75 animate-pulse"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-xl">
                <span className="text-3xl sm:text-4xl">⭐</span>
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl">Horoscope Matching</h3>
              <p className="text-white/90 text-sm sm:text-base">Jathagam Matching</p>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {[
                { val: "Rasi", desc: "Star Sign" },
                { val: "Nakshatra", desc: "Birth Star" },
                { val: "Dosham", desc: "Dosha Check" },
                { val: "Jathagam", desc: "Compatibility" }
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-red-50 to-amber-50 rounded-xl p-3 sm:p-4 text-center border border-red-100 hover:border-red-300 hover:shadow-md transition-all">
                  <div className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">{item.val}</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">{item.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 italic text-center">Families who prioritize astrology can find suitable partners easily using our refined search options.</p>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
        <div className="inline-flex items-center gap-3 bg-red-50 px-4 py-2 rounded-full border border-red-100">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">Horoscope Matching</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-center sm:text-left">
          Horoscope Matching <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">(Jathagam Matching)</span>
        </h2>

        <p className="text-base sm:text-lg text-gray-600 text-center sm:text-left">Horoscope compatibility plays an important role in Tamil marriages. Our platform allows users to filter matches based on:</p>

        <div className="space-y-2 sm:space-y-3">
          {["Rasi", "Nakshatra", "Dosham", "Jathagam Matching"].map((item, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-red-100 to-amber-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-2 h-2 sm:w-3 sm:h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-800 text-sm sm:text-base font-medium group-hover:text-red-600 transition-colors">{item}</span>
            </div>
          ))}
        </div>

        <p className="text-gray-600 text-sm sm:text-base text-justify">Families who prioritize astrology can find suitable partners easily using our refined search options.</p>
      </div>
    </div>
  </div>

  <section id="success-stories" className="py-10 bg-gradient-to-b from-white via-red-50 to-white">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

      {/* LEFT: Text Content */}
      <div>
        <div className="inline-flex items-center gap-3 bg-red-50 px-4 py-2 rounded-full border border-red-100 mb-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-600 text-sm font-semibold uppercase tracking-wider">Success Stories</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Success Stories – Building Happy Families
        </h3>

        <div className="space-y-3">
          <p className="text-gray-600 text-base text-justify leading-relaxed">
            Thousands of Tamil brides and grooms have found their life partners through Eliteinova Matrimony. We are proud to contribute to successful marriages rooted in trust, compatibility, and tradition.
          </p>
          <p className="text-gray-600 text-base text-justify leading-relaxed">
            Our growing community proves that finding a perfect life partner online can be secure, simple, and successful.
          </p>
        </div>
      </div>

      {/* RIGHT: Stats / Highlights */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { value: "More", label: "Happy Couples", icon: "💑" },
          { value: "98%",     label: "Success Rate",  icon: "⭐" },
          { value: "27+",     label: "Communities",   icon: "🏘️" },
          { value: "24/7",    label: "Support",       icon: "🤝" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md border border-red-100 p-5 text-center hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">
              {stat.value}
            </div>
            <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

    </div>
  </div>
</section>
  {/* Add the animation styles from Home.jsx */}
  <style>{`
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `}</style>
</section>

{/* === END OF SECTION === */}

    {!isAuthenticated && (
  <div className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-2xl p-4 sm:p-8 shadow-2xl relative overflow-hidden w-[90%] sm:w-10/12 md:w-8/12 lg:w-7/12 mx-auto my-5">
    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 opacity-75 animate-pulse"></div>
    <div className="relative z-10 text-center">
      <h3 className="text-white font-bold text-base sm:text-2xl md:text-3xl mb-1.5 animate-bounce">
        🎉 Register Now! 🎉
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mb-3">
        <span className="text-white/90 text-[11px] sm:text-sm">Silver ₹299</span>
        <span className="text-white font-bold text-[11px] sm:text-sm">|</span>
        <span className="text-white/90 text-[11px] sm:text-sm">Gold ₹499</span>
        <span className="text-white font-bold text-[11px] sm:text-sm">|</span>
        <span className="text-white/90 text-[11px] sm:text-sm">Diamond ₹749</span>
      </div>
      <button
        onClick={handleRegisterFromCard}
        className="bg-red-600 hover:bg-red-700 text-white px-5 sm:px-8 py-2 sm:py-3 rounded-xl font-bold text-xs sm:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        Register Now
      </button>
    </div>
  </div>
)}
      
      {/* Professional How It Works Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-2 h-6 sm:w-2 sm:h-8 bg-red-600 mr-2 sm:mr-3"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                How It Works
              </h2>
              <div className="w-2 h-6 sm:w-2 sm:h-8 bg-red-600 ml-2 sm:ml-3"></div>
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light px-4 text-justify">
              A streamlined process designed to help you find meaningful connections with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                desc: "Build your comprehensive profile with essential details and preferences",
                icon: (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                delay: "0",
              },
              {
                step: "02",
                title: "Verification Process",
                desc: "Complete our secure verification to ensure authenticity and trust",
                icon: (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                delay: "100",
              },
              {
                step: "03",
                title: "Discover Matches",
                desc: "Receive curated matches based on compatibility and shared values",
                icon: (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                delay: "200",
              },
              {
                step: "04",
                title: "Connect & Communicate",
                desc: "Engage in meaningful conversations with verified matches",
                icon: (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                delay: "300",
              },
            ].map((item, index) => (
              <div key={index} className="group relative">
                {/* Main Card */}
                <div className="relative bg-white rounded-lg border border-gray-200 hover:border-red-300 shadow-sm hover:shadow-md transition-all duration-300 h-full overflow-hidden">
                  
                  {/* Top Accent Bar */}
                  <div className="h-1 bg-gradient-to-r from-red-600 to-red-500"></div>
                  
                  {/* Card Content */}
                  <div className="p-4 sm:p-6 md:p-8">
                    {/* Step Number */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="text-xl sm:text-2xl font-bold text-gray-400 group-hover:text-red-600 transition-colors duration-300">
                        {item.step}
                      </div>
                      {/* Icon */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center text-red-600 transition-colors duration-300">
                        {item.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-xs sm:text-sm font-light text-justify">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Progress Connector (Desktop) */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <div className="w-8 h-0.5 bg-gray-300 group-hover:bg-red-300 transition-colors duration-300">
                        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-400 group-hover:bg-red-500 rounded-full transition-colors duration-300"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Progress Line (Mobile) */}
          <div className="lg:hidden mt-8 sm:mt-12">
            <div className="flex justify-center">
              <div className="flex space-x-6 sm:space-x-8">
                {[0, 1, 2, 3].map((dot) => (
                  <div key={dot} className="flex flex-col items-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full mb-1 sm:mb-2"></div>
                    {dot < 3 && <div className="w-6 sm:w-8 h-0.5 bg-gray-300 mt-1"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          {/* <div className="text-center mt-20 pt-8 border-t border-gray-100">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Ready to Begin Your Journey?
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-sm font-light">
                Join thousands of successful matches who found their life partners through our platform
              </p>
              <div className="space-y-4">
                <button 
                  onClick={handleCreateProfile}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Create Your Profile
                </button>
                <div className="text-xs text-gray-500">
                  Verified profiles • Secure platform
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Premium Services Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Our <span className="text-red-500">Services Include</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 text-justify">
              Comprehensive services designed to make your matchmaking journey
              seamless and successful
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
            {/* Premium Membership Plans */}
            <div className="group bg-white rounded-2xl border border-red-500/20 p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-xl sm:text-2xl text-white">👑</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base sm:text-lg md:text-xl">
                    Membership Plans
                  </div>
                  <div className="text-red-500 font-semibold text-xs sm:text-sm">
                    Premium Membership Options
                  </div>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  Choose the plan that{" "}
                  <span className="text-red-500">fits you best</span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    "Complete profile creation",
                    "Premium advanced features",
                    "Unlimited matches",
                    "Priority customer support",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-xs sm:text-sm">✓</span>
                      </div>
                      <span className="text-gray-700 text-xs sm:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleCreateProfile}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-2 sm:py-3 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl mt-4 sm:mt-6 group-hover:scale-105"
                >
                  View Plans →
                </button>
              </div>
            </div>

            {/* Profile Verification & Privacy Controls */}
            <div className="group bg-white rounded-2xl border border-red-500/20 p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-xl sm:text-2xl text-white">🔒</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base sm:text-lg md:text-xl">
                    Verification & Privacy
                  </div>
                  <div className="text-red-500 font-semibold text-xs sm:text-sm">
                    Secure & Trusted
                  </div>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  Your safety is our{" "}
                  <span className="text-red-500">top priority</span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    "Advanced profile verification",
                    "Complete privacy controls",
                    "Secure data protection",
                    "Verified member badges",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-xs sm:text-sm">✓</span>
                      </div>
                      <span className="text-gray-700 text-xs sm:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-2 sm:py-3 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl mt-4 sm:mt-6 group-hover:scale-105">
                  Learn More →
                </button>
              </div>
            </div>

            {/* Personalized Match Recommendations */}
            <div className="group bg-white rounded-2xl border border-red-500/20 p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-xl sm:text-2xl text-white">💝</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base sm:text-lg md:text-xl">
                    Smart Matching
                  </div>
                  <div className="text-red-500 font-semibold text-xs sm:text-sm">
                    Personalized Recommendations
                  </div>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  Find your perfect{" "}
                  <span className="text-red-500">match faster</span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    "AI-powered match suggestions",
                    "Compatibility scoring",
                    "Interest-based matching",
                    "Daily curated profiles",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-xs sm:text-sm">✓</span>
                      </div>
                      <span className="text-gray-700 text-xs sm:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleViewAllProfiles}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-2 sm:py-3 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl mt-4 sm:mt-6 group-hover:scale-105"
                >
                  Get Matches →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {!isAuthenticated && (
  <div className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-2xl p-4 sm:p-8 shadow-2xl relative overflow-hidden w-[90%] sm:w-10/12 md:w-8/12 lg:w-7/12 mx-auto my-5">
    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 opacity-75 animate-pulse"></div>
    <div className="relative z-10 text-center">
      <h3 className="text-white font-bold text-base sm:text-2xl md:text-3xl mb-1.5 animate-bounce">
        🎉 Register Now! 🎉
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mb-3">
        <span className="text-white/90 text-[11px] sm:text-sm">Silver ₹299</span>
        <span className="text-white font-bold text-[11px] sm:text-sm">|</span>
        <span className="text-white/90 text-[11px] sm:text-sm">Gold ₹499</span>
        <span className="text-white font-bold text-[11px] sm:text-sm">|</span>
        <span className="text-white/90 text-[11px] sm:text-sm">Diamond ₹749</span>
      </div>
      <button
        onClick={handleRegisterFromCard}
        className="bg-red-600 hover:bg-red-700 text-white px-5 sm:px-8 py-2 sm:py-3 rounded-xl font-bold text-xs sm:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        Register Now
      </button>
    </div>
  </div>
)}
      <FAQSection />

      {/* Success Stories Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-gray-200 to-yellow-400/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Hear From Happy Couples
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4 text-justify">
              Real stories from couples who found love through our platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4 sm:px-0">
            {[
              {
                couple: "Rajesh & Priya",
                married: "Married for 1 year",
                story:
                  "The verification process made us feel secure. We connected instantly and knew we were right for each other within the first meeting!",
                image: "💑",
                background: "IT Professional & Teacher",
              },
              {
                couple: "Suresh & Lakshmi",
                married: "Recently Married",
                story:
                  "Elite service exceeded our expectations. The relationship manager understood our preferences perfectly and introduced us to exactly what we were looking for.",
                image: "👩‍❤️‍👨",
                background: "Doctor & Architect",
              },
            ].map((story, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200"
              >
                {/* Quote Icon */}
                <div className="text-3xl sm:text-4xl text-red-500 mb-3 sm:mb-4">❝</div>

                {/* Story */}
                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 italic text-justify">
                  {story.story}
                </p>

                {/* Couple Info */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg">
                    {story.image}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-base sm:text-lg md:text-xl">
                      {story.couple}
                    </div>
                    <div className="text-red-500 text-xs sm:text-sm font-medium">
                      {story.married}
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm">
                      {story.background}
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="flex justify-end mt-3 sm:mt-4">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400 text-base sm:text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            {[
              { number: "10,000+", label: "Success Stories" },
              { number: "95%", label: "Satisfaction Rate" },
              { number: "50+", label: "Cities" },
              { number: "4.9/5", label: "Rating" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white"
              >
                <div className="text-2xl font-bold text-red-500 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div> */}
        </div>
      </div>


      {/* Community Stats Section */}
      {/* <div className="bg-gray-100 text-red-500 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Growing Community</h2>
            <p className="text-gray-900">
              Join millions who found their life partners
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "4Cr+", label: "Profiles" },
              { number: "10L+", label: "Success Stories" },
              { number: "200+", label: "Communities" },
              { number: "95%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-900">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Footer CTA */}
      <div className="bg-gray-50 py-12 sm:py-16 border-t border-gray-200 z-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
            Ready to Start Your Journey?
          </h3>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 px-4">
            Join millions in finding their perfect life partner
          </p>
          {!isAuthenticated ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Launch Offer Banner */}
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 opacity-75 animate-pulse"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-white font-bold text-xl sm:text-2xl md:text-3xl mb-2 animate-bounce">
                    🎉 Register Now! 🎉
                  </h3>
                 {/* <p className="text-white font-semibold text-lg md:text-xl mb-4 drop-shadow-lg">
                    Free Registration for Launch Offer
                  </p>*/}
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <span className="text-white/90 text-xs sm:text-sm">Silver ₹299</span>
                    <span className="text-white font-bold text-xs sm:text-sm">|</span>
                    <span className="text-white/90 text-xs sm:text-sm">Gold ₹499</span>
                    <span className="text-white font-bold text-xs sm:text-sm">|</span>
                    <span className="text-white/90 text-xs sm:text-sm">Diamond ₹749</span>
                   {/*<span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                      ALL FREE NOW! ✨
                    </span>*/}
                  </div>
                </div>
              </div>
              <button
                onClick={handleRegisterFromCard}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 relative"
              >
                Register Now 
                {/*<span className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  FREE
                </span>*/}
              </button>
            </div>
          ) : (
            <button
              onClick={handleViewAllProfiles}
              className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-red-900 px-8 sm:px-12 py-3 sm:py-4 rounded-xl hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 transition-all duration-300 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105"
            >
              Browse Profiles
            </button>
          )}
        </div>
      </div>

      {/* Auth Modal for Registration */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Custom Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}