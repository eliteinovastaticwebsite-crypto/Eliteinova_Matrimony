import React from "react";

export default function Input({ label, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <input
        className={`w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${className}`}
        {...props}
      />
    </div>
  );
}