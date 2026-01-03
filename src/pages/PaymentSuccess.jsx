// src/pages/PaymentSuccess.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CheckCircleIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import api from "../api/axiosUser";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const transactionId = searchParams.get("transactionId");

  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    if (!transactionId) {
      setError("Transaction ID not found");
      setLoading(false);
      return;
    }

    fetchPaymentDetails();
  }, [transactionId, isAuthenticated, navigate]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/payments/transaction/${transactionId}`);
      
      if (response.data.success) {
        setPaymentData(response.data.data);
      } else {
        setError("Payment details not found");
      }
    } catch (err) {
      console.error("Error fetching payment details:", err);
      setError("Failed to fetch payment details");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!transactionId) return;

    try {
      setDownloading(true);
      const response = await api.get(`/api/payments/receipt/${transactionId}`, {
        responseType: "blob",
      });

      // Create a blob URL and trigger download (PDF format)
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt_${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading receipt:", err);
      alert("Failed to download receipt. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined || amount === '') return "0";
    
    // Convert to number
    let numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    
    // Handle NaN or invalid numbers
    if (isNaN(numAmount)) {
      console.warn('Invalid amount value:', amount);
      return "0";
    }
    
    // Backend stores amounts in rupees, but double-check if it looks like paise
    // If amount is suspiciously large and divisible by 100, it might be in paise
    // Example: 29900 paise = 299 rupees (common plan price)
    if (numAmount >= 10000 && numAmount % 100 === 0) {
      const possibleRupees = numAmount / 100;
      // Check if divided value matches common plan prices (299, 499, 749, 2999, 9999, etc.)
      const commonPrices = [299, 499, 749, 2999, 9999, 29999, 99999];
      if (commonPrices.includes(possibleRupees)) {
        numAmount = possibleRupees;
      }
    }
    
    // Format with Indian locale (adds commas for thousands)
    return Math.round(numAmount).toLocaleString('en-IN');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "Unable to load payment details"}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Your payment has been processed successfully. Your membership is now active.
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Transaction ID</span>
              <span className="text-gray-900 font-mono text-sm">{paymentData.transactionId}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Invoice ID</span>
              <span className="text-gray-900 font-mono text-sm">{paymentData.invoiceId}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Plan</span>
              <span className="text-gray-900 font-semibold">{paymentData.planName}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Payment Method</span>
              <span className="text-gray-900 font-semibold">{paymentData.paymentMethod}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Amount</span>
              <span className="text-2xl font-bold text-red-600">
                ₹{formatAmount(paymentData.amount)}/Per 12 Months
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                {paymentData.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Payment Date</span>
              <span className="text-gray-900">{formatDate(paymentData.completedAt)}</span>
            </div>
            
            {paymentData.userName && (
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Customer Name</span>
                <span className="text-gray-900">{paymentData.userName}</span>
              </div>
            )}
            
            {paymentData.userEmail && (
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Email</span>
                <span className="text-gray-900">{paymentData.userEmail}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDownloadReceipt}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-4 px-6 rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            {downloading ? "Downloading..." : "Download Receipt"}
          </button>
          
          <button
            onClick={() => navigate("/profiles")}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white py-4 px-6 rounded-xl hover:bg-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Profiles
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your receipt has been sent to your email. You can also download it using the button above.
          </p>
        </div>
      </div>
    </div>
  );
}

