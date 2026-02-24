// src/components/ui/FloatingInput.jsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  placeholder,
  onFocus: propsOnFocus,
  onBlur: propsOnBlur,
  rows = 4,
  ...props
}) => {
  const baseInputClasses = `
    w-full px-4 py-3 text-sm text-gray-800
    border-2 rounded-xl outline-none transition-all duration-200
    bg-white placeholder:text-gray-400
    ${error
      ? "border-red-400 focus:border-red-500"
      : "border-gray-300 focus:border-red-500"
    }
    ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""}
  `;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Label above the input */}
      {label && (
        <label
          htmlFor={name}
          className={`text-sm font-semibold ${error ? "text-red-500" : "text-gray-700"}`}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Input / Select / Textarea / DatePicker */}
      {type === "date" ? (
        <DatePicker
          id={name}
          selected={value ? new Date(value) : null}
          onChange={(date) =>
            onChange({
              target: {
                name,
                value: date?.toISOString().split("T")[0],
              },
            })
          }
          dateFormat="dd/MM/yyyy"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          placeholderText={placeholder || "Select date"}
          disabled={disabled}
          className={baseInputClasses}
          {...props}
        />
      ) : select ? (
        <div className="relative">
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`${baseInputClasses} appearance-none pr-10 cursor-pointer`}
            {...props}
          >
            {children}
          </select>
          {/* Dropdown arrow */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      ) : textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={propsOnFocus}
          onBlur={propsOnBlur}
          required={required}
          disabled={disabled}
          rows={rows}
          placeholder={placeholder || `Enter ${label?.toLowerCase() || ""}`}
          className={`${baseInputClasses} resize-none`}
          {...props}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={propsOnFocus}
          onBlur={propsOnBlur}
          required={required}
          disabled={disabled}
          placeholder={placeholder || `Enter ${label?.toLowerCase() || ""}`}
          className={baseInputClasses}
          {...props}
        />
      )}

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
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