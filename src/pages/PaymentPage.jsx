// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CreditCardIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import api from "../api/axiosUser";

const membershipPrices = {
  SILVER: 1000,
  GOLD: 2000,
  DIAMOND: 3000,
};

const membershipNames = {
  SILVER: "Silver",
  GOLD: "Gold",
  DIAMOND: "Diamond",
};

const paymentMethods = [
  {
    id: "CARD",
    name: "Credit/Debit Card",
    icon: CreditCardIcon,
    description: "Pay securely with your card",
  },
  {
    id: "UPI",
    name: "UPI",
    icon: DevicePhoneMobileIcon,
    description: "Instant UPI payment",
  },
  {
    id: "NETBANKING",
    name: "Net Banking",
    icon: BuildingLibraryIcon,
    description: "All major banks supported",
  },
];

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const membershipType = searchParams.get("membershipType") || "SILVER";

  const [selectedPayment, setSelectedPayment] = useState("CARD");
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Payment form state
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const price = membershipPrices[membershipType] || 1000;
  const membershipName = membershipNames[membershipType] || "Silver";

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setFormErrors({});
    setPaymentStatus(null);

    try {
      // Validate payment details
      if (selectedPayment === "CARD") {
        if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
          setFormErrors({ payment: "Please fill all card details" });
          setProcessing(false);
          return;
        }
        if (!cardDetails.number.match(/^\d{16}$/)) {
          setFormErrors({ payment: "Invalid card number (must be 16 digits)" });
          setProcessing(false);
          return;
        }
        if (!cardDetails.cvv.match(/^\d{3}$/)) {
          setFormErrors({ payment: "Invalid CVV (must be 3 digits)" });
          setProcessing(false);
          return;
        }
      } else if (selectedPayment === "UPI") {
        if (!upiId || !upiId.match(/[a-zA-Z0-9.]+@[a-zA-Z]+/)) {
          setFormErrors({ payment: "Invalid UPI ID format" });
          setProcessing(false);
          return;
        }
      }

      // Prepare payment details
      const paymentDetails = {
        paymentMethod: selectedPayment,
        amount: price,
        ...(selectedPayment === "CARD" && {
          cardNumber: cardDetails.number,
          expiryDate: cardDetails.expiry,
          cvv: cardDetails.cvv,
          cardName: cardDetails.name,
        }),
        ...(selectedPayment === "UPI" && { upiId }),
      };

      // Process payment - send membershipType to backend, it will find the plan
      const response = await api.post("/api/payments/process", {
        membershipType: membershipType,
        paymentDetails: {
          paymentMethod: selectedPayment,
          ...(selectedPayment === "CARD" && {
            cardNumber: cardDetails.number,
            expiryDate: cardDetails.expiry,
            cvv: cardDetails.cvv,
          }),
          ...(selectedPayment === "UPI" && { upiId }),
        },
      });

      if (response.data.success) {
        setPaymentStatus("success");
        setTimeout(() => {
          navigate("/profiles");
        }, 2000);
      } else {
        setPaymentStatus("failed");
        setFormErrors({ payment: response.data.message || "Payment failed" });
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
      setFormErrors({
        payment: error.response?.data?.message || "Payment processing failed. Please try again.",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getPlanIdByMembershipType = async (type) => {
    try {
      const response = await api.get("/api/plans");
      const plans = response.data?.data || response.data || [];
      const plan = plans.find((p) => p.name && p.name.toUpperCase() === type.toUpperCase());
      console.log("🔍 Found plan for", type, ":", plan);
      return plan?.id || null;
    } catch (error) {
      console.error("Error fetching plans:", error);
      // Fallback: Create plan IDs based on membership type
      const planIdMap = {
        SILVER: 1,
        GOLD: 2,
        DIAMOND: 3,
      };
      return planIdMap[type.toUpperCase()] || null;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Complete Your {membershipName} Membership
          </h1>
          <p className="text-gray-600">
            You chose {membershipName} membership. Complete payment to activate your account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{membershipName} Membership</span>
                  <span className="font-semibold">₹{price}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-red-600">₹{price}</span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <LockClosedIcon className="w-5 h-5 text-green-500" />
                  <span>256-bit SSL Encryption</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>

              {/* Payment Methods */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          selectedPayment === method.id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <div className="text-sm font-medium text-gray-900">{method.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{method.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Form Fields */}
              <form onSubmit={handlePayment}>
                {selectedPayment === "CARD" && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        maxLength="16"
                        value={cardDetails.number}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, "") })
                        }
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) =>
                            setCardDetails({ ...cardDetails, expiry: e.target.value })
                          }
                          placeholder="MM/YY"
                          maxLength="5"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          maxLength="3"
                          value={cardDetails.cvv}
                          onChange={(e) =>
                            setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })
                          }
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardDetails.name}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, name: e.target.value })
                        }
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {selectedPayment === "UPI" && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@paytm"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                )}

                {selectedPayment === "NETBANKING" && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      You will be redirected to your bank's secure payment page after clicking "Pay Now".
                    </p>
                  </div>
                )}

                {formErrors.payment && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{formErrors.payment}</p>
                  </div>
                )}

                {paymentStatus === "success" && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    <p className="text-sm text-green-600">
                      Payment successful! Redirecting to profiles...
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={processing || paymentStatus === "success"}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? "Processing..." : paymentStatus === "success" ? "Payment Successful!" : `Pay ₹${price}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

