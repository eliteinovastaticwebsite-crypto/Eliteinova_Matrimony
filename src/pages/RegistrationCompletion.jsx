// src/pages/RegistrationCompletion.jsx
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function RegistrationCompletion() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const membershipType = searchParams.get("membershipType") || "SILVER";

  const handleGoToDashboard = () => {
    navigate(`/dashboard`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Registration Completed!
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Your registration has been completed successfully. Your account is now active!
          </p>

          {/* Membership Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-2">Selected Membership</p>
            <p className="text-2xl font-bold text-red-600 capitalize">
              {membershipType === "SILVER" ? "Silver" : membershipType === "GOLD" ? "Gold" : "Diamond"} Membership
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleGoToDashboard}
            className="w-full md:w-auto bg-gradient-to-r from-red-600 to-red-500 text-white py-4 px-8 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Go to Dashboard
          </button>

          {/* Additional Info */}
          <p className="text-sm text-gray-500 mt-6">
            Start exploring profiles and find your perfect match!
          </p>
        </div>
      </div>
    </div>
  );
}

