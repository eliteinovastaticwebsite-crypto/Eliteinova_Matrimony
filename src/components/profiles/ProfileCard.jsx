// src/components/profiles/ProfileCard.jsx - FIXED IMAGE URL PROCESSING
import React, { useState, useEffect, useCallback } from "react";
import profileService from "../../services/ProfileService";
import { useNavigate } from "react-router-dom";
import { buildImageUrl, buildApiUrl } from "../../config/api";

// Theme configurations (unchanged)
const themes = {
  silver: {
    primary: "#6B7280",
    secondary: "#9CA3AF",
    accent: "#374151",
    background: "bg-white",
    border: "border border-gray-200 hover:border-gray-300",
    buttonPrimary:
      "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800",
    buttonSecondary:
      "border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white",
    badge: "bg-gray-100 text-gray-800",
    genderFemale: "bg-gray-100 text-gray-700",
    genderMale: "bg-gray-100 text-gray-700",
    loading: "border-gray-600",
    shadow: "shadow-lg hover:shadow-xl",
  },
  gold: {
    primary: "#D97706",
    secondary: "#F59E0B",
    accent: "#B45309",
    background: "bg-white",
    border: "border border-amber-200 hover:border-amber-300",
    buttonPrimary:
      "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800",
    buttonSecondary:
      "border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white",
    badge: "bg-amber-100 text-amber-800",
    genderFemale: "bg-amber-100 text-amber-700",
    genderMale: "bg-amber-100 text-amber-700",
    loading: "border-amber-600",
    shadow: "shadow-lg hover:shadow-xl",
  },
  diamond: {
    primary: "#0EA5E9",
    secondary: "#38BDF8",
    accent: "#0369A1",
    background: "bg-white",
    border: "border border-blue-200 hover:border-blue-300",
    buttonPrimary:
      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    buttonSecondary:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    badge: "bg-blue-100 text-blue-800",
    genderFemale: "bg-blue-100 text-blue-700",
    genderMale: "bg-blue-100 text-blue-700",
    loading: "border-blue-600",
    shadow: "shadow-xl hover:shadow-2xl",
  },
  default: {
    primary: "#DC2626",
    secondary: "#EF4444",
    accent: "#B91C1C",
    background: "bg-white",
    border: "border border-gray-200 hover:border-red-200",
    buttonPrimary:
      "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
    buttonSecondary:
      "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
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
    switch (theme) {
      case "silver":
        return { text: "🥈 Silver", color: "bg-gray-100 text-gray-800" };
      case "gold":
        return { text: "🥇 Gold", color: "bg-amber-100 text-amber-800" };
      case "diamond":
        return { text: "💎 Diamond", color: "bg-blue-100 text-blue-800" };
      default:
        return { text: "⭐ Premium", color: "bg-yellow-100 text-yellow-800" };
    }
  };

  const membershipBadge = getMembershipBadge();

  // ======== Render Card ========
  return (
    <div
      className={`${currentTheme.background} ${currentTheme.shadow} rounded-xl overflow-hidden transition-all duration-300 ${currentTheme.border} group cursor-pointer`}
      onClick={handleCardClick}
    >
      {/* Profile Image - Smart Background */}
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

      <div className="p-4">
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
            className={`flex-1 ${currentTheme.buttonPrimary} text-white py-2 rounded-lg transition-all duration-200 font-semibold text-sm disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg`}
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
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}
