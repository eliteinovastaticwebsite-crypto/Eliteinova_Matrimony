// src/pages/Home.jsx - FIXED VERSION
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
              <div className="text-center md:text-left">
                <h3 className="text-white font-bold text-2xl md:text-3xl mb-2 animate-bounce">
                  🎉 Launch Special Offer! 🎉
                </h3>
                <p className="text-white font-semibold text-lg md:text-xl drop-shadow-lg">
                  Free Registration for Launch Offer - All Membership Plans FREE!
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="text-white/90 line-through text-sm md:text-base">Silver ₹299</span>
                  <span className="text-white font-bold">|</span>
                  <span className="text-white/90 line-through text-sm md:text-base">Gold ₹499</span>
                  <span className="text-white font-bold">|</span>
                  <span className="text-white/90 line-through text-sm md:text-base">Diamond ₹749</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm md:text-base ml-2">
                    NOW FREE! ✨
                  </span>
                </div>
              </div>
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

      {/* Premium Header Banner */}
      {/* <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-2 px-4 text-center text-sm">
        <div className="container mx-auto flex items-center justify-center space-x-4">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>
              Live Matches: {formatNumber(Math.floor(Math.random() * 500) + 100)} today
            </span>
          </span>
          <span>•</span>
          <span>Trusted by {formatNumber(stats.marriages)}+ families</span>
        </div>
      </div> */}

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
                  <span className="text-red-600 text-sm font-medium">
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

                <p className="text-xl text-gray-600 leading-relaxed">
                  Join{" "}
                  {/* <span className="font-semibold text-red-500">
                    {formatNumber(stats.profiles)}+
                  </span>{" "} */}
                  verified members in their journey to find lifelong partners.
                  Where tradition meets modern matchmaking.
                </p>

                {/* Live Stats Counter */}
                {/* <div className="grid grid-cols-3 gap-6 py-6">
                  {[
                    {
                      number: formatNumber(stats.profiles),
                      label: "Verified Profiles",
                      icon: "👥",
                    },
                    { number: "25+", label: "Years Trust", icon: "🏆" },
                    {
                      number: formatNumber(stats.marriages),
                      label: "Successful Marriages",
                      icon: "💖",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200"
                    >
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-xl font-bold text-red-500">
                        {stat.number}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div> */}
              </div>

              {/* Launch Offer Badge */}
              {!isAuthenticated && (
                <div className="mb-4 inline-block bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-xl p-3 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 opacity-75 animate-pulse"></div>
                  <div className="relative z-10 flex items-center space-x-2">
                    <span className="text-white font-bold text-sm md:text-base animate-bounce">🎉</span>
                    <span className="text-white font-semibold text-sm md:text-base">
                      Launch Offer: <span className="font-bold">FREE Registration!</span>
                    </span>
                  </div>
                </div>
              )}

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
                        <span>Register Now - FREE!</span>
                        <span className="text-xl transform group-hover:scale-110 transition-transform">
                          🎯
                        </span>
                        <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-bl-lg">
                          FREE
                        </div>
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

              {/* Top Communities Quick View */}
              {/* <div className="pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Popular Communities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getTopCommunities().map(({ community, count }) => (
                    <div
                      key={community}
                      className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleCategorySelect(community)}
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {community}
                      </span>
                      <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                        {formatNumber(count)}
                      </span>
                    </div>
                  ))}
                </div>
              </div> */}
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

              {/* Featured Profiles Preview */}
              {/* {featuredProfiles.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                    <span className="text-yellow-500 mr-2">⭐</span>
                    Featured Profiles
                  </h3>
                  <div className="space-y-3">
                    {featuredProfiles.slice(0, 3).map((profile) => (
                      <div
                        key={profile.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => handleProfileClick(profile.id)}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {profile.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-sm">
                            {profile.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {profile.age} • {profile.education}
                          </div>
                        </div>
                        {profile.isPremium && (
                          <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                            Premium
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleViewAllProfiles}
                    className="w-full mt-4 text-red-500 hover:text-red-600 text-sm font-semibold"
                  >
                    View All Featured Profiles →
                  </button>
                </div>
              )} */}

              {/* Quick Stats Cards */}
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-red-500">500+</div>
                  <div className="text-gray-600 text-xs">Matches Today</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-red-500">
                    {stats.cities}+
                  </div>
                  <div className="text-gray-600 text-xs">Cities Worldwide</div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <MobilAppSection />

      {/* Professional How It Works Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-2 h-8 bg-red-600 mr-3"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                How It Works
              </h2>
              <div className="w-2 h-8 bg-red-600 ml-3"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              A streamlined process designed to help you find meaningful connections with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                desc: "Build your comprehensive profile with essential details and preferences",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="p-8">
                    {/* Step Number */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-2xl font-bold text-gray-400 group-hover:text-red-600 transition-colors duration-300">
                        {item.step}
                      </div>
                      {/* Icon */}
                      <div className="w-12 h-12 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center text-red-600 transition-colors duration-300">
                        {item.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm font-light">
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
          <div className="lg:hidden mt-12">
            <div className="flex justify-center">
              <div className="flex space-x-8">
                {[0, 1, 2, 3].map((dot) => (
                  <div key={dot} className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mb-2"></div>
                    {dot < 3 && <div className="w-8 h-0.5 bg-gray-300 mt-1"></div>}
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
      <div className="py-16 bg-gradient-to-b from-white to-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-red-500">Services Include</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive services designed to make your matchmaking journey
              seamless and successful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Premium Membership Plans */}
            <div className="group bg-white rounded-2xl border border-red-500/20 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl text-white">👑</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xl">
                    Membership Plans
                  </div>
                  <div className="text-red-500 font-semibold">
                    Premium Membership Options
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-lg font-bold text-gray-900">
                  Choose the plan that{" "}
                  <span className="text-red-500">fits you best</span>
                </div>
                <div className="space-y-3">
                  {[
                    "Complete profile creation",
                    "Premium advanced features",
                    "Unlimited matches",
                    "Priority customer support",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleCreateProfile}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl mt-6 group-hover:scale-105"
                >
                  View Plans →
                </button>
              </div>
            </div>

            {/* Profile Verification & Privacy Controls */}
            <div className="group bg-white rounded-2xl border border-red-500/20 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl text-white">🔒</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xl">
                    Verification & Privacy
                  </div>
                  <div className="text-red-500 font-semibold">
                    Secure & Trusted
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-lg font-bold text-gray-900">
                  Your safety is our{" "}
                  <span className="text-red-500">top priority</span>
                </div>
                <div className="space-y-3">
                  {[
                    "Advanced profile verification",
                    "Complete privacy controls",
                    "Secure data protection",
                    "Verified member badges",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl mt-6 group-hover:scale-105">
                  Learn More →
                </button>
              </div>
            </div>

            {/* Personalized Match Recommendations */}
            <div className="group bg-white rounded-2xl border border-red-500/20 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl text-white">💝</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xl">
                    Smart Matching
                  </div>
                  <div className="text-red-500 font-semibold">
                    Personalized Recommendations
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-lg font-bold text-gray-900">
                  Find your perfect{" "}
                  <span className="text-red-500">match faster</span>
                </div>
                <div className="space-y-3">
                  {[
                    "AI-powered match suggestions",
                    "Compatibility scoring",
                    "Interest-based matching",
                    "Daily curated profiles",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleViewAllProfiles}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl mt-6 group-hover:scale-105"
                >
                  Get Matches →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="py-16 bg-gradient-to-br from-gray-200 to-yellow-400/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hear From Happy Couples
            </h2>
            <p className="text-gray-600 text-xl">
              Real stories from couples who found love through our platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200"
              >
                {/* Quote Icon */}
                <div className="text-4xl text-red-500 mb-4">❝</div>

                {/* Story */}
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  {story.story}
                </p>

                {/* Couple Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                    {story.image}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-xl">
                      {story.couple}
                    </div>
                    <div className="text-red-500 text-sm font-medium">
                      {story.married}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {story.background}
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="flex justify-end mt-4">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400 text-lg">
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

      <FAQSection />

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
      <div className="bg-gray-50 py-16 border-t border-gray-200 z-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Ready to Start Your Journey?
          </h3>
          <p className="text-gray-600 text-xl mb-8">
            Join millions in finding their perfect life partner
          </p>
          {!isAuthenticated ? (
            <div className="space-y-6">
              {/* Launch Offer Banner */}
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-2xl p-6 shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 opacity-75 animate-pulse"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-white font-bold text-2xl md:text-3xl mb-2 animate-bounce">
                    🎉 Launch Special Offer! 🎉
                  </h3>
                  <p className="text-white font-semibold text-lg md:text-xl mb-4 drop-shadow-lg">
                    Free Registration for Launch Offer
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                    <span className="text-white/90 line-through">Silver ₹299</span>
                    <span className="text-white font-bold">|</span>
                    <span className="text-white/90 line-through">Gold ₹499</span>
                    <span className="text-white font-bold">|</span>
                    <span className="text-white/90 line-through">Diamond ₹749</span>
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                      ALL FREE NOW! ✨
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleRegisterFromCard}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white px-12 py-4 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 relative"
              >
                Register Now - Claim Your FREE Membership
                <span className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  FREE
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleViewAllProfiles}
              className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-red-900 px-12 py-4 rounded-xl hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105"
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