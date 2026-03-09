import React, { useState, useEffect, useRef } from "react";
import { PhoneIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { UserPlusIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function FloatingActions({
  whatsappNumber = "+91 9940200736",
  phoneNumber = "+91 9940200736",
  youtubeUrl = "https://youtube.com",
  facebookUrl = "https://www.facebook.com/profile.php?id=61584991709336",
  twitterUrl = "https://x.com/Eliteinova",
  instagramUrl = "https://www.instagram.com/eliteinovamatrimony2.0/",
  linkedinUrl = "https://www.linkedin.com/in/eliteinova-matrimony-171ab5393?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BGGmn1Tb7RbS%2BCuSgsksVEA%3D%3D",
  onRegister,
  onLogin,
  isAuthenticated = false,
}) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  const waHref = `https://wa.me/${(whatsappNumber || "").replace(/\D/g, "")}`;

  const btnBase = `
    w-12 h-12 md:w-14 md:h-14
    rounded-full shadow-lg
    flex items-center justify-center
    transition-all duration-200 hover:scale-110
  `;
  const iconClass = "w-5 h-5 md:w-7 md:h-7";
  const labelClass = "text-[8px] md:text-[10px] leading-tight font-semibold";

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        socialOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setSocialOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [socialOpen]);

  const YouTubeIcon = () => (
    <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );

  const socialLinks = [
    {
      label: "YouTube",
      href: youtubeUrl,
      bg: "bg-[#FF0000] hover:bg-[#cc0000]",
      icon: <YouTubeIcon />,
    },
    {
      label: "Facebook",
      href: facebookUrl,
      bg: "bg-[#1877F2] hover:bg-[#1565d8]",
      icon: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: "X (Twitter)",
      href: twitterUrl,
      bg: "bg-black hover:bg-gray-800",
      icon: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: instagramUrl,
      bg: "bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90",
      icon: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: linkedinUrl,
      bg: "bg-[#0A66C2] hover:bg-[#0854a0]",
      icon: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @keyframes panel-in {
          0%   { opacity: 0; transform: scale(0.85) translateX(16px); }
          70%  { transform: scale(1.02) translateX(-2px); }
          100% { opacity: 1; transform: scale(1) translateX(0); }
        }
        @keyframes icon-pop {
          0%   { opacity: 0; transform: scale(0.5); }
          70%  { transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
        .panel-animate {
          animation: panel-in 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards;
          transform-origin: bottom right;
        }
        .icon-pop {
          animation: icon-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .social-box { width: 210px; }
        @media (min-width: 768px) { .social-box { width: 290px; } }
      `}</style>

      <div className="fixed right-3 md:right-6 bottom-4 md:bottom-8 z-50 flex flex-col items-center gap-2 md:gap-3">

        {/* Register */}
        {onRegister && !isAuthenticated && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRegister(); }}
            aria-label="Register"
            className={`${btnBase} bg-gradient-to-r from-red-500 to-red-600 text-white flex-col gap-0.5 animate-bounce`}
          >
            <UserPlusIcon className={iconClass} />
            <span className={labelClass}>Reg</span>
          </button>
        )}

        {/* Login */}
        {onLogin && !isAuthenticated && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLogin(); }}
            aria-label="Login"
            className={`${btnBase} bg-gradient-to-r from-green-500 to-green-600 text-white flex-col gap-0.5 animate-bounce`}
          >
            <ArrowRightOnRectangleIcon className={iconClass} />
            <span className={labelClass}>Login</span>
          </button>
        )}

        {/* WhatsApp */}
        {isAuthenticated && (
          <a href={waHref} target="_blank" rel="noopener noreferrer"
            className={`${btnBase} bg-green-500 hover:bg-green-600 text-white`}>
            <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.52 3.48A11.89 11.89 0 0012 0C5.37 0 .05 5.32.05 11.95c0 2.1.55 4.15 1.6 5.95L0 24l6.3-1.62c1.7.93 3.6 1.42 5.7 1.42h.02c6.63 0 12-5.32 12-11.95 0-3.19-1.25-6.19-3.5-8.17zM12 21.9c-1.7 0-3.34-.46-4.76-1.32l-.34-.2-3.74.96.97-3.64-.22-.36A8.29 8.29 0 013 11.95c0-4.6 4.07-8.33 9-8.33 2.4 0 4.66.93 6.36 2.62A8.25 8.25 0 0120.25 12c0 4.6-4.07 8.33-8.25 8.33z"/>
              <path d="M17.5 14.8c-.3-.15-1.82-.9-2.1-1-.27-.1-.5-.15-.71.15-.21.3-.81 1-.99 1.2-.18.21-.36.24-.67.08-.31-.16-1.32-.49-2.5-1.53-.93-.83-1.56-1.86-1.74-2.17-.18-.3-.02-.46.13-.61.13-.12.31-.31.47-.47.16-.16.21-.27.31-.45.1-.18.04-.33-.02-.47-.06-.14-.7-1.68-.96-2.31-.25-.61-.51-.53-.71-.53-.18 0-.39-.02-.6-.02-.21 0-.54.08-.82.39-.27.31-1.05 1.02-1.05 2.48 0 1.45 1.09 2.86 1.25 3.06.16.21 2.16 3.3 5.23 4.63 3.13 1.36 3.13.91 3.69.85.56-.05 1.82-.74 2.08-1.45.27-.71.27-1.32.19-1.45-.07-.13-.27-.2-.57-.35z"/>
            </svg>
          </a>
        )}

        {/* Phone */}
        {isAuthenticated && (
          <a href={`tel:${phoneNumber}`}
            className={`${btnBase} bg-green-600 hover:bg-green-700 text-white`}>
            <PhoneIcon className={iconClass} />
          </a>
        )}

        {/* YouTube standalone */}
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className={`${btnBase} bg-[#FF0000] hover:bg-[#cc0000] text-white`}
          title="Watch on YouTube"
        >
          <YouTubeIcon />
        </a>

        {/* Social Media Toggle + Floating Box Panel */}
        <div className="relative flex flex-col items-center">

          {socialOpen && (
            <div
              ref={panelRef}
              className="panel-animate social-box absolute bottom-0 right-16 md:right-[4.5rem]
                         bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 md:p-5"
            >
              {/* Arrow pointer pointing right */}
              <div className="absolute right-[-8px] bottom-4 w-0 h-0
                              border-t-[8px] border-t-transparent
                              border-b-[8px] border-b-transparent
                              border-l-[8px] border-l-white" />

              <p className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center mb-3 md:mb-4">
                Follow Us
              </p>

              {/* 3-column grid of round icons with labels */}
              <div className="grid grid-cols-3 gap-3 md:gap-5 justify-items-center">
                {socialLinks.map((s, i) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="icon-pop flex flex-col items-center gap-1 md:gap-1.5 group"
                    style={{ animationDelay: `${i * 0.05}s` }}
                    onClick={() => setSocialOpen(false)}
                  >
                    <span className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white
                                transition-all duration-150 group-hover:scale-110 group-hover:shadow-md ${s.bg}`}>
                      {s.icon}
                    </span>
                    <span className="text-[9px] md:text-[11px] font-semibold text-gray-600 text-center leading-tight">
                      {s.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Toggle button */}
          <button
            ref={toggleRef}
            onClick={() => setSocialOpen((p) => !p)}
            aria-label="Social Media"
            title="Social Media"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex flex-col items-center justify-center gap-0.5 text-white transition-all duration-200 hover:scale-110"
            style={{
              background: socialOpen
                ? "linear-gradient(135deg,#7c3aed,#ec4899)"
                : "linear-gradient(135deg,#6366f1,#8b5cf6)",
            }}
          >
            {socialOpen ? (
              <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <>
                <span className="text-[8px] md:text-[10px] font-bold leading-none">Social</span>
                <span className="text-[8px] md:text-[10px] font-bold leading-none">Media</span>
              </>
            )}
          </button>
        </div>

        {/* Scroll to Top */}
        {showScrollTop && (
          <button onClick={scrollToTop} aria-label="Scroll to top"
            className={`${btnBase} bg-gray-700 hover:bg-gray-800 text-white mt-1`}>
            <ChevronUpIcon className={iconClass} />
          </button>
        )}

      </div>
    </>
  );
}