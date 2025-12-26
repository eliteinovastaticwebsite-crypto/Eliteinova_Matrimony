import React, { useState, useEffect } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down 300px
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-6 right-20 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        className="bg-red-400 hover:bg-red-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Scroll to top"
      >
        <ChevronUpIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
