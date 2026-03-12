// src/components/profiles/ProfileCard.jsx - FIXED IMAGE URL PROCESSING
import React, { useState, useEffect, useCallback } from "react";
import profileService from "../../services/profileService";
import { useNavigate } from "react-router-dom";
import { buildImageUrl, buildApiUrl } from "../../config/api";

// Theme configurations (unchanged)
const themes = {
  silver: {
    primary: "#DC2626",
    secondary: "#EF4444",
    accent: "#B91C1C",
    background: "bg-white",
    border: "border-2 border-red-500 hover:border-yellow-400",
    buttonPrimary: "bg-gradient-to-r from-red-700 via-red-600 to-red-500 hover:from-red-800 hover:via-yellow-600 hover:to-red-700",
    buttonSecondary: "border-2 border-red-600 text-red-700 hover:bg-gradient-to-r hover:from-red-700 hover:to-yellow-500 hover:text-white hover:border-yellow-400",
    badge: "bg-red-100 text-red-800",
    genderFemale: "bg-red-100 text-red-700",
    genderMale: "bg-yellow-100 text-yellow-800",
    loading: "border-red-600",
    shadow: "shadow-lg hover:shadow-red-400/50 hover:shadow-xl",
  },
  gold: {
    primary: "#B7791F",
    secondary: "#D69E2E",
    accent: "#92400E",
    background: "bg-white",
    border: "border-2 border-amber-400 hover:border-yellow-300",
    buttonPrimary: "bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-600 hover:from-yellow-500 hover:via-amber-300 hover:to-yellow-500",
    buttonSecondary: "border-2 border-amber-500 text-amber-800 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-amber-400 hover:text-white hover:border-yellow-300",
    badge: "bg-amber-100 text-amber-900",
    genderFemale: "bg-amber-100 text-amber-700",
    genderMale: "bg-yellow-100 text-yellow-800",
    loading: "border-amber-500",
    shadow: "shadow-lg hover:shadow-amber-400/70 hover:shadow-2xl",
  },
 diamond: {
  primary: "#E879A0",
  secondary: "#F9A8C9",
  accent: "#BE185D",
  background: "bg-white",
  border: "border-2 border-pink-300 hover:border-pink-400",
  buttonPrimary: "bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 hover:from-pink-300 hover:via-white hover:to-pink-400 text-white font-black",
  buttonSecondary: "border-2 border-pink-400 text-pink-700 bg-pink-50 font-black hover:bg-gradient-to-r hover:from-pink-300 hover:to-rose-300 hover:text-white hover:border-pink-200",
  badge: "bg-pink-100 text-pink-800",
  genderFemale: "bg-pink-100 text-pink-700",
  genderMale: "bg-rose-100 text-rose-700",
  loading: "border-pink-400",
  shadow: "shadow-xl hover:shadow-pink-300/80 hover:shadow-2xl",
},
  default: {
    primary: "#DC2626",
    secondary: "#EF4444",
    accent: "#B91C1C",
    background: "bg-white",
    border: "border border-gray-200 hover:border-red-200",
    buttonPrimary: "relative bg-gradient-to-r from-gray-800 via-white to-gray-800 text-gray-900 font-black border-2 border-gray-300 hover:from-white hover:via-gray-100 hover:to-white hover:border-white hover:shadow-lg hover:shadow-white/80 transition-all duration-300",
    buttonSecondary: "relative border-2 border-gray-500 text-gray-900 bg-gradient-to-r from-gray-100 via-white to-gray-100 font-black hover:from-gray-300 hover:via-white hover:to-gray-300 hover:border-white hover:shadow-lg hover:shadow-white/70 transition-all duration-300",
    badge: "bg-red-100 text-red-800",
    genderFemale: "bg-pink-100 text-pink-700",
    genderMale: "bg-blue-100 text-blue-700",
    loading: "border-red-600",
    shadow: "shadow-lg hover:shadow-xl",
  },
};

// ✅ FIXED: Enhanced formatImageUrl function for ALL image scenarios
const formatImageUrl = (url) => {
  if (!url || typeof url !== "string") return null;

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;

  console.log("🔗 Formatting image URL:", trimmedUrl);

  // If it's already a full URL, use it directly
  if (trimmedUrl.startsWith("http")) {
    return trimmedUrl;
  }

  // If it's a backend-stored path like "users/15/photos/filename.jpg"
  if (trimmedUrl.includes("/") && !trimmedUrl.startsWith("/api/")) {
    return buildImageUrl(trimmedUrl);
  }

  // If it's a relative path starting with /api/, construct full URL
  if (trimmedUrl.startsWith("/api/")) {
    return buildApiUrl(trimmedUrl);
  }

  // If it's just a filename, use the public image endpoint
  return buildImageUrl(trimmedUrl);
};

