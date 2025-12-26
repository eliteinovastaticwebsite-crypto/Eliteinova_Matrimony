// src/components/ui/FloatingInput.jsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // ✅ imported in JS, not CSS file

const FloatingInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  select = false,
  textarea = false,
  error = "",
  disabled = false,
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "block px-3 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 peer transition-colors duration-200";
  const normalClasses = `${baseClasses} ${
    error
      ? "border-red-500 focus:border-red-600"
      : "border-gray-300 focus:border-red-600"
  }`;
  const disabledClasses = `${baseClasses} border-gray-200 bg-gray-100 cursor-not-allowed text-gray-500`;

  const inputClasses = disabled ? disabledClasses : normalClasses;

  return (
    <div className={`relative z-0 ${className}`}>
      {/* ✅ Modern Date Picker */}
      {type === "date" ? (
        <DatePicker
          id={name}
          selected={value ? new Date(value) : null}
          onChange={(date) =>
            onChange({ target: { name, value: date?.toISOString().split("T")[0] } })
          }
          dateFormat="dd/MM/yyyy"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          placeholderText="Select date"
          disabled={disabled}
          className={`${inputClasses} bg-white`}
          {...props}
        />
      ) : select ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={inputClasses}
          {...props}
        >
          {children}
        </select>
      ) : textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          rows={4}
          className={`${inputClasses} resize-none`}
          {...props}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
      )}

      <label
        htmlFor={name}
        className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 
        peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
        peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 
        transition-all duration-200 ${
          error
            ? "text-red-500 peer-focus:text-red-600"
            : "text-gray-500 peer-focus:text-red-600"
        } ${disabled ? "text-gray-400 bg-gray-100" : "bg-white"}`}
      >
        {label} {required && "*"}
      </label>

      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center">
          <svg
            className="w-3 h-3 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default FloatingInput;
