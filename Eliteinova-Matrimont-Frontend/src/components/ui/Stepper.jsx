import React from "react";

export default function Stepper({ steps, currentStep, stepOffset = 1 }) {
  return (
    <div className="w-full mb-8">
      {/* Stepper grid container */}
      <div
        className="relative grid items-center"
        style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
      >
        {/* Gray base line (background) */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-300 z-0" />

        {/* Red progress line */}
        <div
          className="absolute top-5 left-0 h-1 bg-red-600 z-0 transition-all duration-300 ease-in-out"
          style={{
            width: `${((currentStep - stepOffset) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Step circles and labels */}
        {steps.map((label, index) => {
          const stepNumber = index + stepOffset;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center relative z-10"
            >
              {/* Step circle */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors duration-300
                  ${
                    isActive
                      ? "bg-red-600 text-white shadow-md"
                      : isCompleted
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }
                `}
              >
                {stepNumber}
              </div>

              {/* Step label */}
              <span
                className={`mt-2 text-center text-sm font-medium transition-colors duration-300 px-1
                  ${
                    isActive
                      ? "text-red-600 font-semibold"
                      : isCompleted
                      ? "text-red-500"
                      : "text-gray-500"
                  }
                `}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
