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

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">

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

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 mt-4 md:mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-red-800 mb-4 md:mb-6">
            Welcome to Eliteinova Matrimonial Services
          </h2>
          <div className="bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6">

              <div className="bg-gradient-to-br from-yellow-100 to-red-100 p-4 md:p-5 lg:p-6 rounded-lg border border-yellow-200">
                <h3 className="font-pacifico text-base md:text-lg lg:text-xl text-red-700 mb-2 md:mb-3">Vendor Portal</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">Partner services access</p>
                <div className="flex gap-2">
                  <Link to="/vendor-login" className="flex-1 bg-yellow-600 text-red-900 px-3 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors text-center">
                    Login
                  </Link>
                  <Link to="/vendor-login" className="flex-1 bg-yellow-500 text-red-900 px-3 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors text-center">
                    Register
                  </Link>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-100 to-yellow-100 p-4 md:p-5 lg:p-6 rounded-lg border border-red-200">
                <h3 className="font-pacifico text-base md:text-lg lg:text-xl text-red-700 mb-2 md:mb-3">Customer Portal</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">Access your profile</p>
                <div className="flex gap-2">
                  <Link to="/customer-login" className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors text-center">
                    Login
                  </Link>
                  <Link to="/customer-registration" className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors text-center">
                    Register
                  </Link>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-100 to-red-100 p-4 md:p-5 lg:p-6 rounded-lg border border-pink-200">
                <h3 className="font-pacifico text-base md:text-lg lg:text-xl text-red-700 mb-2 md:mb-3">Matrimony Portal</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">Find your perfect partner</p>
                
                 <a href="https://eliteinovamatrimony.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:from-red-700 hover:to-pink-700 transition-all text-center"
                >
                  Matrimony Registration
                </a>
              </div>

            </div>
          </div>
        </div>
      </main>

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

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

    </div>
  );
}