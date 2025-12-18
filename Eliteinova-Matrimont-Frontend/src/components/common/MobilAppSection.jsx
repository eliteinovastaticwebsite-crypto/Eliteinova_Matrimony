import React from "react";
import MabileApp from "../../assets/MabileApp.avif";

const MobilAppSection = () => {
  return (
    <div
      id="mobileapp-section"
      className="py-16 text-white relative bg-gradient-to-b from-white to-red-50"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 mb-6">
              <span className="text-yellow-400 text-lg mr-2">📱</span>
              <span className="text-gray-200 text-sm font-medium">MOBILE APP</span>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-red-500 mb-4">
              Find Your Match <span className="text-yellow-500">On The Go</span>
            </h3>

            <p className="text-black text-lg mb-8 leading-relaxed font-semibold">
              Download our premium mobile app for instant matches, real-time
              notifications, and seamless communication with potential partners.
            </p>

            {/* Store Buttons */}
            <div className="flex flex-row gap-4 justify-center lg:justify-start flex-wrap">
              {/* Google Play Store Button */}
              <a
                href="https://play.google.com/store/apps/details?id=com.yourdatingapp"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 hover:scale-105 flex items-center justify-center group"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-14 w-auto md:h-16 object-contain transition-transform duration-300 group-hover:scale-100"
                />
              </a>

              {/* Apple App Store Button */}
              <a
                href="https://apps.apple.com/app/your-dating-app/id123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 hover:scale-105 flex items-center justify-center group"
              >
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="h-14 w-auto md:h-16 object-contain transition-transform duration-300 group-hover:scale-100"
                />
              </a>
            </div>
          </div>

          {/* App Screenshot Section */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-64 h-97 rounded-3xl shadow-2xl overflow-hidden relative">
                <img
                  src={MabileApp}
                  alt="App Home Screenshot"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating decorative circles */}
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
