// src/pages/ServicesPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { mockServiceService } from "../services/MockServiceService";
import { 
  StarIcon, 
  CheckBadgeIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  HeartIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  UserGroupIcon,
  CakeIcon,
  HeartIcon as HeartOutlineIcon
} from "@heroicons/react/24/solid";
import Banner from "../components/common/Banner";
import AuthModal from "../components/auth/AuthModal"; // Add this import
import BannerImage5 from "../assets/BannerImage5.jpg";

const ServiceBannerTexts = [
  {
    title: "Premium Matrimony Services",
    subtitle: "Choose from Membership Plans, Profile Verification, Assisted Matrimony, and Wedding Planning — everything you need for a successful match.",
    cta: "Explore Our Services",
  },
];

const ServiceBannerImages = [BannerImage5];

export default function Services({ onOpenAuthModal }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  // ADD THESE LINES - Local auth state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("register");

  // Enhanced icon mapping with fallbacks
  const iconMap = {
    HeartIcon: HeartIcon,
    ShieldCheckIcon: ShieldCheckIcon,
    StarIcon: StarIcon,
    UserGroupIcon: UserGroupIcon,
    CakeIcon: CakeIcon,
    HeartOutlineIcon: HeartOutlineIcon,
    UsersIcon: UsersIcon,
    ChatBubbleLeftRightIcon: ChatBubbleLeftRightIcon,
    PhotoIcon: PhotoIcon
  };

  // ADD THIS FUNCTION - Handle auth modal opening
  const handleOpenAuthModal = (mode = "register") => {
    if (onOpenAuthModal && typeof onOpenAuthModal === 'function') {
      // Use parent's function if provided
      onOpenAuthModal(mode);
    } else {
      // Use local state if no parent function
      setAuthModalMode(mode);
      setShowAuthModal(true);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Check if service exists and has the method
        if (!mockServiceService || typeof mockServiceService.getServices !== 'function') {
          console.warn('MockServiceService not available, using fallback data');
          // Provide fallback services data
          const fallbackServices = getFallbackServices();
          setServices(fallbackServices);
          return;
        }
        
        const servicesData = await mockServiceService.getServices();
        
        if (servicesData && servicesData.services) {
          setServices(servicesData.services);
        } else {
          console.warn('No services data returned, using fallback');
          const fallbackServices = getFallbackServices();
          setServices(fallbackServices);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err.message || "Failed to load services. Showing demo services.");
        // Provide fallback services
        const fallbackServices = getFallbackServices();
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  // Fallback services data in case the service is not available
  const getFallbackServices = () => {
    return [
      {
        id: 1,
        name: "Premium Membership",
        description: "Unlock unlimited profile views, advanced search filters, and priority customer support.",
        category: "membership",
        icon: { name: "StarIcon" },
        popular: true,
        badge: "Most Popular",
        duration: "1 Year",
        features: [
          "Unlimited Profile Views",
          "Advanced Search Filters",
          "Priority Customer Support",
          "Express Interest to 50+ Profiles"
        ]
      },
      {
        id: 2,
        name: "Profile Verification",
        description: "Get your profile verified with background checks and document verification for trust and safety.",
        category: "verification",
        icon: { name: "ShieldCheckIcon" },
        featured: true,
        duration: "48 Hours",
        features: [
          "Document Verification",
          "Background Check",
          "Trust Badge on Profile",
          "Priority in Search Results"
        ]
      },
      {
        id: 3,
        name: "Assisted Matrimony",
        description: "Personal matchmaking service with dedicated relationship managers for personalized matches.",
        category: "assisted",
        icon: { name: "UserGroupIcon" },
        duration: "3 Months",
        features: [
          "Dedicated Relationship Manager",
          "Personalized Match Suggestions",
          "Profile Optimization",
          "Meeting Coordination"
        ]
      },
      {
        id: 4,
        name: "Wedding Planning",
        description: "Complete wedding planning assistance from venue selection to ceremony coordination.",
        category: "wedding",
        icon: { name: "CakeIcon" },
        duration: "Custom",
        features: [
          "Venue Selection",
          "Vendor Coordination",
          "Budget Planning",
          "Day-of Coordination"
        ]
      },
      {
        id: 5,
        name: "Photo Shoot Service",
        description: "Professional profile photo shoot to make your profile stand out.",
        category: "assisted",
        icon: { name: "PhotoIcon" },
        duration: "1 Day",
        features: [
          "Professional Photographer",
          "Multiple Outfits",
          "Studio & Outdoor Shoots",
          "Digital Copies Provided"
        ]
      },
      {
        id: 6,
        name: "Astrology Matching",
        description: "Detailed horoscope matching and compatibility analysis for perfect matches.",
        category: "verification",
        icon: { name: "HeartIcon" },
        duration: "24 Hours",
        features: [
          "Detailed Horoscope Analysis",
          "Compatibility Report",
          "Matching Points Calculation",
          "Remedial Suggestions"
        ]
      }
    ];
  };

  // Memoized categories to prevent recalculation on every render
  const categories = useMemo(() => [
    { id: "all", name: "All Services", count: services.length },
    { id: "membership", name: "Membership Plans", count: services.filter(s => s.category === "membership").length },
    { id: "verification", name: "Verification & Privacy", count: services.filter(s => s.category === "verification").length },
    { id: "assisted", name: "Assisted Matrimony", count: services.filter(s => s.category === "assisted").length },
    { id: "wedding", name: "Wedding Assistance", count: services.filter(s => s.category === "wedding").length }
  ], [services]);

  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const handleServiceSelect = (service) => {
    console.log("Service selected:", service);
    
    if (onOpenAuthModal) {
      // If user is not logged in, open auth modal
      onOpenAuthModal("register");
    } else {
      // Fallback action
      alert(`Thank you for your interest in ${service.name}! Our team will contact you shortly.`);
    }
  };

  // Helper function to get icon component safely
  const getIconComponent = (service) => {
    if (!service.icon) return UsersIcon;
    
    const iconName = typeof service.icon === 'string' ? service.icon : service.icon.name;
    return iconMap[iconName] || UsersIcon;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* UPDATE THE BANNER - Use the local function */}
      <Banner
        images={ServiceBannerImages}
        texts={ServiceBannerTexts}
        autoPlayInterval={3000}
        onOpenAuthModal={() => handleOpenAuthModal("register")} 
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 border-2 ${
                selectedCategory === category.id
                  ? "bg-red-600 text-white border-red-600 shadow-lg"
                  : "bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:text-red-600"
              } hover:scale-105`}
            >
              {category.name}
              <span className="ml-2 text-sm opacity-80">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Error Message - Only show if it's a real error, not fallback message */}
        {error && !error.includes("demo") && !error.includes("fallback") && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 text-center max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Info Message for Fallback Data */}
        {error && (error.includes("demo") || error.includes("fallback")) && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-2xl mb-8 text-center max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span>Showing demo services data</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading premium services...</p>
            </div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const IconComponent = getIconComponent(service);
              
              return (
                <div
                  key={service.id}
                  className={`relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group border ${
                    service.popular ? 'border-yellow-300' : 'border-gray-200'
                  } hover:border-red-300 hover:-translate-y-2`}
                >
                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
                        <StarIcon className="w-4 h-4" />
                        <span>{service.badge || "Popular"}</span>
                      </div>
                    </div>
                  )}

                  {/* Featured Ribbon */}
                  {service.featured && !service.popular && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold rotate-12 shadow-lg">
                      Featured
                    </div>
                  )}

                  {/* Service Icon */}
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                      service.popular 
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' 
                        : service.featured
                        ? 'bg-gradient-to-br from-red-500 to-red-600'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Service Details */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors">
                    {service.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Duration */}
                  {service.duration && (
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{service.duration}</span>
                      </div>
                    </div>
                  )}

                  {/* Features List */}
                  <div className="mb-6 space-y-2">
                    {service.features && service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm text-gray-600">
                        <CheckBadgeIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => handleServiceSelect(service)}
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-300 group-hover:scale-105 ${
                      service.popular
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 hover:from-yellow-500 hover:to-yellow-600'
                        : service.featured
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                    } shadow-lg hover:shadow-xl`}
                  >
                    Get Started Now
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Need Personalized Assistance?</h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Our relationship experts are here to help you choose the perfect service for your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onOpenAuthModal ? onOpenAuthModal("register") : alert("Please contact us at support@eliteinova.com")}
                className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                📞 Call Us Now
              </button>
              <button 
                onClick={() => onOpenAuthModal ? onOpenAuthModal("register") : alert("Please contact us at support@eliteinova.com")}
                className="bg-yellow-400 text-red-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                💬 Chat with Expert
              </button>
            </div>
          </div>
        </div>
      </div>
       <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}