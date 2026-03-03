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
  SparklesIcon,
  RocketLaunchIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  FingerPrintIcon,
  LockClosedIcon,
  InformationCircleIcon
} from "@heroicons/react/24/solid";
import Banner from "../components/common/Banner";
import AuthModal from "../components/auth/AuthModal"; 
import SubscriptionPage from "./SubscriptionPage";
import BannerImage6 from "../assets/BannerImage6.jpg";

const UpgradeBannerTexts = [
  {
    title: "Eliteinova Matrimony",
    subtitle: "Connect with Life Partner and Two Families",
    paragraph:"Eliteinova Matrimony is a trusted platform where meaningful relationships begin and two families unite with happiness and tradition. We combine cultural values with modern technology to help you find a compatible and verified life partner.",
    cta: "Register To Upgrade Now",
  },
];

const UpgradeBannerImages = [BannerImage6];

// Fallback plans data
const getFallbackPlans = () => [
  {
  id: 1,
  name: "Silver",
  description: "Your Future Partner is One Premium Step Away.",
  price: "1000",
  duration: "3 months + tax",
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
  buttonText: "Get Started"
},
  {
    id: 2,
    name: "Gold",
    description: "Verified Matches. Unlimited Access. Premium Advantage",
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
    description: " Join Premium Today – Experience Elite Matchmaking",
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("register");
  const [showSubscription, setShowSubscription] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const handleOpenAuthModal = (mode = "register") => {
    if (onOpenAuthModal && typeof onOpenAuthModal === 'function') {
      onOpenAuthModal(mode);
    } else {
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
          console.log("Subscribed to:", plan.name);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative">
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
        
        {/* INTRO SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-2 px-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
            <RocketLaunchIcon className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-purple-700 font-semibold text-sm">PREMIUM MEMBERSHIP</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Premium</span> Plan
          </h1>
          
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Elite Connections Begin with Premium Access.
          </p>
          
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Upgrade your membership to unlock exclusive features, connect directly with serious profiles, and enjoy priority visibility.
          </p>
          
          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-6 py-2 rounded-full text-lg font-semibold text-purple-600 border-2 border-purple-200 shadow-sm">
                ✨ Upgrade Your Search. Upgrade Your Future. ✨
              </span>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 mt-6 max-w-3xl mx-auto leading-relaxed">
            Take the next step toward a successful and meaningful marriage journey with Eliteinova Premium. 
            Your perfect life partner could be just one premium upgrade away.
          </p>

          {/* Quick Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

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
          <>
            {/* Subscription Cards with "Why Choose" inside */}
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

                    {/* Launch Offer Banner */}
                    <div className="mb-6 p-3 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-xl shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 opacity-75 animate-pulse"></div>
                      <div className="relative z-10 text-center">
                        <h3 className="text-white font-bold text-base md:text-lg mb-1 animate-bounce">
                          🎉 Premium special Offer 🎉
                        </h3>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="text-center mb-8">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <span className={`text-2xl font-bold ${
                          plan.popular ? 'text-gray-600' : 
                          plan.name === 'Silver' ? 'text-gray-600' : 'text-gray-600'
                        }`}>
                          {`₹${plan.price}/Per 3 Months + Tax`}
                        </span>
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

                    {/* Why Choose Section - Inside each premium box */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-800 text-lg mb-3 flex items-center">
                        <InformationCircleIcon className={`w-5 h-5 mr-2 ${
                          plan.name === 'Silver' ? 'text-gray-500' : 
                          plan.name === 'Gold' ? 'text-amber-500' : 'text-purple-500'
                        }`} />
                        Why Choose {plan.name}?
                      </h4>
                      
                      {plan.name === 'Silver' && (
                        <ul className="space-y-2">
                          <li className="flex items-center text-sm text-gray-600">
                            <BoltIcon className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                            Faster Responses
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <EyeIcon className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                            Better Profile Visibility
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <HeartIcon className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                            Connect with Serious Families
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <ShieldCheckIcon className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                            Safe & Verified Platform
                          </li>
                        </ul>
                      )}

                      {plan.name === 'Gold' && (
                        <ul className="space-y-2">
                          <li className="flex items-center text-sm text-gray-600">
                            <BoltIcon className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                            Faster Match Responses
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <UserGroupIcon className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                            Connect with Verified & Premium Profiles
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <EyeIcon className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                            Higher Visibility – More Proposals
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <LockClosedIcon className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                            Trusted & Secure Communication
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <HeartIcon className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                            Serious Families Only
                          </li>
                        </ul>
                      )}

                      {plan.name === 'Diamond' && (
                        <ul className="space-y-2">
                          <li className="flex items-center text-sm text-gray-600">
                            <span className="text-purple-500 mr-2">🔹</span>
                            <span><span className="font-medium">Maximum Visibility</span> – Be Seen First</span>
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <span className="text-purple-500 mr-2">🔹</span>
                            <span><span className="font-medium">Connect with Verified Premium Families</span></span>
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <span className="text-purple-500 mr-2">🔹</span>
                            <span><span className="font-medium">Faster Match Finalization</span></span>
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <span className="text-purple-500 mr-2">🔹</span>
                            <span><span className="font-medium">Personalized Assistance</span></span>
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <span className="text-purple-500 mr-2">🔹</span>
                            <span><span className="font-medium">100% Secure & Confidential Process</span></span>
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button 
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={selectedPlan === plan.id}
                      className={`w-full py-4 rounded-xl font-bold transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6 ${
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

            {/* EXTRA DIAMOND INFO BOX - Only for Diamond */}
            <div className="mt-16">
              {/* Section Title */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Diamond</span> Exclusive Benefits
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  The ultimate premium experience for those who demand the very best
                </p>
              </div>

              {/* Diamond Info Box */}
              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-3xl p-8 md:p-10 shadow-xl border-2 border-purple-300 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200 rounded-full filter blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
                      ULTIMATE PREMIUM CATEGORY
                    </span>
                    <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
                      Diamond Membership
                    </h3>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                      Experience Elite Matchmaking at Its Finest
                    </p>
                  </div>

                  <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto mb-8 leading-relaxed">
                    Diamond Membership is our most exclusive plan, designed for highly serious profiles, business families, 
                    professionals, and NRIs seeking premium, priority, and personalized matchmaking services.
                  </p>

                  <div className="flex flex-col lg:flex-row gap-8 mt-8">
                    <div className="lg:w-1/2">
                      <div className="bg-white/70 rounded-2xl p-6 backdrop-blur-sm h-full">
                        <h4 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                          <SparklesIcon className="w-6 h-6 mr-2" />
                          Why Choose Diamond?
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <span className="text-purple-500 mr-2">🔹</span>
                            <span className="text-gray-700"><span className="font-semibold">Maximum Visibility</span> – Be Seen First</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-500 mr-2">🔹</span>
                            <span className="text-gray-700"><span className="font-semibold">Connect with Verified Premium Families</span></span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-500 mr-2">🔹</span>
                            <span className="text-gray-700"><span className="font-semibold">Faster Match Finalization</span></span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-500 mr-2">🔹</span>
                            <span className="text-gray-700"><span className="font-semibold">Personalized Assistance</span></span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-500 mr-2">🔹</span>
                            <span className="text-gray-700"><span className="font-semibold">100% Secure & Confidential Process</span></span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="lg:w-1/2">
                      <div className="bg-white/70 rounded-2xl p-6 backdrop-blur-sm h-full">
                        <h4 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
                          <BriefcaseIcon className="w-6 h-6 mr-2" />
                          Perfect For
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center bg-white p-3 rounded-xl shadow-sm">
                            <AcademicCapIcon className="w-5 h-5 text-purple-500 mr-2" />
                            <span className="text-gray-700">Doctors, Engineers, IT Professionals</span>
                          </div>
                          <div className="flex items-center bg-white p-3 rounded-xl shadow-sm">
                            <BuildingOfficeIcon className="w-5 h-5 text-purple-500 mr-2" />
                            <span className="text-gray-700">Business Owners & Entrepreneurs</span>
                          </div>
                          <div className="flex items-center bg-white p-3 rounded-xl shadow-sm">
                            <UserGroupIcon className="w-5 h-5 text-purple-500 mr-2" />
                            <span className="text-gray-700">High-Profile Families</span>
                          </div>
                          <div className="flex items-center bg-white p-3 rounded-xl shadow-sm">
                            <GlobeAltIcon className="w-5 h-5 text-purple-500 mr-2" />
                            <span className="text-gray-700">NRI & International Alliances</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Diamond Advantage Section */}
                  <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h4 className="text-2xl font-bold mb-2 flex items-center">
                          <TrophyIcon className="w-8 h-8 mr-2" />
                          Diamond Advantage
                        </h4>
                        <p className="text-lg text-white/90">Elite Connections Begin with Premium Access.</p>
                        <p className="text-white/80 italic mt-2">Upgrade Your Search. Upgrade Your Future.</p>
                      </div>
                      <div className="md:text-right">
                        <p className="text-lg font-semibold max-w-md">
                          With Diamond Membership, your journey toward a perfect life partner becomes faster, smoother, and more exclusive.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
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