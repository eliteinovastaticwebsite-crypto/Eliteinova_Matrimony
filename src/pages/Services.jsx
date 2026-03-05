import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      name: "Bride & Groom Background Investigations",
      path: "/background-investigations",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
  ];

  const keyServices = [
    {
      number: "1",
      title: "Advanced Profile Matching",
      desc: "Smart search filters based on age, community, education, profession, location, and preferences to find highly compatible matches.",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      number: "2",
      title: "Verified Profiles",
      desc: "We prioritize safety by verifying member details to ensure genuine and trustworthy connections.",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      number: "3",
      title: "Premium Membership Plans",
      desc: "Special benefits for Silver, Gold, and Diamond members including priority visibility, direct contact access, advanced filtering, and dedicated support.",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      number: "4",
      title: "Personalized Match Suggestions",
      desc: "AI-based and manual matchmaking support to provide carefully selected matches suited to your expectations.",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      number: "5",
      title: "Secure Communication",
      desc: "Safe and private chat options to connect comfortably with potential partners.",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      number: "6",
      title: "Family-Oriented Approach",
      desc: "We believe marriage connects two families. Our platform encourages respectful and meaningful interactions.",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      number: "7",
      title: "Dedicated Customer Support",
      desc: "Our team is always ready to assist members throughout their matchmaking journey.",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">

      {/* Banner */}
      <div style={{ height: "700px", overflow: "hidden" }}>
        <div style={{ height: "100%" }} className="[&>section]:!h-full [&>section]:!min-h-0">
          <Banner
            images={ServiceBannerImages}
            autoPlayInterval={3000}
            onOpenAuthModal={() => handleOpenAuthModal("register")}
            hideOverlay={true}
            showText={false}
          />
        </div>
      </div>

      {/* Welcome + Intro Content */}
      <main className="relative px-4 md:px-6 py-12 md:py-16 mt-0 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #fff7f7 0%, #fffbf0 50%, #fff7f7 100%)",
        }}
      >
        {/* Decorative background petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #b91c1c, transparent)" }} />
          <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #d97706, transparent)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(circle, #b91c1c, transparent)" }} />
        </div>

        <div className="relative max-w-5xl mx-auto">

          {/* Section Heading */}
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-amber-600 mb-3">
              ✦ With Love & Trust ✦
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 40%, #92400e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Georgia', 'Times New Roman', serif",
                letterSpacing: "-0.01em",
              }}
            >
              Welcome to Eliteinova Matrimony
            </h2>
            {/* Ornamental divider */}
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

          {/* Intro — elegant card with left accent border */}
          <div className="relative mb-6 md:mb-8 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #fffdf9 100%)",
              boxShadow: "0 4px 24px rgba(185,28,28,0.08), 0 1px 4px rgba(0,0,0,0.04)",
              border: "1px solid rgba(185,28,28,0.1)",
            }}
          >
            {/* Gold top accent line */}
            <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right, #b91c1c, #d97706, #b91c1c)" }} />
            <div className="p-6 md:p-10">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed mb-4"
                  style={{ fontFamily: "'Georgia', serif" }}>
                  Eliteinova Matrimony is a{" "}
                  <span className="font-semibold" style={{ color: "#9b1c1c" }}>trusted and secure matchmaking platform</span>{" "}
                  designed to help individuals and families find their perfect life partner. We combine
                  traditional values with modern technology to create meaningful and successful marriages.
                </p>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  Our platform focuses on{" "}
                  <span className="font-medium text-amber-700 border-b border-amber-300">verified profiles</span>,{" "}
                  <span className="font-medium text-amber-700 border-b border-amber-300">privacy protection</span>, and{" "}
                  <span className="font-medium text-amber-700 border-b border-amber-300">personalized matchmaking services</span>{" "}
                  to ensure safe and reliable connections.
                </p>
              </div>
            </div>
            {/* Gold bottom accent line */}
            <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right, #b91c1c, #d97706, #b91c1c)" }} />
          </div>

          {/* Key Services — elegant container */}
          <div className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #ffffff 0%, #fffbf5 100%)",
              boxShadow: "0 8px 40px rgba(185,28,28,0.1), 0 2px 8px rgba(0,0,0,0.04)",
              border: "1px solid rgba(185,28,28,0.1)",
            }}
          >
            <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right, #b91c1c, #d97706, #b91c1c)" }} />
            <div className="p-6 md:p-10">

              {/* Services heading */}
              <div className="text-center mb-8 md:mb-10">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600 mb-2">What We Offer</p>
                <h3 className="text-xl md:text-2xl font-bold"
                  style={{
                    color: "#7f1d1d",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                  }}
                >
                  🌸 Our Key Services
                </h3>
                <div className="mt-3 mx-auto w-16 h-0.5 rounded-full" style={{ background: "linear-gradient(to right, #b91c1c, #d97706)" }} />
              </div>

              {/* Services grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {keyServices.map((service, index) => (
                  <div
                    key={index}
                    className="group relative rounded-xl p-4 md:p-5 transition-all duration-300 cursor-default"
                    style={{
                      background: "linear-gradient(135deg, #fff7f7 0%, #fffbf0 100%)",
                      border: "1px solid rgba(185,28,28,0.12)",
                      boxShadow: "0 2px 8px rgba(185,28,28,0.06)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(185,28,28,0.15)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(185,28,28,0.06)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Number badge */}
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #b91c1c, #d97706)" }}>
                      {service.number}
                    </div>
                    <div className="flex items-start gap-3">
                      {/* Icon circle */}
                      <div className="flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center shadow-md"
                        style={{ background: "linear-gradient(135deg, #b91c1c 0%, #d97706 100%)" }}>
                        {service.icon}
                      </div>
                      <div className="pt-0.5">
                        <h4 className="font-bold text-sm md:text-base mb-1.5 leading-snug"
                          style={{ color: "#7f1d1d", fontFamily: "'Georgia', serif" }}>
                          {service.title}
                        </h4>
                        <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{service.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
            <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right, #b91c1c, #d97706, #b91c1c)" }} />
          </div>

        </div>
      </main>

      {/* Our Categories */}
      <section className="container mx-auto px-3 md:px-4 py-6 md:py-8 lg:py-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-red-800 mb-6 md:mb-8 lg:mb-12">
          Our Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 xl:gap-10 max-w-6xl mx-auto">
          {homeCategories.map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              <Link to={category.path} className="block group">
                <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 rounded-full border-3 md:border-4 lg:border-[5px] border-amber-800 overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg hover:shadow-xl transition-all duration-300 p-0.5 md:p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                      }}
                    />
                  </div>
                </div>
              </Link>
              <h3 className="mt-2 md:mt-3 lg:mt-4 text-center font-semibold text-gray-800 text-sm md:text-base lg:text-lg">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Eliteinova */}
      <section className="container mx-auto px-3 md:px-4 py-6 md:py-8 lg:py-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-red-800 mb-6 md:mb-8">
          Why Choose Eliteinova?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

          <div className="bg-white p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-md md:shadow-lg border border-red-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto">
              <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-base md:text-lg text-red-700 mb-1 md:mb-2 text-center">Verified Profiles</h3>
            <p className="text-gray-600 text-xs md:text-sm text-center">All profiles are thoroughly verified for authenticity and reliability</p>
          </div>

          <div className="bg-white p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-md md:shadow-lg border border-yellow-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto">
              <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-bold text-base md:text-lg text-red-700 mb-1 md:mb-2 text-center">Privacy Protected</h3>
            <p className="text-gray-600 text-xs md:text-sm text-center">Your personal data is secure with advanced encryption technology</p>
          </div>

          <div className="bg-white p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-md md:shadow-lg border border-red-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto">
              <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-base md:text-lg text-red-700 mb-1 md:mb-2 text-center">Expert Matchmaking</h3>
            <p className="text-gray-600 text-xs md:text-sm text-center">Professional assistance using advanced algorithms for perfect matches</p>
          </div>

          <div className="bg-white p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-md md:shadow-lg border border-yellow-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto">
              <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-base md:text-lg text-red-700 mb-1 md:mb-2 text-center">24/7 Support</h3>
            <p className="text-gray-600 text-xs md:text-sm text-center">Round-the-clock customer support for all your queries and concerns</p>
          </div>

        </div>
      </section>

      {/* Portal Cards */}
      <section className="relative px-4 md:px-6 py-12 md:py-16 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #fff7f7 0%, #fffbf0 60%, #fff7f7 100%)" }}
      >
        {/* Subtle background ornament */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #b91c1c, transparent)" }} />
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-10 md:mb-12">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-600 mb-3">
              ✦ Access Your Account ✦
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 40%, #92400e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Georgia', 'Times New Roman', serif",
              }}
            >
              Portal Login & Registration
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 md:w-20" style={{ background: "linear-gradient(to right, transparent, #b91c1c)" }} />
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-amber-500" />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-red-700">
                  <path d="M12 2C9 6 4 8 4 12s3.5 6 8 9c4.5-3 8-5 8-9s-5-6-8-10z" fill="currentColor" opacity="0.7" />
                </svg>
                <div className="w-1 h-1 rounded-full bg-amber-500" />
              </div>
              <div className="h-px w-12 md:w-20" style={{ background: "linear-gradient(to left, transparent, #b91c1c)" }} />
            </div>
          </div>

          {/* Portal cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

            {/* Vendor Portal */}
            <div className="relative rounded-2xl overflow-hidden group transition-all duration-300"
              style={{
                background: "linear-gradient(160deg, #fffbeb 0%, #fef3c7 100%)",
                boxShadow: "0 4px 20px rgba(217,119,6,0.12), 0 1px 4px rgba(0,0,0,0.04)",
                border: "1px solid rgba(217,119,6,0.2)",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 36px rgba(217,119,6,0.2), 0 2px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(217,119,6,0.12), 0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div className="h-1 w-full" style={{ background: "linear-gradient(to right, #d97706, #f59e0b, #d97706)" }} />
              <div className="p-6 md:p-7">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center shadow-md"
                  style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg md:text-xl mb-1"
                  style={{ color: "#78350f", fontFamily: "'Georgia', serif" }}>Vendor Portal</h3>
                <p className="text-amber-700 text-xs md:text-sm mb-5 opacity-80">Partner services & business access</p>
                <div className="flex gap-3">
                  <Link to="/vendor-login"
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200"
                    style={{ background: "linear-gradient(135deg, #d97706, #b45309)", color: "white", boxShadow: "0 2px 8px rgba(217,119,6,0.3)" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(217,119,6,0.5)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(217,119,6,0.3)"}
                  >Login</Link>
                  <Link to="/vendor-login"
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200"
                    style={{ background: "rgba(217,119,6,0.1)", color: "#92400e", border: "1px solid rgba(217,119,6,0.3)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(217,119,6,0.18)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(217,119,6,0.1)"}
                  >Register</Link>
                </div>
              </div>
            </div>

            {/* Customer Portal — featured / center */}
            <div className="relative rounded-2xl overflow-hidden group transition-all duration-300"
              style={{
                background: "linear-gradient(160deg, #fff5f5 0%, #fee2e2 100%)",
                boxShadow: "0 8px 32px rgba(185,28,28,0.16), 0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid rgba(185,28,28,0.2)",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 16px 48px rgba(185,28,28,0.24), 0 4px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(185,28,28,0.16), 0 2px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div className="h-1 w-full" style={{ background: "linear-gradient(to right, #b91c1c, #ef4444, #b91c1c)" }} />
              {/* Featured badge */}
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-white text-xs font-bold tracking-wide"
                style={{ background: "linear-gradient(135deg, #b91c1c, #d97706)" }}>
                Popular
              </div>
              <div className="p-6 md:p-7">
                <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center shadow-md"
                  style={{ background: "linear-gradient(135deg, #b91c1c, #ef4444)" }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg md:text-xl mb-1"
                  style={{ color: "#7f1d1d", fontFamily: "'Georgia', serif" }}>Customer Portal</h3>
                <p className="text-red-600 text-xs md:text-sm mb-5 opacity-80">Access your profile & matches</p>
                <div className="flex gap-3">
                  <Link to="/customer-login"
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center text-white transition-all duration-200"
                    style={{ background: "linear-gradient(135deg, #b91c1c, #991b1b)", boxShadow: "0 2px 8px rgba(185,28,28,0.35)" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(185,28,28,0.55)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(185,28,28,0.35)"}
                  >Login</Link>
                  <Link to="/customer-registration"
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200"
                    style={{ background: "rgba(185,28,28,0.08)", color: "#991b1b", border: "1px solid rgba(185,28,28,0.25)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(185,28,28,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(185,28,28,0.08)"}
                  >Register</Link>
                </div>
              </div>
            </div>

            {/* Matrimony Portal */}
            <div className="relative rounded-2xl overflow-hidden group transition-all duration-300"
              style={{
                background: "linear-gradient(160deg, #fff5f7 0%, #fce7f3 100%)",
                boxShadow: "0 4px 20px rgba(219,39,119,0.1), 0 1px 4px rgba(0,0,0,0.04)",
                border: "1px solid rgba(219,39,119,0.18)",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 36px rgba(219,39,119,0.18), 0 2px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(219,39,119,0.1), 0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div className="h-1 w-full" style={{ background: "linear-gradient(to right, #db2777, #ec4899, #db2777)" }} />
              <div className="p-6 md:p-7">
                <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center shadow-md"
                  style={{ background: "linear-gradient(135deg, #db2777, #ec4899)" }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg md:text-xl mb-1"
                  style={{ color: "#831843", fontFamily: "'Georgia', serif" }}>Matrimony Portal</h3>
                <p className="text-pink-600 text-xs md:text-sm mb-5 opacity-80">Find your perfect life partner</p>
                <a
                  href="https://eliteinovamatrimony.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 rounded-xl text-sm font-semibold text-center text-white transition-all duration-200"
                  style={{ background: "linear-gradient(135deg, #db2777, #b91c1c)", boxShadow: "0 2px 8px rgba(219,39,119,0.3)" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(219,39,119,0.5)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(219,39,119,0.3)"}
                >
                  Matrimony Registration
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

    </div>
  );
}