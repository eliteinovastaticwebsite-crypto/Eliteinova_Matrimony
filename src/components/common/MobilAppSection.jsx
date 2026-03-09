import React from "react";
import MabileApp from "../../assets/mobileapp.jpeg";

const MobilAppSection = ({ onRegister }) => {
  return (
    <div
      id="mobileapp-section"
      className="py-4 text-white relative bg-gradient-to-b from-white to-red-50"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Badge */}
        <div className="flex justify-start mb-3">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 shadow-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-red-600 text-sm font-medium uppercase">Matrimony Mobile App</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

          {/* Left: Content + Register Box */}
          <div className="text-center lg:text-left flex flex-col gap-4">

            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 mb-2">
                <span className="text-yellow-400 text-lg mr-2">📱</span>
                <span className="text-gray-200 text-sm font-medium">MOBILE APP</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-red-500 mb-2">
                Find Your Match <span className="text-yellow-500">On The Go</span>
              </h3>

              <p className="text-black text-lg mb-3 leading-relaxed font-semibold">
                Download our premium mobile app for instant matches, real-time
                notifications, and seamless communication with potential partners.
              </p>

              {/* Store Buttons */}
              <div className="flex flex-row gap-3 justify-center lg:justify-start flex-wrap">
                <a
                  href="https://play.google.com/store/apps/details?id=com.yourdatingapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:scale-105 flex items-center justify-center group"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    className="h-11 w-auto object-contain"
                  />
                </a>
                <a
                  href="https://apps.apple.com/app/your-dating-app/id123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:scale-105 flex items-center justify-center group"
                >
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    className="h-11 w-auto object-contain"
                  />
                </a>
              </div>
            </div>

            {/* Register Now Box - below words, left side only */}
            {onRegister && (
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-2xl p-5 shadow-2xl relative overflow-hidden w-full max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 opacity-75 animate-pulse"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-white font-bold text-xl sm:text-2xl mb-2 animate-bounce">
                    🎉 Register Now! 🎉
                  </h3>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4">
                    <span className="text-white/90 text-xs sm:text-sm">Silver ₹299</span>
                    <span className="text-white font-bold">|</span>
                    <span className="text-white/90 text-xs sm:text-sm">Gold ₹499</span>
                    <span className="text-white font-bold">|</span>
                    <span className="text-white/90 text-xs sm:text-sm">Diamond ₹749</span>
                  </div>
                  <button
                    onClick={onRegister}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right: App Screenshot - UNCHANGED */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-60 h-30 rounded-3xl shadow-2xl overflow-hidden relative">
                <img
                  src={MabileApp}
                  alt="App Home Screenshot"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-bounce animation-delay-1000"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MobilAppSection;