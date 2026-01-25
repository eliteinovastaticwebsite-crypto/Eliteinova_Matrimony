import React from "react";
import { PhoneIcon } from "@heroicons/react/24/solid";
import { UserPlusIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

/**
 * Props:
 *  - whatsappNumber: string (E.164 or digits, e.g. "919876543210")
 *  - phoneNumber: string (tel link)
 *  - playStoreUrl: string (link to Play store)
 *  - appStoreUrl: string (link to App Store)
 *  - onRegister: function (callback to open register modal)
 *  - onLogin: function (callback to open login modal)
 *  - isAuthenticated: boolean (whether user is logged in)
 */

export default function FloatingActions({
  whatsappNumber = "+91 7845554882",
  phoneNumber = "+91 7845554882",
  onRegister,
  onLogin,
  isAuthenticated = false,
//   playStoreUrl = "#",
//   appStoreUrl = "#",
}) {
  const waHref = `https://wa.me/${(whatsappNumber || "").replace(/\D/g, "")}`;

  const btnBase =
    "w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105";

  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col items-center gap-3">
      {/* App Store */}
      {/* <a
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="App Store"
        className={`${btnBase} bg-gradient-to-br from-gray-800 to-black text-white`}
        title="Download on the App Store"
      > */}
        {/* Apple SVG */}
        {/* <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M16.365 1.43c-.997.042-2.18.672-2.885 1.447-.63.69-1.174 1.89-.973 2.997 1.058.084 2.26-.56 2.93-1.313.66-.74 1.17-1.905.928-3.131zM20.99 8.83c-.27-.67-1.16-2.01-2.54-2.49-.9-.31-2.1-.06-3.76.83-1.2.68-2.097 1.02-3.12 1.02-.98 0-1.94-.36-3.2-1.03-1.2-.65-2.5-.01-3.41.53-1.86.99-3.94 3.43-3.94 6.96 0 2.2.75 4.28 2.12 5.73.98 1.04 2.14 1.97 3.46 1.93 1.2-.04 1.69-.74 3.17-.74 1.49 0 1.95.74 3.2.72 1.3-.02 2.12-1.03 3.09-2.08 1.04-1.14 1.46-2.25 1.49-2.31-.03-.01-2.9-1.1-2.85-4.31.04-2.93 2.57-4.03 2.62-4.05z" />
        </svg>
      </a> */}

      {/* Play Store */}
      {/* <a
        href={playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Google Play"
        className={`${btnBase} bg-gradient-to-br from-green-500 to-green-700 text-white`}
        title="Get it on Google Play"
      > */}
        {/* Play Store triangle */}
        {/* <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M3.6 2.3L17 11.99 3.6 21.7c-.8.5-1.6-.1-1.6-.9V3.2c0-.8.8-1.4 1.6-1zM20.1 6.1c.6-.4.6-1.4 0-1.8l-3.1-2.1-5.8 6 5.8 6 3.1-2.1c.6-.4.6-1.4 0-1.8L15 12l5.1-5.9z" />
        </svg>
      </a> */}

      {/* Register Button - Above Login - With Text in Round Circle */}
      {onRegister && !isAuthenticated && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRegister();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label="Register"
          className={`${btnBase} bg-gradient-to-r from-yellow-400 to-yellow-500 text-white flex flex-col items-center justify-center gap-0.5`}
          title="Register Now"
        >
          <UserPlusIcon className="w-4 h-4" />
          <span className="text-[9px] leading-tight font-semibold">Reg</span>
        </button>
      )}

      {/* Login Button - Below Register - With Text in Round Circle */}
      {onLogin && !isAuthenticated && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onLogin();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label="Login"
          className={`${btnBase} bg-gradient-to-r from-blue-400 to-blue-500 text-white flex flex-col items-center justify-center gap-0.5`}
          title="Login Now"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          <span className="text-[9px] leading-tight font-semibold">Login</span>
        </button>
      )}

      {/* WhatsApp */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className={`${btnBase} bg-green-600 text-white`}
        title="Chat on WhatsApp"
      >
        {/* WhatsApp SVG */}
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.52 3.48A11.89 11.89 0 0012 0C5.37 0 .05 5.32.05 11.95c0 2.1.55 4.15 1.6 5.95L0 24l6.3-1.62c1.7.93 3.6 1.42 5.7 1.42h.02c6.63 0 12-5.32 12-11.95 0-3.19-1.25-6.19-3.5-8.17zM12 21.9c-1.7 0-3.34-.46-4.76-1.32l-.34-.2-3.74.96.97-3.64-.22-.36A8.29 8.29 0 013 11.95c0-4.6 4.07-8.33 9-8.33 2.4 0 4.66.93 6.36 2.62A8.25 8.25 0 0120.25 12c0 4.6-4.07 8.33-8.25 8.33z" />
          <path d="M17.5 14.8c-.3-.15-1.82-.9-2.1-1-.27-.1-.5-.15-.71.15-.21.3-.81 1-.99 1.2-.18.21-.36.24-.67.08-.31-.16-1.32-.49-2.5-1.53-.93-.83-1.56-1.86-1.74-2.17-.18-.3-.02-.46.13-.61.13-.12.31-.31.47-.47.16-.16.21-.27.31-.45.1-.18.04-.33-.02-.47-.06-.14-.7-1.68-.96-2.31-.25-.61-.51-.53-.71-.53-.18 0-.39-.02-.6-.02-.21 0-.54.08-.82.39-.27.31-1.05 1.02-1.05 2.48 0 1.45 1.09 2.86 1.25 3.06.16.21 2.16 3.3 5.23 4.63 3.13 1.36 3.13.91 3.69.85.56-.05 1.82-.74 2.08-1.45.27-.71.27-1.32.19-1.45-.07-.13-.27-.2-.57-.35z" />
        </svg>
      </a>

      {/* Phone */}
      <a
        href={`tel:${phoneNumber}`}
        aria-label="Call us"
        className={`${btnBase} bg-green-600 text-white`}
        title="Call us"
      >
        <PhoneIcon className="w-6 h-6" />
      </a>
    </div>
  );
}
