import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosUser";

const PaymentProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState({
    hasPayment: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      return;
    }

    const checkPayment = async () => {
      try {
        const response = await api.get("/api/payments/check-payment-status");
        if (response.data.success) {
          setPaymentStatus({
            hasPayment: response.data.hasPayment,
            loading: false,
            error: null,
          });
        } else {
          setPaymentStatus({
            hasPayment: false,
            loading: false,
            error: response.data.message || "Failed to check payment status",
          });
        }
      } catch (error) {
        console.error("Payment check error:", error);
        setPaymentStatus({
          hasPayment: false,
          loading: false,
          error: error.response?.data?.message || "Failed to verify payment",
        });
      }
    };

    checkPayment();
  }, [isAuthenticated, authLoading]);

  // Show loading while checking auth
  if (authLoading || paymentStatus.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment status...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // With free registration, allow access without payment
  // Payment status check is kept for tracking purposes only
  return children;
};

export default PaymentProtectedRoute;

