// src/pages/UpgradePage.jsx
import React, { useEffect, useState } from "react";
import { mockPlanService as planService } from "../services/mockPlanService";
import { 
  CheckBadgeIcon, 
  StarIcon, 
  ShieldCheckIcon,
  HeartIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  BoltIcon,
  TrophyIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";
import Banner from "../components/common/Banner";
import AuthModal from "../components/auth/AuthModal"; 
import SubscriptionPage from "./SubscriptionPage"; // ADD THIS IMPORT
import BannerImage6 from "../assets/BannerImage6.jpg";

const UpgradeBannerTexts = [
  {
    title: "Premium Matches for Elite Brides & Grooms",
    subtitle: "Upgrade to Elitenxt Premium for priority matchmaking, verified profiles, and personalized assistance to help you find your perfect match faster.",
    cta: "Register To Upgrade Now",
  },
];

const UpgradeBannerImages = [BannerImage6];

// Fallback plans data
const getFallbackPlans = () => [
  {
    id: 1,
    name: "Silver",
    description: "Essential features to start your journey",
    price: "0",
    duration: "Forever",
    featured: false,
    popular: false,
    color: "gray",
    features: [
      "Create Complete Profile",
      "Browse Limited Profiles Daily",
      "Send 10 Interests Monthly",
      "Basic Search Filters",
      "Email Support",
      "Profile Verification Available",
      "Mobile App Access"
    ],
    buttonText: "Start Free"
  },
  {
    id: 2,
    name: "Gold",
    description: "Enhanced features for serious seekers",
    price: "2,999",
    duration: "3 months",
    featured: true,
    popular: true,
    color: "gold",
    features: [
      "Unlimited Profile Views",
      "Priority in Search Results",
      "Send Unlimited Interests",
      "Advanced Search Filters",
      "View Contact Details",
      "Dedicated Support Manager",
      "Profile Highlighting",
      "Compatibility Reports",
      "Message Read Receipts",
      "Extended Profile Visibility"
    ],
    savings: "Save 40%",
    buttonText: "Go Gold"
  },
  {
    id: 3,
    name: "Diamond",
    description: "Ultimate personalized matchmaking experience",
    price: "9,999",
    duration: "6 months",
    featured: true,
    popular: false,
    color: "purple",
    features: [
      "All Gold Features",
      "Personal Matchmaking Assistant",
      "Video Profile Creation",
      "Premium Background Verification",
      "Astrology Compatibility Reports",
      "Family Mediation Services",
      "24/7 Priority Support",
      "Featured Profile Daily",
      "Verified Trust Badge",
      "Exclusive Events Access",
      "Relationship Counseling Sessions"
    ],
    savings: "Save 50%",
    buttonText: "Go Diamond"
  }
];

// Icon mapping for plans
const planIcons = {
  1: UsersIcon,      // Silver
  2: StarIcon,       // Gold
  3: TrophyIcon      // Diamond
};

export default function Upgrade({ onOpenAuthModal }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  // ADD THESE LINES - Local auth state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("register");
  const [showSubscription, setShowSubscription] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

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
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await planService.getPlans();
        
        if (response.success) {
          setPlans(response.data);
        } else {
          throw new Error("Failed to load plans");
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Failed to load plans. Showing demo plans.");
        setPlans(getFallbackPlans());
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  const handleSelectPlan = async (planId) => {
    setSelectedPlanId(planId);
    setShowSubscription(true);
  };

  // Stats data
  const stats = [
    { number: "5x", label: "More Responses" },
    { number: "92%", label: "Success Rate" },
    { number: "24/7", label: "Priority Support" },
    { number: "1000+", label: "Monthly Matches" }
  ];

  // FAQ data
  const faqs = [
    {
      question: "Can I upgrade later?",
      answer: "Yes! You can upgrade from Silver to Gold or Diamond at any time."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, UPI, net banking, and popular wallets."
    },
    {
      question: "Is my payment secure?",
      answer: "Absolutely! We use bank-level encryption and never store your card details."
    },
    {
      question: "Can I get a refund?",
      answer: "Yes, we offer a 7-day money-back guarantee if you're not satisfied."
    }
  ];

  if (showSubscription) {
    return (
      <SubscriptionPage
        planId={selectedPlanId}
        onClose={() => {
          setShowSubscription(false);
          setSelectedPlanId(null);
        }}
        onSuccess={(plan) => {
          setShowSubscription(false);
          setSelectedPlanId(null);
          // Handle successful subscription
          console.log("Subscribed to:", plan.name);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative">
        {/* UPDATE THE BANNER - Use the local function */}
        <Banner
          images={UpgradeBannerImages}
          texts={UpgradeBannerTexts}
          autoPlayInterval={3000}
          onOpenAuthModal={() => handleOpenAuthModal("register")} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-2xl mb-8 text-center max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading premium plans...</p>
            </div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No plans available</h3>
            <p className="text-gray-500">Please check back later for available plans</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const IconComponent = planIcons[plan.id];
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group border-2 ${
                    plan.popular 
                      ? 'border-yellow-400 bg-gradient-to-b from-white to-yellow-50 scale-105' 
                      : plan.name === 'Silver'
                      ? 'border-gray-300 bg-gradient-to-b from-gray-50 to-white'
                      : 'border-purple-400 bg-gradient-to-b from-white to-purple-50'
                  } hover:scale-105`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                        <StarIcon className="w-4 h-4" />
                        <span>MOST POPULAR</span>
                      </div>
                    </div>
                  )}

                  {/* Plan Icon */}
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                      plan.popular 
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' 
                        : plan.name === 'Silver'
                        ? 'bg-gradient-to-br from-gray-400 to-gray-600'
                        : 'bg-gradient-to-br from-purple-500 to-purple-700'
                    }`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Plan Name */}
                  <h2 className={`text-3xl font-bold text-center mb-2 ${
                    plan.popular ? 'text-yellow-600' : 
                    plan.name === 'Silver' ? 'text-gray-600' : 'text-purple-600'
                  }`}>
                    {plan.name}
                  </h2>

                  {/* Plan Description */}
                  <p className="text-gray-600 text-center mb-6">
                    {plan.description}
                  </p>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className={`text-4xl font-bold ${
                        plan.popular ? 'text-yellow-600' : 
                        plan.name === 'Silver' ? 'text-gray-600' : 'text-purple-600'
                      }`}>
                        {plan.price === "0" || plan.price === 0 ? "Free" : `₹${plan.price}`}
                      </span>
                      <span className="text-gray-500 text-lg">/{plan.duration}</span>
                    </div>
                    {plan.savings && (
                      <p className="text-green-600 text-sm font-semibold mt-2">
                        {plan.savings}
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckBadgeIcon className={`w-5 h-5 flex-shrink-0 ${
                          plan.popular ? 'text-yellow-500' : 
                          plan.name === 'Silver' ? 'text-gray-500' : 'text-purple-500'
                        }`} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={selectedPlan === plan.id}
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.popular
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 hover:from-yellow-500 hover:to-yellow-600'
                        : plan.name === 'Silver'
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                        : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                    }`}
                  >
                    {selectedPlan === plan.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <span>{plan.buttonText}</span>
                        <BoltIcon className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Guarantee Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 border border-green-200">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                <div className="text-left">
                  <h3 className="font-bold text-gray-800">7-Day Money Back</h3>
                  <p className="text-sm text-gray-600">100% satisfaction guarantee</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <EyeIcon className="w-8 h-8 text-blue-600" />
                <div className="text-left">
                  <h3 className="font-bold text-gray-800">Secure Payment</h3>
                  <p className="text-sm text-gray-600">SSL encrypted transactions</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-600" />
                <div className="text-left">
                  <h3 className="font-bold text-gray-800">24/7 Support</h3>
                  <p className="text-sm text-gray-600">Always here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-red-200 transition-colors">
                <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
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