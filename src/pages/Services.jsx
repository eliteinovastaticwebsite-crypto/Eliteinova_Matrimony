import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Banner from "../components/common/Banner";
import AuthModal from "../components/auth/AuthModal";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import banner4 from "../assets/banner4.png";
import banner5 from "../assets/banner5.png";
import photography from "../assets/photography.jpg";
import catering from "../assets/catering.jpg";
import weddinghalls from "../assets/weddinghalls.jpg";
import decoration from "../assets/decoration.jpg";
import invitation from "../assets/invitation.jpg";
import makeup from "../assets/makeup.jpg";
import entertainment from "../assets/entertainment.jpg";

const ServiceBannerImages = [banner1, banner2, banner3, banner4, banner5];

export default function Services({ onOpenAuthModal }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("register");
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleOpenAuthModal = (mode = "register") => {
    if (onOpenAuthModal && typeof onOpenAuthModal === "function") {
      onOpenAuthModal(mode);
    } else {
      setAuthModalMode(mode);
      setShowAuthModal(true);
    }
  };

  const homeCategories = [
    { name: "Photography", path: "/photography", image: photography },
    { name: "Catering & Foods", path: "/catering", image: catering },
    { name: "Wedding Halls", path: "/wedding-halls", image: weddinghalls },
    { name: "Decorations", path: "/decorations", image: decoration },
    { name: "Entertainment", path: "/entertainment", image: entertainment },
    { name: "Invitation & Gifts", path: "/invitation", image: invitation },
    { name: "Bridal Styling", path: "/styling", image: makeup },
    {
      name: "Background Checks",
      path: "/background-investigations",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
  ];

  const keyServices = [
    {
      number: "01",
      title: "Advanced Profile Matching",
      desc: "Smart search filters based on age, community, education, profession, location, and preferences to find highly compatible matches.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: "from-amber-500 to-orange-500",
    },
    {
      number: "02",
      title: "Verified Profiles",
      desc: "We prioritize safety by verifying member details to ensure genuine and trustworthy connections.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "from-red-500 to-rose-500",
    },
    {
      number: "03",
      title: "Premium Membership Plans",
      desc: "Special benefits for Silver, Gold, and Diamond members including priority visibility, direct contact access, advanced filtering, and dedicated support.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: "from-amber-500 to-yellow-500",
    },
    {
      number: "04",
      title: "Personalized Match Suggestions",
      desc: "AI-based and manual matchmaking support to provide carefully selected matches suited to your expectations.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: "from-pink-500 to-rose-500",
    },
    {
      number: "05",
      title: "Family-Oriented Approach",
      desc: "We believe marriage connects two families. Our platform encourages respectful and meaningful interactions.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      color: "from-emerald-500 to-green-500",
    },
    {
      number: "06",
      title: "Dedicated Customer Support",
      desc: "Our team is always ready to assist members throughout their matchmaking journey.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "from-blue-500 to-indigo-500",
    },
  ];

  const whyChooseUs = [
    {
      title: "Verified Profiles",
      desc: "All profiles are thoroughly verified for authenticity and reliability",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Privacy Protected",
      desc: "Your personal data is secure with advanced encryption technology",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: "from-red-500 to-rose-500",
    },
    {
      title: "Expert Matchmaking",
      desc: "Professional assistance using advanced algorithms for perfect matches",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "from-amber-500 to-yellow-500",
    },
    {
      title: "24/7 Support",
      desc: "Round-the-clock customer support for all your queries and concerns",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50">

      {/* Modern Banner with Gradient Overlay */}
      <div className="relative h-[250px] sm:h-[350px] md:h-[480px] lg:h-[600px] xl:h-[720px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-10" />
        <div className="h-full [&>section]:!h-full [&>section]:!min-h-0">
          <Banner
            images={ServiceBannerImages}
            autoPlayInterval={3000}
            onOpenAuthModal={() => handleOpenAuthModal("register")}
            hideOverlay={true}
            showText={false}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #b91c1c 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto">

          {/* Welcome Section - Modern Card Design */}
          <div className="mb-20">
            {/* Animated gradient line */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-full blur-md opacity-50 animate-pulse" />
                <div className="relative px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-red-200 shadow-lg">
                  <p className="text-xs font-semibold tracking-[0.3em] uppercase bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                    ✦ With Love & Trust ✦
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">
              <span className="bg-gradient-to-r from-red-800 via-red-600 to-amber-700 bg-clip-text text-transparent">
                Welcome to Eliteinova
              </span>
              <br />
              <span className="text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                Matrimony
              </span>
            </h2>

            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            </div>

            {/* Modern Glass Card */}
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-amber-500/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-t-3xl" />
                
                <div className="text-center space-y-4">
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    Eliteinova Matrimony is a{" "}
                    <span className="font-semibold bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                      trusted and secure matchmaking platform
                    </span>{" "}
                    designed to help individuals and families find their perfect life partner. We combine
                    traditional values with modern technology to create meaningful and successful marriages.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <span className="px-4 py-2 bg-gradient-to-r from-red-50 to-amber-50 rounded-full text-sm font-medium text-red-700 border border-red-200">
                      ✓ Verified Profiles
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-red-50 to-amber-50 rounded-full text-sm font-medium text-red-700 border border-red-200">
                      ✓ Privacy Protection
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-red-50 to-amber-50 rounded-full text-sm font-medium text-red-700 border border-red-200">
                      ✓ Personalized Matchmaking
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portal Access Section */}
          <section id="portal-access" className="mb-24 scroll-mt-20">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold tracking-[0.3em] uppercase text-amber-600 mb-3">
                ✦ Access Your Account ✦
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-800 via-red-600 to-amber-700 bg-clip-text text-transparent mb-4">
                Portal Login & Registration
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-red-500" />
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-red-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              
              {/* Vendor Portal */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-amber-100">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                    Vendor Portal
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">Partner services & business access</p>
                  
                  <div className="flex gap-3">
                    <Link to="/vendor-login" 
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-center">
                      Login
                    </Link>
                    <Link to="/vendor-login" 
                      className="flex-1 px-4 py-2.5 bg-amber-50 text-amber-700 text-sm font-semibold rounded-xl border border-amber-200 hover:bg-amber-100 hover:scale-105 transition-all duration-300 text-center">
                      Register
                    </Link>
                  </div>
                </div>
              </div>

              {/* Customer Portal */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-100">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-t-2xl" />
                  
                  <div className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-lg">
                    Popular
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                    Customer Portal
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">Access your profile & matches</p>
                  
                  <div className="flex gap-3">
                    <Link to="/customer-login" 
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-center">
                      Login
                    </Link>
                    <Link to="/customer-registration" 
                      className="flex-1 px-4 py-2.5 bg-red-50 text-red-700 text-sm font-semibold rounded-xl border border-red-200 hover:bg-red-100 hover:scale-105 transition-all duration-300 text-center">
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section id="our-categories" className="mb-24 scroll-mt-20">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold tracking-[0.3em] uppercase text-amber-600 mb-3">
                ✦ Our Collections ✦
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-800 via-red-600 to-amber-700 bg-clip-text text-transparent mb-4">
                Our Categories
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-red-500" />
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-red-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {homeCategories.map((category, index) => (
                <Link
                  key={index}
                  to={category.path}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                  <div className="relative bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="aspect-square rounded-xl overflow-hidden mb-3">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                    </div>
                    <h3 className="text-center font-semibold text-gray-800 text-sm md:text-base group-hover:text-red-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Key Services Section */}
          <section id="key-services" className="mb-24 scroll-mt-20">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold tracking-[0.3em] uppercase text-amber-600 mb-3">
                ✦ What We Offer ✦
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-800 via-red-600 to-amber-700 bg-clip-text text-transparent mb-4">
                Our Key Services
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-red-500" />
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-red-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {keyServices.map((service, index) => (
                <div
                  key={index}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                            {service.title}
                          </h3>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${service.color} text-white`}>
                            {service.number}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section id="why-choose" className="scroll-mt-20">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold tracking-[0.3em] uppercase text-amber-600 mb-3">
                ✦ Why Choose Us ✦
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-800 via-red-600 to-amber-700 bg-clip-text text-transparent mb-4">
                Why Choose Eliteinova?
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-red-500" />
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-red-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                  <div className="relative bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      {/* Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}