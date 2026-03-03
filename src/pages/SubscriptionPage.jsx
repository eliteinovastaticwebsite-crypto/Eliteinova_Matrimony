// src/pages/SubscriptionPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CheckBadgeIcon,
  StarIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon,
  BoltIcon,
  TrophyIcon,
  SparklesIcon,
  XMarkIcon,
  UsersIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  InformationCircleIcon,
  UserGroupIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  FingerPrintIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/solid";
import { mockPlanService as planService } from "../services/mockPlanService";
import api from "../api/axiosUser";

// Payment methods data
const paymentMethods = [
  {
    id: "credit_card",
    name: "Credit/Debit Card",
    icon: CreditCardIcon,
    description: "Pay securely with your card",
    popular: true,
  },
  {
    id: "upi",
    name: "UPI",
    icon: BuildingLibraryIcon,
    description: "Instant UPI payment",
    popular: true,
  },
  {
    id: "netbanking",
    name: "Net Banking",
    icon: BuildingLibraryIcon,
    description: "All major banks supported",
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    icon: DevicePhoneMobileIcon,
    description: "Paytm, PhonePe, Google Pay",
  },
];

const securityFeatures = [
  { name: "256-bit SSL Encryption", icon: LockClosedIcon },
  { name: "PCI DSS Compliant", icon: ShieldCheckIcon },
  { name: "Secure Payment Gateway", icon: CreditCardIcon },
  { name: "Data Privacy Protected", icon: EyeIcon },
];

