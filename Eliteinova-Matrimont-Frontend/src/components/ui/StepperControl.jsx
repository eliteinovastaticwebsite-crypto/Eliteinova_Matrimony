// src/components/ui/StepperControl.jsx
import React from "react";

export default function StepperController({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSubmit,
  loading = false,
  validationErrors = {},
}) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div
      className={`flex justify-between items-center gap-4 pt-6 mt-6 border-t border-gray-200 
              ${currentStep === 1 ? "w-full sm:w-[370px]" : "w-full"}`}
    >
      {/* Back Button - Fixed with proper text color */}
      <div className="flex-1">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrev}
            disabled={loading}
            className="w-full min-w-[120px] px-6 py-3 font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <span className="flex items-center justify-center text-gray-800">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </span>
          </button>
        )}
      </div>

      {/* Next/Submit Button */}
      <div className="flex-1">
        <button
          type={isLastStep ? "submit" : "button"}
          onClick={isLastStep ? onSubmit : onNext}
          disabled={loading}
          className="w-full min-w-[120px] px-6 py-3 font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isLastStep ? "Submitting..." : "Loading..."}
            </span>
          ) : isLastStep ? (
            <span className="flex items-center justify-center">
              Submit
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
          ) : (
            <span className="flex items-center justify-center">
              Next
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