export default function ProfileCard({
  profile,
  onInterestExpressed,
  theme = "default",
}) {
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [finalImageUrl, setFinalImageUrl] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const currentTheme = themes[theme] || themes.default;

  // ✅ FIXED: Better gender detection
  const getNormalizedGender = useCallback(() => {
    const gender = profile?.gender;
    if (!gender) return "Unknown";

    const lowerGender = gender.toLowerCase();
    if (lowerGender.includes("female") || lowerGender === "f") return "Female";
    if (lowerGender.includes("male") || lowerGender === "m") return "Male";

    return gender;
  }, [profile?.gender]);

  const normalizedGender = getNormalizedGender();

  // ✅ FIXED: Simplified image extraction and loading
  const extractImageUrl = useCallback(
    (index = 0) => {
      if (!profile) return null;

      const photos = profile?.photos;
      if (photos && Array.isArray(photos) && photos.length > 0) {
        const validPhotos = photos.filter(
          (photo) => photo != null && photo.trim() !== ""
        );
        if (validPhotos.length > index) {
          const currentPhoto = validPhotos[index];
          return formatImageUrl(currentPhoto);
        }
      }
      return null;
    },
    [profile]
  );

  // ✅ FIXED: Single useEffect with proper dependencies
  useEffect(() => {
    if (!profile) return;

    console.log("🔄 ProfileCard mounted/updated with profile:", profile?.id);

    // Reset states when profile changes
    setImageLoading(true);
    setImageError(false);
    setCurrentImageIndex(0); // Always start with first image

    const imageUrl = extractImageUrl(0);
    console.log("🎯 Setting initial image URL:", imageUrl);
    setFinalImageUrl(imageUrl);
  }, [profile?.id]); // ✅ Only depend on profile.id to prevent loops

  // ✅ FIXED: Better image error handler
  const handleImageError = useCallback(() => {
    console.error("❌ Image failed to load:", finalImageUrl);

    // Check if we have more photos to try
    const photos = profile?.photos;
    const validPhotos =
      photos?.filter((photo) => photo != null && photo.trim() !== "") || [];

    if (validPhotos.length > currentImageIndex + 1) {
      console.log("🔄 Trying next image in array...");
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);

      const nextImageUrl = extractImageUrl(nextIndex);
      console.log("🎯 Setting next image URL:", nextImageUrl);
      setFinalImageUrl(nextImageUrl);
      setImageLoading(true);
      setImageError(false);
    } else {
      console.log("🚫 No more images to try, showing fallback");
      setImageError(true);
      setImageLoading(false);
    }
  }, [finalImageUrl, profile?.photos, currentImageIndex, extractImageUrl]);

  // ✅ FIXED: Image load handler
  const handleImageLoad = useCallback(() => {
    console.log("✅ Image loaded successfully");
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleExpressInterest = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await profileService.expressInterest(profile.id);
      onInterestExpressed?.(profile.id);
      alert("Interest expressed successfully! 💝");
    } catch (err) {
      console.error("❌ Error expressing interest:", err);
      alert(err.message || "Failed to express interest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (e) => {
    e?.stopPropagation();
    const profileType = normalizedGender === "Female" ? "bride" : "groom";
    navigate(`/${profileType}-profile/${profile.id}`);
  };

  const handleCardClick = (e) => {
    if (!e.target.closest("button")) handleViewProfile();
  };

  // ======== Display Helpers ========
  const displayName = profile?.name || profile?.fullName || "Unknown Profile";

  const getDisplayLocation = () => {
    if (profile?.district && profile?.state)
      return `${profile.district}, ${profile.state}`;
    if (profile?.district) return `${profile.district}, Tamil Nadu`;
    if (profile?.state) return profile.state;
    if (profile?.location) {
      const parts = profile.location.split(",");
      return parts.length >= 2
        ? `${parts[0].trim()}, ${parts[1].trim()}`
        : profile.location;
    }
    return "Tamil Nadu";
  };

  const getInitials = (name) =>
    name && name !== "Unknown"
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "??";

  const getAge = () => (profile?.age ? `${profile.age} yrs` : "?? yrs");

  const hasImage = finalImageUrl && !imageError;

  console.log("🎯 RENDER - Image status:", {
    finalImageUrl: finalImageUrl
      ? `${finalImageUrl.substring(0, 50)}...`
      : null,
    hasImage,
    imageLoading,
    imageError,
    currentImageIndex,
  });

  // Helper to build category + caste display (handles backend inconsistencies)
  const buildCategoryCasteDisplay = () => {
    // category may be string or object
    const categoryValue =
      typeof profile?.category === "object"
        ? profile?.category?.category
        : profile?.category;

    // caste may be string or object
    const casteValue =
      typeof profile?.caste === "object" ? profile?.caste?.caste : profile?.caste;

    // subCaste may be provided in profile.subCaste or inside caste object
    const subValue =
      profile?.subCaste ??
      (typeof profile?.caste === "object" ? profile?.caste?.subCaste : null);

    // Normalize blanks to null
    const cat = categoryValue && `${categoryValue}`.trim() !== "" ? categoryValue : null;
    const cas = casteValue && `${casteValue}`.trim() !== "" ? casteValue : null;
    const sub = subValue && `${subValue}`.trim() !== "" ? subValue : null;

    // Preferred: show category(caste)  -> e.g. MBC(Vanniyar)
    if (cat && cas) {
      return sub ? `${cat} (${cas} - ${sub})` : `${cat} (${cas})`;
    }

    // If category present but no caste, show just category
    if (cat) return cat;

    // If no category but caste exists, show caste (with optional sub)
    if (cas) return sub ? `${cas} (${sub})` : cas;

    return "Not specified";
  };

  // Get membership badge based on theme
 const getMembershipBadge = () => {
  const mem = (
    profile?.membershipType ||
    profile?.user?.membership ||
    profile?.membership ||
    theme
  ).toUpperCase();

  switch (mem) {
    case "SILVER":
      return {
        text: "🥈 Silver",
        color: "bg-gradient-to-r from-red-600 to-red-500 text-white border border-yellow-400 shadow shadow-red-300",
      };
    case "GOLD":
      return {
        text: "✨ Gold",
        color: "bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-amber-900 border border-yellow-300 shadow shadow-amber-300",
      };
   case "DIAMOND":
  return {
    text: "💎 Diamond",
    color: "bg-gradient-to-r from-pink-300 via-rose-200 to-pink-400 text-pink-900 border border-pink-300 shadow shadow-pink-200",
  };
    default:
      return {
        text: "🥈 Silver",
        color: "bg-gradient-to-r from-red-600 to-red-500 text-white border border-yellow-400",
      };
  }
};

  const membershipBadge = getMembershipBadge();

  // ======== Render Card ========
  return (
    <div
  className={`${currentTheme.background} ${currentTheme.shadow} rounded-xl overflow-hidden transition-all duration-500 ${currentTheme.border} group cursor-pointer`}
  style={{ transition: "box-shadow 0.4s ease, transform 0.3s ease, border-color 0.3s ease" }}
  onMouseEnter={(e) => {
    const mem = (profile?.membershipType || profile?.user?.membership || profile?.membership || theme || "silver").toUpperCase();
    if (mem === "GOLD") {
      e.currentTarget.style.boxShadow = "0 0 0 2px #fbbf24, 0 0 28px 8px rgba(251,191,36,0.6), 0 0 60px 16px rgba(180,120,0,0.2)";
      e.currentTarget.style.transform = "translateY(-5px) scale(1.012)";
    } else if (mem === "DIAMOND") {
  e.currentTarget.style.boxShadow = [
    "0 0 0 2px #f9a8d4",
    "0 0 16px 4px rgba(249,168,212,0.7)",
    "0 0 32px 10px rgba(244,114,182,0.5)",
    "0 0 60px 18px rgba(236,72,153,0.25)",
    "0 0 90px 28px rgba(255,192,203,0.15)"
  ].join(", ");
  e.currentTarget.style.transform = "translateY(-6px) scale(1.015)";
  e.currentTarget.style.filter = "brightness(1.06) saturate(1.2)";
}else {
      // Silver = navbar red glow
      e.currentTarget.style.boxShadow = "0 0 0 2px #ef4444, 0 0 20px 6px rgba(220,38,38,0.45), 0 0 40px 10px rgba(202,138,4,0.15)";
      e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
    }
  }}
 onMouseLeave={(e) => {
  e.currentTarget.style.boxShadow = "";
  e.currentTarget.style.transform = "";
  e.currentTarget.style.filter = "";
}}
  onClick={handleCardClick}
>
      {/* Diamond pink satin sparkle overlay */}
{theme === "diamond" && (
  <div
    className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
    style={{ zIndex: 20 }}
  >
    {/* Satin sheen sweep - only on hover */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
      style={{
        background: "linear-gradient(135deg, transparent 0%, rgba(255,182,213,0.25) 30%, rgba(255,255,255,0.35) 50%, rgba(255,182,213,0.2) 70%, transparent 100%)",
        backgroundSize: "200% 200%",
        animation: "satinSheen 2.5s ease-in-out infinite",
      }}
    />
    {/* Sparkles — always visible, floating continuously */}
    {[...Array(14)].map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${[5, 18, 32, 48, 62, 78, 90, 12, 38, 55, 72, 85, 25, 68][i]}%`,
          top:  `${[8, 22, 5, 35, 12, 28, 8, 55, 65, 48, 72, 60, 82, 18][i]}%`,
          animation: `pinkSparkle${(i % 4) + 1} ${1.0 + (i * 0.18)}s ease-in-out infinite`,
          animationDelay: `${i * 0.1}s`,
          fontSize: `${i % 3 === 0 ? "14px" : i % 3 === 1 ? "10px" : "7px"}`,
          color: i % 3 === 0 ? "#f9a8d4" : i % 3 === 1 ? "#fbcfe8" : "#ffffff",
          textShadow: "0 0 6px rgba(249,168,212,0.9)",
          filter: "drop-shadow(0 0 3px rgba(236,72,153,0.6))",
          pointerEvents: "none",
        }}
      >
        {i % 5 === 0 ? "✦" : i % 5 === 1 ? "✧" : i % 5 === 2 ? "❋" : i % 5 === 3 ? "✿" : "⋆"}
      </div>
    ))}
  </div>
)}

<div className="relative h-48 bg-gray-100">
        {hasImage ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
                <div
                  className={`animate-spin rounded-full h-8 w-8 border-b-2 ${currentTheme.loading}`}
                ></div>
                <span className="ml-2 text-sm text-gray-600">
                  Loading image...
                </span>
              </div>
            )}
            <img
              src={finalImageUrl}
              alt={displayName}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600">
            <div className="text-4xl mb-2">📷</div>
            <div className="text-sm text-center px-4">Image not available</div>
          </div>
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center text-4xl font-bold ${
              normalizedGender === "Female"
                ? "bg-gradient-to-br from-pink-100 to-pink-200 text-pink-600"
                : "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
            }`}
          >
            {getInitials(displayName)}
          </div>
        )}

        {/* Membership Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`${membershipBadge.color} px-2 py-1 rounded-full text-xs font-medium shadow-md z-10`}
          >
            {membershipBadge.text}
          </span>
        </div>

        {/* Age Badge */}
        <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
          {getAge()}
        </div>
      </div>

      <div className="p-4 relative overflow-hidden">
  {/* ── Diamond falling sparkles — always on, scoped to card content only ── */}
  {theme === "diamond" && (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 5 }}
    >
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${[4, 10, 18, 26, 34, 42, 50, 58, 66, 74, 82, 90, 14, 46, 70, 88][i]}%`,
            top: "-10px",
            animation: `sparkFall ${1.8 + (i * 0.22)}s linear infinite`,
            animationDelay: `${i * 0.15}s`,
            fontSize: `${i % 3 === 0 ? "13px" : i % 3 === 1 ? "9px" : "6px"}`,
            color: i % 4 === 0 ? "#f9a8d4"
                 : i % 4 === 1 ? "#fbcfe8"
                 : i % 4 === 2 ? "#ffffff"
                 : "#fce7f3",
            textShadow: "0 0 4px rgba(249,168,212,0.95)",
            filter: "drop-shadow(0 0 2px rgba(236,72,153,0.7))",
            pointerEvents: "none",
          }}
        >
          {i % 5 === 0 ? "✦"
         : i % 5 === 1 ? "✧"
         : i % 5 === 2 ? "❋"
         : i % 5 === 3 ? "✿"
         : "⋆"}
        </div>
      ))}
    </div>
  )}
        {/* Name + Gender + Location */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {displayName}
          </h3>
          <div className="flex justify-center items-center gap-2 text-sm text-gray-600 mt-1">
            <span className="truncate flex items-center gap-1">
              📍 {getDisplayLocation()}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                normalizedGender === "Female"
                  ? currentTheme.genderFemale
                  : currentTheme.genderMale
              }`}
            >
              {normalizedGender || "N/A"}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-inherit mb-4">
          <div>
            <div className="text-xs text-gray-500">Age</div>
            <div className="text-sm font-semibold text-gray-800">
              {getAge()}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Marital Status</div>
            <div className="text-sm font-semibold text-gray-800 truncate">
              {profile?.maritalStatus || "Not specified"}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Education</div>
            <div className="text-sm font-semibold text-gray-800 truncate">
              {profile?.education || "Not specified"}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Profession</div>
            <div className="text-sm font-semibold text-gray-800 truncate">
              {profile?.profession || profile?.occupation || "Not specified"}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Religion</div>
            <div className="text-sm font-semibold text-gray-800 truncate">
              {profile?.religion || "Not specified"}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Caste</div>
            <div className="text-sm font-semibold text-gray-800 truncate">
              {buildCategoryCasteDisplay()}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-3 border-t border-gray-200">
          <button
  onClick={handleExpressInterest}
  disabled={loading}
  className={`flex-1 ${currentTheme.buttonPrimary} py-2 rounded-lg text-sm disabled:opacity-50 flex items-center justify-center overflow-hidden`}
  style={theme === "diamond" ? {
  background: "linear-gradient(135deg, #ec4899 0%, #f472b6 40%, #e879a0 70%, #db2777 100%)",
  backgroundSize: "200% 200%",
  animation: "diamondButtonShimmer 2s ease infinite",
  color: "#ffffff",
  fontWeight: "900",
  textShadow: "0 1px 3px rgba(157,23,77,0.5)",
  border: "2px solid #f9a8d4",
  boxShadow: "0 0 12px rgba(236,72,153,0.5), inset 0 1px 1px rgba(255,255,255,0.3)"
} : {}}
>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              "Express Interest"
            )}
          </button>

          <button
  onClick={handleViewProfile}
  className={`flex-1 ${currentTheme.buttonSecondary} py-2 rounded-lg transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg`}
  style={theme === "diamond" ? {
  background: "linear-gradient(135deg, #fce7f3 0%, #ffffff 40%, #fce7f3 100%)",
  backgroundSize: "200% 200%",
  animation: "diamondButtonShimmer 2.5s ease infinite reverse",
  color: "#be185d",
  fontWeight: "900",
  textShadow: "0 1px 2px rgba(255,255,255,0.8)",
  border: "2px solid #f9a8d4",
  boxShadow: "0 0 8px rgba(236,72,153,0.3)"
} : {}}
>
            View Profile
          </button>
        </div>
      </div>
      <style>{`
  @keyframes diamondButtonShimmer {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes sparkleFloat1 {
    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.9; color: #ffffff; }
    50%       { transform: translateY(-8px) scale(1.3); opacity: 1; color: #e5e7eb; }
  }
  @keyframes sparkleFloat2 {
    0%, 100% { transform: translateY(0px) rotate(0deg) scale(0.9); opacity: 0.7; color: #d1d5db; }
    50%       { transform: translateY(-12px) rotate(180deg) scale(1.2); opacity: 1; color: #ffffff; }
  }
  @keyframes sparkleFloat3 {
    0%, 100% { transform: translateY(0px) scale(1.1); opacity: 0.8; color: #f3f4f6; }
    33%       { transform: translateY(-6px) scale(0.8); opacity: 0.4; color: #9ca3af; }
    66%       { transform: translateY(-10px) scale(1.3); opacity: 1; color: #ffffff; }
  }
  @keyframes sparkleFloat4 {
    0%, 100% { transform: translate(0,0) scale(1); opacity: 0.6; color: #e5e7eb; }
    25%       { transform: translate(4px,-8px) scale(1.2); opacity: 1; color: #ffffff; }
    75%       { transform: translate(-4px,-6px) scale(0.9); opacity: 0.8; color: #d1d5db; }
  }
    @keyframes sparkFall {
  0%   { transform: translateY(-10px) rotate(0deg);   opacity: 0;   }
  10%  { opacity: 1; }
  90%  { opacity: 0.8; }
  100% { transform: translateY(220px) rotate(360deg); opacity: 0; }
}
`}</style>
    </div>
  );
}