export default function SubscriptionPage({ planId, onClose, onSuccess }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("credit_card");
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Payment form state
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [upiId, setUpiId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showCouponInput, setShowCouponInput] = useState(false);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        setLoading(true);
        const response = await planService.getPlanById(planId);

        if (response.success) {
          setPlan(response.data);
        } else {
          throw new Error("Failed to load plan details");
        }
      } catch (error) {
        console.error("Error fetching plan:", error);
        // Fallback to demo plans
        const fallbackPlans = getFallbackPlans();
        const foundPlan = fallbackPlans.find((p) => p.id === planId);
        setPlan(foundPlan || fallbackPlans[0]);
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlanDetails();
    }
  }, [planId]);

  const getFallbackPlans = () => [
    {
      id: 1,
      name: "Silver",
      description: "Your Future Partner is One Premium Step Away",
      price: "1000",
      duration: "3 months + Tax",
      features: [
        "View More Verified Profiles",
        "Send limited Interests",
        "Access Basic Contact Details",
        "Priority Profile Listing",
        "Secure contact with Interested Members",
        "Dedicated Customer Support",
      ],
      buttonText: "Get Started",
    },
    {
      id: 2,
      name: "Gold",
      description: "Verified Matches. Unlimited Access. Premium Advantage",
      price: "2000",
      duration: "3 months + Tax",
      features: [
        "Unlimited Profile Views",
        "Direct Contact Details Access",
        "Unlimited Chat & Messaging",
        "Send & Receive Unlimited Interests",
        "Top Priority Profile Visibility",
        "Advanced Match Filters",
        "Dedicated Relationship Manager Support",
        "Profile Highlight in Search Results",
      ],
      savings: "Save 40%",
      buttonText: "Go Gold",
    },
    {
      id: 3,
      name: "Diamond",
      description: "Join Premium Today – Experience Elite Matchmaking",
      price: "3000",
      originalPrice: "19,998",
      duration: "3 months + Tax",
      features: [
         "Unlimited Profile Views & Direct Contact Access",
         "Top Priority Placement in All Search Results",
         "Featured “Diamond Profile” Badge",
         "Unlimited Chat, Interests & Requests",
         "Advanced Matchmaking Filters",
         "Dedicated Relationship Manager",
         "Personal Match Recommendations",
         "Profile Highlight in Premium Listings",
         "Faster Response & Priority Support",
      ],
      savings: "Save 50%",
      buttonText: "Go Diamond",
    },
  ];

  const getPlanStyles = () => {
    if (!plan) return {};

    const baseStyles = {
      Silver: {
        gradient: "from-gray-50 to-gray-100",
        headerGradient: "from-gray-600 to-gray-700",
        accent: "gray",
        accentColor: "gray",
        icon: UsersIcon,
        level: "Basic",
      },
      Gold: {
        gradient: "from-amber-50 via-orange-50 to-yellow-50",
        headerGradient: "from-amber-500 to-orange-500",
        accent: "amber",
        accentColor: "amber",
        icon: TrophyIcon,
        level: "Premium",
      },
      Diamond: {
        gradient: "from-purple-50 via-blue-50 to-indigo-50",
        headerGradient: "from-purple-600 to-blue-600",
        accent: "purple",
        accentColor: "purple",
        icon: SparklesIcon,
        level: "Elite",
      },
    };

    return baseStyles[plan.name] || baseStyles.Silver;
  };

  const getCTAButtonStyles = () => {
    const styles = getPlanStyles();

    switch (styles.accent) {
      case "gray":
        return {
          gradient: "from-gray-500 to-gray-600",
          hoverGradient: "hover:from-gray-600 hover:to-gray-700",
          text: "text-white",
        };
      case "amber":
        return {
          gradient: "from-amber-500 to-amber-600",
          hoverGradient: "hover:from-amber-600 hover:to-amber-700",
          text: "text-white",
        };
      case "purple":
        return {
          gradient: "from-purple-500 to-purple-600",
          hoverGradient: "hover:from-purple-600 hover:to-purple-700",
          text: "text-white",
        };
      default:
        return {
          gradient: "from-purple-500 to-purple-600",
          hoverGradient: "hover:from-purple-600 hover:to-purple-700",
          text: "text-white",
        };
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!agreedToTerms) {
      errors.terms = "You must agree to the terms and conditions";
    }

    if (selectedPayment === "credit_card") {
      if (!cardDetails.number.trim())
        errors.cardNumber = "Card number is required";
      if (!cardDetails.expiry.trim()) errors.expiry = "Expiry date is required";
      if (!cardDetails.cvv.trim()) errors.cvv = "CVV is required";
      if (!cardDetails.name.trim())
        errors.cardName = "Cardholder name is required";
    }

    if (selectedPayment === "upi" && !upiId.trim()) {
      errors.upi = "UPI ID is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (value) => {
    return value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
  };

  const calculateFinalPrice = () => {
    if (!plan || plan.price === "0") return 0;
    const basePrice = parseInt(plan.price.replace(/,/g, ""));
    return basePrice - discount;
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    // Simulate coupon validation
    const validCoupons = {
      WELCOME10: 0.1,
      PREMIUM20: 0.2,
      ELITE50: 0.5,
    };

    const discountRate = validCoupons[couponCode.toUpperCase()];
    if (discountRate) {
      const basePrice = parseInt(plan.price.replace(/,/g, ""));
      setDiscount(Math.floor(basePrice * discountRate));
      setFormErrors({ ...formErrors, coupon: null });
    } else {
      setFormErrors({ ...formErrors, coupon: "Invalid coupon code" });
    }
  };

  // Map plan name to membership type for backend
  const getMembershipType = (planName) => {
    const name = planName?.toUpperCase() || "";
    if (name.includes("SILVER")) return "SILVER";
    if (name.includes("GOLD")) return "GOLD";
    if (name.includes("DIAMOND")) return "DIAMOND";
    return "SILVER"; // Default
  };

  // Razorpay payment handler
  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      setFormErrors({ payment: "Razorpay SDK not loaded. Please refresh the page." });
      return;
    }

    if (!validateForm()) return;

    setProcessing(true);
    setFormErrors({});
    setPaymentStatus(null);

    try {
      const membershipType = getMembershipType(plan?.name);
      
      // Step 1: Create Razorpay Order via Backend
      const orderResponse = await api.post("/api/payments/razorpay/create-order", {
        membershipType: membershipType,
      });

      if (!orderResponse.data.success) {
        setFormErrors({ payment: orderResponse.data.message || "Failed to create order" });
        setProcessing(false);
        return;
      }

      const orderData = orderResponse.data.data;
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Eliteinova Matrimony",
        description: `${plan?.name} Membership Payment`,
        order_id: orderData.orderId,
        method: {
          upi: true,
          card: true,
          netbanking: selectedPayment === "netbanking",
          wallet: selectedPayment === "wallet",
        },
        notes: {
          membershipType: membershipType,
          planName: plan?.name,
        },
        handler: async function (response) {
          // Razorpay handler is ONLY called when payment is successful
          // But we still verify with backend to ensure payment is captured
          setProcessing(true);
          
          try {
            // Step 2: Verify payment with backend (checks signature AND payment status from Razorpay)
            const verifyResponse = await api.post("/api/payments/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              setPaymentStatus("success");
              
              // Download receipt (using payment ID as transaction ID)
              try {
                const receiptResponse = await api.get(
                  `/api/payments/receipt/${response.razorpay_payment_id}`,
                  { responseType: "blob" }
                );
                const url = window.URL.createObjectURL(new Blob([receiptResponse.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `receipt_${response.razorpay_payment_id}.txt`);
                document.body.appendChild(link);
                link.click();
                link.remove();
              } catch (receiptError) {
                console.warn("Could not download receipt:", receiptError);
              }

              // Call success callback and redirect
              setTimeout(() => {
                if (onSuccess) onSuccess(plan);
                navigate(`/payment-success?transactionId=${response.razorpay_payment_id}`);
              }, 1500);
            } else {
              setPaymentStatus("failed");
              setFormErrors({
                payment: verifyResponse.data.message || "Payment verification failed. Please contact support.",
              });
              setProcessing(false);
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            setPaymentStatus("failed");
            setFormErrors({
              payment: verifyError.response?.data?.message || "Payment verification failed. Please contact support.",
            });
            setProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.mobile || "",
        },
        theme: {
          color: "#DC2626", // Red color matching your theme
        },
        modal: {
          ondismiss: function () {
            // User closed the modal without completing payment
            setProcessing(false);
            setPaymentStatus(null);
            setFormErrors({});
          },
        },
      };

      // Step 3: Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
      setFormErrors({
        payment: error.response?.data?.message || "Payment processing failed. Please try again.",
      });
      setProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    const styles = getPlanStyles();

    // Get border color class based on accent
    const getBorderColorClass = (isSelected) => {
      if (!isSelected) return "border-gray-200 hover:border-gray-300";

      switch (styles.accent) {
        case "gray":
          return "border-gray-500 bg-gray-50";
        case "amber":
          return "border-amber-500 bg-amber-50";
        case "purple":
          return "border-purple-500 bg-purple-50";
        default:
          return "border-purple-500 bg-purple-50";
      }
    };

    // Get icon background color class
    const getIconBgClass = (isSelected) => {
      if (!isSelected) return "bg-gray-100";

      switch (styles.accent) {
        case "gray":
          return "bg-gray-500";
        case "amber":
          return "bg-amber-500";
        case "purple":
          return "bg-purple-500";
        default:
          return "bg-purple-500";
      }
    };

    // Get icon color class
    const getIconColorClass = (isSelected) => {
      return isSelected ? "text-white" : "text-gray-600";
    };

    // Get radio button color class
    const getRadioColorClass = (isSelected) => {
      if (!isSelected) return "border-gray-300";

      switch (styles.accent) {
        case "gray":
          return "border-gray-500 bg-gray-500";
        case "amber":
          return "border-amber-500 bg-amber-500";
        case "purple":
          return "border-purple-500 bg-purple-500";
        default:
          return "border-purple-500 bg-purple-500";
      }
    };

    switch (selectedPayment) {
      case "credit_card":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-${
                  styles.accent
                }-500 focus:border-transparent ${
                  formErrors.cardNumber ? "border-red-300" : "border-gray-300"
                }`}
                value={formatCardNumber(cardDetails.number)}
                onChange={(e) =>
                  setCardDetails({
                    ...cardDetails,
                    number: e.target.value.replace(/\s/g, "").slice(0, 16),
                  })
                }
              />
              {formErrors.cardNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                  {formErrors.cardNumber}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-${
                    styles.accent
                  }-500 focus:border-transparent ${
                    formErrors.expiry ? "border-red-300" : "border-gray-300"
                  }`}
                  value={formatExpiry(cardDetails.expiry)}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      expiry: e.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                />
                {formErrors.expiry && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                    {formErrors.expiry}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-${
                    styles.accent
                  }-500 focus:border-transparent ${
                    formErrors.cvv ? "border-red-300" : "border-gray-300"
                  }`}
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                />
                {formErrors.cvv && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                    {formErrors.cvv}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-${
                  styles.accent
                }-500 focus:border-transparent ${
                  formErrors.cardName ? "border-red-300" : "border-gray-300"
                }`}
                value={cardDetails.name}
                onChange={(e) =>
                  setCardDetails({
                    ...cardDetails,
                    name: e.target.value,
                  })
                }
              />
              {formErrors.cardName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                  {formErrors.cardName}
                </p>
              )}
            </div>
          </div>
        );

      case "upi":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                placeholder="yourname@upi"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-${
                  styles.accent
                }-500 focus:border-transparent ${
                  formErrors.upi ? "border-red-300" : "border-gray-300"
                }`}
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
              {formErrors.upi && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                  {formErrors.upi}
                </p>
              )}
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700">
                You'll be redirected to your UPI app to complete the payment.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-700">
              You'll be redirected to complete your payment securely.
            </p>
          </div>
        );
    }
  };

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case "processing":
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Payment
              </h3>
              <p className="text-gray-600">
                Please wait while we process your payment...
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-4">Welcome to {plan.name} Plan</p>
              <div className="animate-pulse text-purple-600 font-semibold">
                Redirecting...
              </div>
            </div>
          </div>
        );

      case "failed":
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center">
              <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600 mb-4">
                {formErrors.payment || "Please try again"}
              </p>
              <button
                onClick={() => setPaymentStatus(null)}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your subscription details...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XMarkIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Plan not found
          </h3>
          <p className="text-gray-500">The selected plan is not available.</p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const styles = getPlanStyles();
  const finalPrice = calculateFinalPrice();

  // Get text color classes
  const getTextColor = () => {
    switch (styles.accent) {
      case "gray":
        return "text-gray-600";
      case "amber":
        return "text-amber-600";
      case "purple":
        return "text-purple-600";
      default:
        return "text-purple-600";
    }
  };

  // Get background color classes
  const getBgColor = () => {
    switch (styles.accent) {
      case "gray":
        return "bg-gray-100";
      case "amber":
        return "bg-amber-100";
      case "purple":
        return "bg-purple-100";
      default:
        return "bg-purple-100";
    }
  };

  // Payment method selection helper functions
  const getPaymentMethodBorder = (methodId) => {
    const isSelected = selectedPayment === methodId;
    if (!isSelected) return "border-gray-200 hover:border-gray-300";

    switch (styles.accent) {
      case "gray":
        return "border-gray-500 bg-gray-50";
      case "amber":
        return "border-amber-500 bg-amber-50";
      case "purple":
        return "border-purple-500 bg-purple-50";
      default:
        return "border-purple-500 bg-purple-50";
    }
  };

  const getPaymentMethodIconBg = (methodId) => {
    const isSelected = selectedPayment === methodId;
    if (!isSelected) return "bg-gray-100";

    switch (styles.accent) {
      case "gray":
        return "bg-gray-500";
      case "amber":
        return "bg-amber-500";
      case "purple":
        return "bg-purple-500";
      default:
        return "bg-purple-500";
    }
  };

  const getPaymentMethodIconColor = (methodId) => {
    const isSelected = selectedPayment === methodId;
    return isSelected ? "text-white" : "text-gray-600";
  };

  const getPaymentMethodRadio = (methodId) => {
    const isSelected = selectedPayment === methodId;
    if (!isSelected) return "border-gray-300";

    switch (styles.accent) {
      case "gray":
        return "border-gray-500 bg-gray-500";
      case "amber":
        return "border-amber-500 bg-amber-500";
      case "purple":
        return "border-purple-500 bg-purple-500";
      default:
        return "border-purple-500 bg-purple-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className={`bg-gradient-to-r ${styles.headerGradient} text-white`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
              <span>Back to Plans</span>
            </button>
            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Complete Your {plan.name} Subscription
              </h1>
              <p className="text-lg opacity-90">
                {plan.description} • {styles.level} Level
              </p>
            </div>
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid xl:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div
            className={`xl:col-span-1 bg-gradient-to-br ${styles.gradient} rounded-3xl p-8 shadow-xl border`}
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${getBgColor()} flex items-center justify-center`}
                  >
                    <styles.icon className={`w-6 h-6 ${getTextColor()}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {plan.name} Plan
                    </h2>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                </div>

                {/* Launch Offer Banner */}
                <div className="mb-4 p-3 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 opacity-75 animate-pulse"></div>
                  <div className="relative z-10 text-center">
                    <h3 className="text-white font-bold text-base md:text-lg mb-1 animate-bounce">
                      🎉 Premium special Offer 🎉
                    </h3>
                    <p className="text-white">For Quality Matches</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex flex-col items-start space-y-2 mb-4">
                  <span className={`text-2xl font-bold text-gray-600`}>
                    {`₹${plan.price.replace(/,/g, "")}/Per 3 Months + Tax`}
                  </span>
                </div>

                {plan.savings && (
                  <div
                    className={`inline-block ${getBgColor()} ${getTextColor()} px-3 py-1 rounded-full text-sm font-semibold`}
                  >
                    {plan.savings}
                  </div>
                )}
              </div>

              {/* Quick Stats - UPDATED: Side by side arrangement */}
<div className="flex flex-col items-end space-y-2">
  <div className="flex items-center space-x-3">
    <div className="flex items-center space-x-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-xs font-semibold text-green-700">Active</span>
    </div>
    <div className="flex items-center space-x-1.5 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
      <ClockIcon className="w-3.5 h-3.5 text-blue-500" />
      <span className="text-xs font-semibold text-blue-700">Instant Activation</span>
    </div>
  </div>
</div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {plan.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg"
                >
                  <CheckBadgeIcon
                    className={`w-5 h-5 ${getTextColor()} flex-shrink-0`}
                  />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* WHY CHOOSE SECTION - Added here */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 text-lg mb-4 flex items-center">
                <InformationCircleIcon className={`w-5 h-5 mr-2 ${
                  plan.name === 'Silver' ? 'text-gray-500' : 
                  plan.name === 'Gold' ? 'text-amber-500' : 'text-purple-500'
                }`} />
                Why Choose {plan.name}?
              </h4>
              
              {plan.name === 'Silver' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center bg-white/70 p-3 rounded-lg shadow-sm">
                    <BoltIcon className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Faster Responses</span>
                  </div>
                  <div className="flex items-center bg-white/70 p-3 rounded-lg shadow-sm">
                    <EyeIcon className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Better Profile Visibility</span>
                  </div>
                  <div className="flex items-center bg-white/70 p-3 rounded-lg shadow-sm">
                    <HeartIcon className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Connect with Serious Families</span>
                  </div>
                  <div className="flex items-center bg-white/70 p-3 rounded-lg shadow-sm">
                    <ShieldCheckIcon className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Safe & Verified Platform</span>
                  </div>
                </div>
              )}

              {plan.name === 'Gold' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center bg-white/70 p-3 rounded-lg shadow-sm border-l-4 border-amber-400">
                    <BoltIcon className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Faster Match Responses</span>
                  </div>
                  <div className="flex items-center bg-white/70 p-3 rounded-lg shadow-sm border-l-4 border-amber-400">
                    <UserGroupIcon className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Connect with Verified & Premium Profiles</span>
                  </div>
                  <div className="flex items-center bg-white/70 p-3 rounded-lg shadow-sm border-l-4 border-amber-400">
                    <EyeIcon className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Higher Visibility – More Proposals</span>
                  </div>
                  <div className="flex items-center bg-white/70 p-3 rounded-lg shadow-sm border-l-4 border-amber-400">
                    <LockClosedIcon className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Trusted & Secure Communication</span>
                  </div>
                  <div className="flex items-center bg-white/70 p-3 rounded-lg shadow-sm border-l-4 border-amber-400">
                    <HeartIcon className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Serious Families Only</span>
                  </div>
                </div>
              )}

              {plan.name === 'Diamond' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-start bg-white/70 p-3 rounded-lg shadow-sm border-l-4 border-purple-400">
                      <span className="text-purple-500 mr-2">🔹</span>
                      <span className="text-sm text-gray-700"><span className="font-medium">Maximum Visibility</span> – Be Seen First</span>
                    </div>
                    <div className="flex items-start bg-white/70 p-3 rounded-lg shadow-sm border-l-4 border-purple-400">
                      <span className="text-purple-500 mr-2">🔹</span>
                      <span className="text-sm text-gray-700"><span className="font-medium">Connect with Verified Premium Families</span></span>
                    </div>
                    <div className="flex items-start bg-white/70 p-3 rounded-lg shadow-sm border-l-4 border-purple-400">
                      <span className="text-purple-500 mr-2">🔹</span>
                      <span className="text-sm text-gray-700"><span className="font-medium">Faster Match Finalization</span></span>
                    </div>
                    <div className="flex items-start bg-white/70 p-3 rounded-lg shadow-sm border-l-4 border-purple-400">
                      <span className="text-purple-500 mr-2">🔹</span>
                      <span className="text-sm text-gray-700"><span className="font-medium">Personalized Assistance</span></span>
                    </div>
                    <div className="flex items-start bg-white/70 p-3 rounded-lg shadow-sm border-l-4 border-purple-400">
                      <span className="text-purple-500 mr-2">🔹</span>
                      <span className="text-sm text-gray-700"><span className="font-medium">100% Secure & Confidential Process</span></span>
                    </div>
                  </div>
                  
                  {/* Perfect For section for Diamond */}
                  <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl">
                    <h5 className="font-semibold text-purple-700 mb-3 flex items-center">
                      <BriefcaseIcon className="w-4 h-4 mr-2" />
                      Perfect For:
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center bg-white p-2 rounded-lg text-xs">
                        <AcademicCapIcon className="w-3 h-3 text-purple-500 mr-1" />
                        <span>Doctors, Engineers, IT Professionals</span>
                      </div>
                      <div className="flex items-center bg-white p-2 rounded-lg text-xs">
                        <BuildingOfficeIcon className="w-3 h-3 text-purple-500 mr-1" />
                        <span>Business Owners & Entrepreneurs</span>
                      </div>
                      <div className="flex items-center bg-white p-2 rounded-lg text-xs">
                        <UserGroupIcon className="w-3 h-3 text-purple-500 mr-1" />
                        <span>High-Profile Families</span>
                      </div>
                      <div className="flex items-center bg-white p-2 rounded-lg text-xs">
                        <GlobeAltIcon className="w-3 h-3 text-purple-500 mr-1" />
                        <span>NRI & International Alliances</span>
                      </div>
                    </div>
                  </div>

                  {/* Diamond Advantage Badge */}
                  <div className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-3 text-white text-xs">
                    <div className="flex items-center">
                      <TrophyIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span><span className="font-bold">Diamond Advantage:</span> Elite Connections Begin with Premium Access. Upgrade Your Search. Upgrade Your Future.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Security Features */}
            <div className="border-t pt-6 mt-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                Security & Trust
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                  >
                    <feature.icon className="w-4 h-4 text-green-500" />
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Complete Payment
            </h3>

            {/* Coupon Section */}
            <div className="mb-6">
                {!showCouponInput ? (
                  <button
                    onClick={() => setShowCouponInput(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Apply Coupon Code
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Apply
                      </button>
                    </div>
                    {formErrors.coupon && (
                      <p className="text-red-500 text-sm">
                        {formErrors.coupon}
                      </p>
                    )}
                    {discount > 0 && (
                      <p className="text-green-600 text-sm">
                        Discount applied: ₹{discount.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Payment Method
              </label>
              <div className="grid gap-3">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  const isSelected = selectedPayment === method.id;

                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`flex items-center space-x-4 p-4 border-2 rounded-xl text-left transition-all ${getPaymentMethodBorder(
                        method.id
                      )}`}
                    >
                      <div
                        className={`p-2 rounded-lg ${getPaymentMethodIconBg(
                          method.id
                        )}`}
                      >
                        <IconComponent
                          className={`w-5 h-5 ${getPaymentMethodIconColor(
                            method.id
                          )}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {method.name}
                          </span>
                          {method.popular && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {method.description}
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${getPaymentMethodRadio(
                          method.id
                        )}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Form */}
            <div className="mb-6">{renderPaymentForm()}</div>

            {/* Terms */}
            <div className="mb-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-700">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-700">
                    Privacy Policy
                  </a>
                  . I understand that my subscription will auto-renew unless
                  cancelled before the renewal date.
                </label>
              </div>
              {formErrors.terms && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                  {formErrors.terms}
                </p>
              )}
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Plan Price:</span>
                  <span className="font-semibold text-gray-600">₹{plan.price}/Per 3 Months + Tax</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                  <div className="flex justify-between items-center">
                    {/*<span className="text-green-700 font-semibold">Launch Offer:</span>
                    <span className="text-green-600 font-bold text-lg">FREE</span>*/}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">
                    Total Amount:
                  </span>
                </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleRazorpayPayment}
              disabled={processing || !agreedToTerms || paymentStatus === "success"}
              className={`w-full py-4 bg-gradient-to-r ${
                getCTAButtonStyles().gradient
              } ${getCTAButtonStyles().hoverGradient} ${
                getCTAButtonStyles().text
              } rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {processing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </div>
              ) : paymentStatus === "success" ? (
                <span className="flex items-center justify-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Payment Successful!</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4" />
                  <BoltIcon className="w-4 h-4" />
                </span>
              )}
            </button>

            {/* Security Guarantee */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <ShieldCheckIcon className="w-4 h-4" />
                <span className="text-sm">100% Secure Payment · Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why {plan.name} Plan is Perfect for You
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full ${getBgColor()} flex items-center justify-center mx-auto mb-4`}
              >
                <HeartIcon className={`w-8 h-8 ${getTextColor()}`} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Better Matches
              </h4>
              <p className="text-gray-600 text-sm">
                {plan.name === "Silver" &&
                  "Start connecting with basic matching features"}
                {plan.name === "Gold" &&
                  "Get priority access to quality profiles"}
                {plan.name === "Diamond" &&
                  "Personalized matchmaking with expert assistance"}
              </p>
            </div>
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full ${getBgColor()} flex items-center justify-center mx-auto mb-4`}
              >
                <ChatBubbleLeftRightIcon
                  className={`w-8 h-8 ${getTextColor()}`}
                />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Enhanced Communication
              </h4>
              <p className="text-gray-600 text-sm">
                {plan.name === "Silver" &&
                  "Limited monthly interests to start conversations"}
                {plan.name === "Gold" &&
                  "Unlimited messaging and advanced communication"}
                {plan.name === "Diamond" &&
                  "Premium communication with read receipts"}
              </p>
            </div>
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full ${getBgColor()} flex items-center justify-center mx-auto mb-4`}
              >
                <ShieldCheckIcon className={`w-8 h-8 ${getTextColor()}`} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Trust & Safety
              </h4>
              <p className="text-gray-600 text-sm">
                {plan.name === "Silver" &&
                  "Basic profile verification available"}
                {plan.name === "Gold" &&
                  "Enhanced verification and dedicated support"}
                {plan.name === "Diamond" &&
                  "Premium background verification & 24/7 support"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Modal */}
      {renderPaymentStatus()}
    </div>
  );
}