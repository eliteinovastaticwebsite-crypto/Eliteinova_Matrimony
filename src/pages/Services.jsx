import React, { useEffect, useState, useRef } from "react";
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
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [flippedCard, setFlippedCard] = useState(null);
  const location = useLocation();

  // Auto-scroll refs
  const scrollRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);

  const scrollRef2 = useRef(null);
  const animRef2 = useRef(null);
  const posRef2 = useRef(0);

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

  // Auto-scroll effect for first nav bar
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const step = () => {
      if (!hovered) {
        posRef.current += 0.6;
        if (posRef.current >= el.scrollWidth / 2) {
          posRef.current = 0;
        }
        el.scrollLeft = posRef.current;
      }
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [hovered]);

  // Auto-scroll effect for second nav bar
  useEffect(() => {
    const el = scrollRef2.current;
    if (!el) return;

    const step = () => {
      if (!hovered2) {
        posRef2.current += 0.5;
        if (posRef2.current >= el.scrollWidth / 2) {
          posRef2.current = 0;
        }
        el.scrollLeft = posRef2.current;
      }
      animRef2.current = requestAnimationFrame(step);
    };

    animRef2.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef2.current);
  }, [hovered2]);

  const handleOpenAuthModal = (mode = "register") => {
    if (onOpenAuthModal && typeof onOpenAuthModal === "function") {
      onOpenAuthModal(mode);
    } else {
      setAuthModalMode(mode);
      setShowAuthModal(true);
    }
  };

  const homeCategories = [
    { 
      name: "Photography", 
      path: "/photography", 
      image: photography,
      subcategories: [
        "Wedding Photography",
        "Pre-wedding Shoots",
        "Candid Photography",
        "Traditional Photography",
        "Cinematography",
        "Drone Photography",
        "Album Design",
        "Photo Editing"
      ]
    },
    { 
      name: "Catering & Foods", 
      path: "/catering", 
      image: catering,
      subcategories: [
        "Vegetarian Catering",
        "Non-Vegetarian Catering",
        "Multi-cuisine",
        "Live Counters",
        "Wedding Cakes",
        "Beverage Services",
        "Traditional Sweets",
        "Snacks & Appetizers"
      ]
    },
    { 
      name: "Wedding Halls", 
      path: "/wedding-halls", 
      image: weddinghalls,
      subcategories: [
        "Banquet Halls",
        "Convention Centers",
        "Resort Venues",
        "Palace Weddings",
        "Garden Weddings",
        "Beach Weddings",
        "Temple Weddings",
        "Farmhouse Venues"
      ]
    },
    { 
      name: "Decorations", 
      path: "/decorations", 
      image: decoration,
      subcategories: [
        "Mandap Decoration",
        "Flower Decoration",
        "Lighting Design",
        "Stage Setup",
        "Entrance Decoration",
        "Table Settings",
        "Theme Decoration",
        "Prop Rentals"
      ]
    },
    { 
      name: "Entertainment", 
      path: "/entertainment", 
      image: entertainment,
      subcategories: [
        "DJ Services",
        "Live Bands",
        "Dance Performances",
        "Wedding Choreography",
        "Fireworks Display",
        "Emcee Services",
        "Traditional Musicians",
        "Magicians & Performers"
      ]
    },
    { 
      name: "Invitation & Gifts", 
      path: "/invitation", 
      image: invitation,
      subcategories: [
        "Traditional Cards",
        "Digital Invitations",
        "Video Invitations",
        "Wedding Website",
        "Return Gifts",
        "Wedding Favors",
        "Gift Hampers",
        "Personalized Gifts"
      ]
    },
    { 
      name: "Bridal Styling", 
      path: "/styling", 
      image: makeup,
      subcategories: [
        "Bridal Makeup",
        "Hairstyling",
        "Mehendi Art",
        "Saree Draping",
        "Jewelry Styling",
        "Groom Styling",
        "Family Makeup",
        "Trial Sessions"
      ]
    },
    {
      name: "Background Verification",
      path: "/background-investigations",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      subcategories: [
        "Identity Verification",
        "Employment Verification",
        "Education Verification",
        "Family Background",
        "Social Verification",
        "Address Verification",
        "Criminal Check",
        "Financial Verification"
      ]
    },
  ];

  const verificationServices = [
    {
      title: "Identity Verification",
      desc: "Authenticate personal details including name, age, marital status, and government ID verification.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Employment Verification",
      desc: "Confirm professional details including company, designation, salary range, and employment history.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-red-500 to-rose-500",
    },
    {
      title: "Education Verification",
      desc: "Verify academic qualifications, degrees, and educational institutions mentioned in the profile.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
      color: "from-amber-500 to-yellow-500",
    },
    {
      title: "Family Background",
      desc: "Basic verification of family background, reputation, and social standing where required.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Social & Lifestyle",
      desc: "General insights into lifestyle, habits, and social reputation to ensure complete transparency.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-emerald-500 to-green-500",
    },
    {
      title: "Address Verification",
      desc: "Confirmation of residential address and location details for added security and peace of mind.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "from-blue-500 to-indigo-500",
    },
  ];

  const verificationProcess = [
    {
      step: "01",
      title: "Request Consultation",
      desc: "Families share the details requiring verification through our secure platform."
    },
    {
      step: "02",
      title: "Professional Review",
      desc: "Our team evaluates the information and plans the appropriate verification process."
    },
    {
      step: "03",
      title: "Discreet Investigation",
      desc: "Verification is conducted carefully and confidentially with utmost professionalism."
    },
    {
      step: "04",
      title: "Detailed Report",
      desc: "A comprehensive confidential report is shared with verified findings and insights."
    }
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

      {/* Communities Auto-Scroll Bar - Matching Home page style */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-2.5">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex-shrink-0">
              <button className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 text-[10px] sm:text-sm font-semibold whitespace-nowrap">
                <span>🔀</span>
                <span className="hidden xs:inline sm:inline">Service Categories</span>
                <span className="sm:hidden">Services</span>
              </button>
            </div>

            <div className="flex-shrink-0 w-3 sm:w-6 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />

            <div
              ref={scrollRef2}
              className="flex items-center gap-1 sm:gap-2 overflow-hidden select-none flex-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onMouseEnter={() => setHovered2(true)}
              onMouseLeave={() => setHovered2(false)}
              onTouchStart={() => setHovered2(true)}
              onTouchEnd={() => setTimeout(() => setHovered2(false), 1000)}
            >
              {[...Array(2)].flatMap(() => [
                "Wedding Photography",
                "Catering",
                "Wedding Halls",
                "Decorations",
                "Bridal Styling",
                "Entertainment",
                "Invitation Cards",
                "Background Verification",
              ]).map((label, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const element = document.getElementById(label.toLowerCase().replace(/\s+/g, '-'));
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="inline-flex items-center px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 text-[10px] sm:text-sm font-medium whitespace-nowrap hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 cursor-pointer flex-shrink-0"
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-shrink-0 w-3 sm:w-6 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

            <div className="flex-shrink-0">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 text-[10px] sm:text-sm font-semibold whitespace-nowrap hover:bg-red-100 transition-all"
              >
                8 Services
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Bar - Matching Home page style */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm overflow-hidden">
        <div className="container mx-auto px-4 py-3">
          <div
            ref={scrollRef}
            className="flex items-center space-x-2 overflow-hidden select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onTouchStart={() => setHovered(true)}
            onTouchEnd={() => setTimeout(() => setHovered(false), 1000)}
          >
            {[...Array(2)].flatMap(() => [
              { label: "Celebrate Your Wedding", id: "celebrate-wedding" },
              { label: "Service Categories", id: "our-categories" },
              { label: "Background Verification", id: "background-verification" },
              { label: "Portal Access", id: "portal-access" },
              { label: "Why Choose Us", id: "why-choose" },
            ]).map((link, i) => (
              <button
                key={i}
                onClick={() => {
                  const element = document.getElementById(link.id);
                  if (element) {
                    const offsetPosition =
                      element.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-red-50/50 text-red-600 text-xs sm:text-sm font-medium hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #b91c1c 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto">

          {/* Background Investigation Quick Navigation Button - Updated to match theme */}
          <div className="flex justify-end mb-4 sm:mb-6">
            <button
              onClick={() => {
                const element = document.getElementById('background-verification');
                if (element) {
                  const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 100;
                  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
              }}
              className="group relative inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-2.5 sm:py-3.5 bg-gradient-to-r from-red-700 to-amber-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden border border-red-300"
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                {/* Shield with check icon */}
                <div className="relative">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></span>
                </div>
                
                <span className="font-bold text-sm sm:text-base whitespace-nowrap">
                  Background Investigations
                </span>
                
                {/* Magnifying glass icon */}
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                {/* Arrow */}
                <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </button>
          </div>

          {/* Section Heading - Matching Home page style */}
          <div className="text-center mb-6 md:mb-8">
            <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-amber-600 mb-2 md:mb-3">
              ✦ Complete Wedding Solutions ✦
            </p>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4"
              style={{
                background: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 40%, #92400e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Georgia', 'Times New Roman', serif",
                letterSpacing: "-0.01em",
              }}
            >
              EliteInova Wedding Services
            </h2>
            <p className="text-base md:text-lg text-amber-700 font-medium mb-3">
              Complete Wedding Solutions for Your Special Day
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 md:w-20" style={{ background: "linear-gradient(to right, transparent, #b91c1c)" }} />
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-amber-500" />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-700">
                  <path d="M12 2C9 6 4 8 4 12s3.5 6 8 9c4.5-3 8-5 8-9s-5-6-8-10z" fill="currentColor" opacity="0.7" />
                </svg>
                <div className="w-1 h-1 rounded-full bg-amber-500" />
              </div>
              <div className="h-px w-12 md:w-20" style={{ background: "linear-gradient(to left, transparent, #b91c1c)" }} />
            </div>
          </div>

          {/* EliteInova Wedding Services Card - Matching Home page style */}
          <div className="relative max-w-4xl mx-auto mb-10 md:mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-amber-500/10 rounded-3xl blur-2xl" />
            <div
              className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/50"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #fffdf9 100%)",
                boxShadow: "0 4px 24px rgba(185,28,28,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                border: "1px solid rgba(185,28,28,0.1)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-t-3xl" />
              
              <div className="text-center space-y-3 md:space-y-4">
                <p className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
                  At <span className="font-semibold" style={{ color: "#9b1c1c" }}>EliteInova</span>, we go beyond matchmaking. We help you create a beautiful and memorable wedding experience with our complete range of professional wedding services.
                </p>
                
                <p className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
                  From photography to catering, bridal styling to mandap decoration, we connect you with trusted professionals who make every moment of your celebration unforgettable.
                </p>
                
                <p className="text-gray-700 text-sm md:text-base lg:text-lg font-medium">
                  Our goal is simple — to make your wedding planning smooth, elegant, and stress-free.
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 pt-2 md:pt-3">
                  <span className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-red-50 to-amber-50 rounded-full text-xs md:text-sm font-medium text-red-700 border border-red-200">
                    ✓ Trusted Vendors
                  </span>
                  <span className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-red-50 to-amber-50 rounded-full text-xs md:text-sm font-medium text-red-700 border border-red-200">
                    ✓ Quality Assured
                  </span>
                  <span className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-red-50 to-amber-50 rounded-full text-xs md:text-sm font-medium text-red-700 border border-red-200">
                    ✓ Stress-Free Planning
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* New Celebrate Your Wedding Section */}
<section id="celebrate-wedding" className="mb-24 scroll-mt-20">
  <div className="text-center mb-12">
    <p className="text-sm font-semibold tracking-[0.3em] uppercase text-amber-600 mb-3">
      ✦ Your Special Day ✦
    </p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-800 via-red-600 to-amber-700 bg-clip-text text-transparent mb-4">
      Celebrate Your Wedding with EliteInova
    </h2>
    <div className="flex items-center justify-center gap-3">
      <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-red-500" />
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-red-500" />
    </div>
  </div>

  <div className="relative max-w-5xl mx-auto">
    {/* Decorative background elements */}
    <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 via-red-100/50 to-amber-100/50 rounded-3xl blur-3xl -z-10"></div>
    
    {/* Main Content Card */}
    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-amber-200 overflow-hidden">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500"></div>
      
      {/* Decorative rings */}
      <div className="absolute top-10 right-10 w-40 h-40 border-8 border-amber-100 rounded-full opacity-30"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 border-8 border-red-100 rounded-full opacity-30"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center justify-center">
        
        {/* Right side - Text content */}
        <div className="w-full lg:w-4/5 mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-red-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
            <span className="animate-pulse">✨</span>
            Make It Unforgettable
            <span className="animate-pulse">✨</span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            Your wedding is one of the most important celebrations of your life.
          </h3>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            With <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">EliteInova Wedding Services</span>, you receive professional support, creative ideas, and trusted vendors to make your wedding truly unforgettable.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => {
                const element = document.getElementById('our-categories');
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Explore Our Services</span>
              <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom decorative text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400 italic">
          Start planning your perfect wedding today
        </p>
      </div>
    </div>
  </div>
</section>

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

          {/* Categories Section with Flip Cards - Updated with better spacing and back theme */}
          <section id="our-categories" className="mb-24 scroll-mt-20">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold tracking-[0.3em] uppercase text-amber-600 mb-3">
                ✦ Our Collections ✦
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-800 via-red-600 to-amber-700 bg-clip-text text-transparent mb-4">
                Service Categories
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-red-500" />
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-red-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {homeCategories.map((category, index) => (
                <div
                  key={index}
                  className="group relative h-72 cursor-pointer perspective-1000"
                  onMouseEnter={() => setFlippedCard(index)}
                  onMouseLeave={() => setFlippedCard(null)}
                  onClick={() => {
                    if (flippedCard !== index) {
                      setFlippedCard(index);
                    } else {
                      setFlippedCard(null);
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                  
                  {/* Flip Card Container */}
                  <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flippedCard === index ? 'rotate-y-180' : ''}`}>
                    
                    {/* Front of card */}
                    <div className="absolute w-full h-full backface-hidden">
                      <div className="relative bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                        <div className="aspect-square rounded-xl overflow-hidden mb-3 flex-shrink-0">
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
                        <h3 className="text-center font-semibold text-gray-800 text-sm md:text-base group-hover:text-red-600 transition-colors line-clamp-2">
                          {category.name}
                        </h3>
                        <p className="text-center text-xs text-gray-500 mt-auto pt-2">Click to view services</p>
                      </div>
                    </div>
                    
                    {/* Back of card with subcategories - Improved theme */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180">
                      <div className="relative bg-gradient-to-br from-red-50 to-amber-50 rounded-2xl p-5 shadow-lg h-full border-2 border-red-200 flex flex-col">
                        {/* Decorative top bar */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-400 to-red-500 rounded-t-2xl"></div>
                        
                        {/* Header with icon */}
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-200">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                          </div>
                          <h4 className="font-bold text-red-800 text-sm md:text-base line-clamp-1">
                            {category.name}
                          </h4>
                        </div>
                        
                        {/* Subcategories list with better spacing */}
                        <ul className="space-y-1.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                          {category.subcategories.map((sub, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs">
                              <span className="text-amber-600 flex-shrink-0 mt-0.5">✦</span>
                              <span className="text-gray-700 leading-tight">{sub}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {/* Footer with flip hint */}
                        <div className="mt-3 pt-2 border-t border-red-200 text-center">
                          <p className="text-xs text-red-500 font-medium flex items-center justify-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Click to flip back
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Background Verification Services Section */}
          <section id="background-verification" className="mb-24 scroll-mt-20">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold tracking-[0.3em] uppercase text-amber-600 mb-3">
                ✦ Trust & Transparency ✦
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-800 via-red-600 to-amber-700 bg-clip-text text-transparent mb-4">
                Background Verification Services
              </h2>
              <p className="text-lg md:text-xl text-amber-700 font-medium">
                Trusted Verification for Confident Marriages
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-red-500" />
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-red-500" />
              </div>
            </div>

            {/* Main Description Card */}
            <div className="relative max-w-4xl mx-auto mb-16">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-amber-500/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-t-3xl" />
                
                <div className="space-y-6">
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    At <span className="font-semibold" style={{ color: "#9b1c1c" }}>EliteInova</span>, we understand that marriage is one of the most important decisions in life. Trust and transparency are essential when choosing a life partner.
                  </p>
                  
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    Our Background Verification Services help families and individuals verify important details before proceeding with a matrimonial alliance. Through professional investigation and careful verification, we help ensure that the information provided is accurate and reliable.
                  </p>
                  
                  <p className="text-gray-700 text-base md:text-lg font-medium">
                    Our goal is to give you peace of mind and confidence while making such an important life decision.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Verification is Important */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                Why Background Verification is Important
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                  <p className="text-gray-600 mb-4">
                    In today's digital world, profiles and information can sometimes be incomplete or misleading. Background verification helps confirm key details such as identity, career, and personal background.
                  </p>
                  <p className="text-gray-600">
                    This process helps families:
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      "Verify authenticity of matrimonial profiles",
                      "Avoid misinformation or hidden details",
                      "Build trust between families",
                      "Make informed marriage decisions"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✓</span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-gray-500 italic">
                    EliteInova provides confidential and professional verification support to protect the interests of both individuals and families.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-2xl p-6 border border-red-200">
                  <h4 className="font-bold text-gray-800 mb-3">Key Benefits</h4>
                  <div className="space-y-3">
                    {[
                      "Build trust before marriage commitment",
                      "Ensure transparency in matrimonial alliances",
                      "Protect family interests and reputation",
                      "Make confident, informed decisions"
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Services Grid */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                Our Background Verification Services
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {verificationServices.map((service, index) => (
                  <div key={index} className="group relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${service.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                    <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {service.icon}
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Process */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                Our Verification Process
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {verificationProcess.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 h-full">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg mb-4">
                        {step.step}
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">{step.title}</h4>
                      <p className="text-gray-500 text-sm">{step.desc}</p>
                    </div>
                    {index < verificationProcess.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                        <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy & Confidentiality */}
            <div className="bg-gradient-to-r from-red-600 to-amber-600 rounded-3xl p-8 md:p-10 text-white mb-16">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl font-bold mb-4">Privacy & Confidentiality</h3>
                <p className="text-white/90 mb-4">
                  At EliteInova, privacy is taken very seriously. All verification processes are handled with strict confidentiality and professional ethics.
                </p>
                <p className="text-white/90">
                  Information collected during the process is shared only with the authorized client and is never disclosed publicly.
                </p>
              </div>
            </div>

            {/* Why Choose EliteInova for Verification */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-100">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Why Choose EliteInova for Verification?
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {[
                  "Professional and discreet process",
                  "Reliable verification methods",
                  "Strict confidentiality and privacy",
                  "Support for families and individuals",
                  "Trusted matrimonial support services"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-center text-gray-600 mt-6 pt-6 border-t border-red-100">
                Our services are designed to provide clarity and confidence before making a lifelong commitment.
              </p>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section id="why-choose" className="scroll-mt-20">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold tracking-[0.3em] uppercase text-amber-600 mb-3">
                ✦ Why Choose Us ✦
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-800 via-red-600 to-amber-700 bg-clip-text text-transparent mb-4">
                Why Choose EliteInova?
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

      {/* Animation Styles */}
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
}