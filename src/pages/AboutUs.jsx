// src/pages/AboutUs.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheckIcon, 
  HeartIcon, 
  UserGroupIcon, 
  SparklesIcon,
  GlobeAltIcon
} from "@heroicons/react/24/solid";
import Banner from "../components/common/Banner";
import AuthModal from "../components/auth/AuthModal"; // Import AuthModal

import AboutUsImage from "../assets/aboutUs.png";
import BannerImage1 from "../assets/BannerImage11.png";

const AboutBannerTexts = [
  {
    title: "About Eliteinova Matrimony",
    subtitle: "Where tradition meets technology in the sacred journey of finding your soulmate. We don't just match profiles; we unite hearts and families.",
    cta: "Register Now",
  },
];

const AboutBannerImages = [BannerImage1];

const AboutUs = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("register");

  // Handle auth modal opening
  const handleOpenAuthModal = (mode = "register") => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  // Handle contact navigation
  const handleContactClick = () => {
    navigate('/contact');
  };

  const stats = [
    { number: "10,000+", label: "Successful Matches", icon: "💑" },
    { number: "50+", label: "Cities Covered", icon: "🌍" },
    { number: "95%", label: "Success Rate", icon: "🏆" },
    { number: "24/7", label: "Support", icon: "🛡️" }
  ];

  const values = [
    {
      icon: ShieldCheckIcon,
      title: "Trust & Safety",
      description: "Every profile undergoes rigorous verification for your peace of mind."
    },
    {
      icon: HeartIcon,
      title: "Genuine Connections",
      description: "We focus on meaningful relationships built on shared values and compatibility."
    },
    {
      icon: UserGroupIcon,
      title: "Family First",
      description: "Understanding and respecting family values in the matchmaking process."
    },
    {
      icon: SparklesIcon,
      title: "Innovation",
      description: "Using advanced technology to make your search smarter and faster."
    }
  ];

  const features = [
    {
      title: "Verified Profiles",
      description: "Rigorous background checks and document verification",
      icon: "✅"
    },
    {
      title: "AI-Powered Matching",
      description: "Smart algorithms that understand your preferences",
      icon: "🤖"
    },
    {
      title: "Privacy Control",
      description: "Complete control over who sees your profile and information",
      icon: "🔒"
    },
    {
      title: "Dedicated Support",
      description: "Personal relationship managers for premium members",
      icon: "👨‍💼"
    },
    {
      title: "Community Focus",
      description: "Specialized matchmaking for different communities and regions",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      title: "Mobile App",
      description: "Find matches on the go with our dedicated mobile application",
      icon: "📱"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50">
      
      {/* Banner Section */}
      <Banner
        images={AboutBannerImages}
        texts={AboutBannerTexts}
        autoPlayInterval={3000}
        onOpenAuthModal={() => handleOpenAuthModal("register")}
      />

      {/* About Content Section - Left Content & Right Image */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
              About Our Journey
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Welcome to <span className="text-red-600">Eliteinova Matrimony</span>
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to Eliteinova Matrimony, your trusted partner in finding a meaningful and lasting relationship. We believe that marriage is not just about finding a partner — it's about building a lifelong bond based on trust, respect, and understanding.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              At Eliteinova Matrimony, we blend traditional values with modern technology to bring together people who share similar goals, beliefs, and lifestyles. Our platform is designed to make your search for a life partner simple, secure, and successful.
            </p>

            {/* Key Points */}
            <div className="space-y-4 pt-4">
              {[
                "AI-powered matchmaking for better compatibility",
                "100% verified profiles for your safety",
                "Dedicated relationship managers",
                "Community-specific matchmaking"
              ].map((point, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={() => handleOpenAuthModal("register")}
                className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Your Journey
              </button>
              <button
                onClick={handleContactClick}
                className="px-8 py-4 bg-white text-red-600 border-2 border-red-600 font-bold rounded-xl hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src={AboutUsImage}
                alt="Eliteinova Matrimony Team"
                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
            </div>
            
            {/* Background Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-200 rounded-full -z-10 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-red-200 rounded-full -z-10 animate-pulse animation-delay-2000"></div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="group bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <GlobeAltIcon className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="text-3xl font-bold text-yellow-300">Our Mission</h3>
            </div>
            <p className="text-lg text-red-100 leading-relaxed">
              To revolutionize matchmaking by blending cultural heritage with cutting-edge technology. 
              We're committed to creating authentic connections that lead to lifelong partnerships, 
              ensuring every match is built on trust, compatibility, and shared values.
            </p>
          </div>

          {/* Vision */}
          <div className="group bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-8 text-red-900 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <SparklesIcon className="w-8 h-8 text-red-700" />
              </div>
              <h3 className="text-3xl font-bold text-red-700">Our Vision</h3>
            </div>
            <p className="text-lg text-red-800 leading-relaxed">
              To be the world's most trusted platform for meaningful relationships, 
              where technology enhances human connections and every search ends with 
              a beautiful beginning of lifelong companionship and happiness.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-red-600">Core Values</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The principles that guide every match we make and every relationship we build
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What Makes Us Different */}
<div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 py-20">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Why Choose <span className="text-red-600">Eliteinova?</span>
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        We go beyond traditional matchmaking to offer you a complete, secure, and personalized experience
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group bg-white rounded-2xl p-8 border border-gray-200 shadow-md hover:shadow-xl hover:border-red-400 transition-all duration-500 hover:scale-105"
        >
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-3xl text-red-500">{feature.icon}</span>
            <h3 className="text-xl font-semibold text-gray-800">
              {feature.title}
            </h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* Success Stories Preview */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Success <span className="text-red-600">Stories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of couples who found their perfect match through Eliteinova Matrimony
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              couple: "Rajesh & Priya",
              story: "Found each other through community matching. Married for 2 years!",
              image: "👨‍❤️‍👨"
            },
            {
              couple: "Arun & Deepa",
              story: "Connected through our AI matching system. Perfect compatibility!",
              image: "💑"
            },
            {
              couple: "Suresh & Lakshmi",
              story: "Met through family referral. Living their dream life together!",
              image: "👩‍❤️‍💋‍👩"
            }
          ].map((story, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 text-center group"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform duration-300">
                {story.image}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{story.couple}</h3>
              <p className="text-gray-600 leading-relaxed">{story.story}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-red-600 to-yellow-500 rounded-3xl p-12 text-white shadow-2xl">
          <h3 className="text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h3>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join our family of successful matches and begin your search for a lifelong partner today. 
            Your perfect match is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleOpenAuthModal("register")}
              className="px-8 py-4 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:scale-105"
            >
              Register Now
            </button>
            <button
              onClick={handleContactClick}
              className="px-8 py-4 bg-yellow-400 text-red-900 font-bold rounded-full hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:scale-105"
            >
              Talk to Our Experts
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;