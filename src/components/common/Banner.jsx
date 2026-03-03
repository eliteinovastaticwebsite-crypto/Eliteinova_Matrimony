import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Banner({
  images = [],
  texts = [],
  autoPlayInterval = 5000,
  onGetStarted,
  onOpenAuthModal,
  hideOverlay = false,
  showText = true,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const defaultImages = [
    "https://via.placeholder.com/1920x650/4A5568/FFFFFF?text=Default+Banner+1",
    "https://via.placeholder.com/1920x650/2D3748/FFFFFF?text=Default+Banner+2",
  ];

  const defaultTexts = [
    {
      title: "Find Your Perfect Match",
      subtitle: "Join thousands of successful marriages in Tamil Nadu",
      paragraph: "", // Added empty paragraph to default texts
      cta: "Get Started Now",
    },
  ];

  const bannerImages = images.length > 0 ? images : defaultImages;
  const bannerTexts = texts.length > 0 ? texts : defaultTexts;

  useEffect(() => {
    if (!isAutoPlay || bannerImages.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlay, bannerImages.length, autoPlayInterval, currentIndex]);

  const nextSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
      setFade(true);
    }, 300);
  };

  const prevSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
      setFade(true);
    }, 300);
  };

  const goToSlide = (index) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, 300);
  };

  const handleGetStartedClick = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal("register");
    } else if (onGetStarted) {
      onGetStarted();
    }
  };

  const handleBackClick = () => {
    if (isAuthenticated) {
      navigate("/profiles");
    } else {
      navigate("/");
    }
  };

  const textIndex = currentIndex % bannerTexts.length;
  const currentText = bannerTexts[textIndex];

  return (
    <section className="relative w-full min-h-[320px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[580px] overflow-hidden group flex items-center">

      {/* 🔙 Back Button */}
      <div className="absolute top-24 md:top-28 left-4 md:left-6 z-40">
        <Button
          variant=""
          size="sm"
          onClick={handleBackClick}
          className="flex items-center gap-2 bg-gray/40 text-white border border-white/30 backdrop-blur-md hover:bg-black/60 transition-all"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="hidden md:inline">{isAuthenticated ? "Back to Profile" : "Back to Home"}</span>
        </Button>
      </div>

      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {bannerImages.map((img, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={img}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error(`Failed to load banner image: ${img}`);
                e.target.style.display = "none";
              }}
            />
          </div>
        ))}

        {/* Subtle Gradient Overlay */}
        {!hideOverlay && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-black/8 z-10"></div>
        )}
      </div>

      {/* Content Overlay - Hidden when showText is false */}
      {showText && (
        <div className="relative z-20 w-full flex items-center justify-center h-full px-4 sm:px-6 md:px-12">
          <div className="max-w-4xl w-full text-center">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              <span
                className={`inline-block text-white transition-all duration-700 ${
                  fade
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform translate-y-4"
                }`}
              >
                {currentText.title}
              </span>
            </h1>

            {/* Subtitle - INCREASED SIZE, NORMAL WEIGHT */}
            {currentText.subtitle && (
              <p
                className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal mb-4 sm:mb-6 text-yellow-200 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
                  fade
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform translate-y-4"
                }`}
              >
                {currentText.subtitle}
              </p>
            )}

            {/* Paragraph - VERY THIN LIGHT FONT */}
            {currentText.paragraph && (
              <p
                className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-extralight mb-6 sm:mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed tracking-wide transition-all duration-700 delay-300 ${
                  fade
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform translate-y-4"
                }`}
              >
                {currentText.paragraph}
              </p>
            )}

            {/* CTA Button */}
            <div
              className={`transition-all duration-700 delay-400 ${
                fade
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-4"
              }`}
            >
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="xl"
                  className="font-bold text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl border-2 border-yellow-400/30"
                  onClick={handleGetStartedClick}
                >
                  <span className="flex items-center space-x-2">
                    <span>💖</span>
                    <span>{currentText.cta}</span>
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dots */}
      {bannerImages.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2 sm:space-x-3">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 border ${
                index === currentIndex
                  ? "bg-yellow-400 scale-125 border-yellow-300 shadow-lg"
                  : "bg-white/50 hover:bg-white border-white/30"
              }`}
              onClick={() => goToSlide(index)}
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            />
          ))}
        </div>
      )}
    </section>
  );
}