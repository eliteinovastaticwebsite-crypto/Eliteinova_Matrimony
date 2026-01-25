// src/components/profiles/ProfilesList.jsx
import React, { useState, useEffect } from "react";
import profileService from "../../services/profileService"; // REAL SERVICE
import ProfileCard from "./ProfileCard";
import ProfileFilters from "../profiles/FilterSidebar";
import { useAuth } from "../../context/AuthContext"; // REAL AUTH CONTEXT
import { useTheme } from "../../context/ThemeContext"; // ADDED: Theme context
import CategoryNav from "../common/CategoryNav";
import Banner from "../common/Banner";
import ThemeDecorations from "../common/ThemeDecorations"; // ADDED: Theme decorations

import BannerImage2 from "../../assets/BannerImage2.png";
// Import membership banner images
import silverBanner from "../../assets/membershipBanner/silver.png";
import goldBanner from "../../assets/membershipBanner/gold.png";
import diamondBanner from "../../assets/membershipBanner/diamond.png";

const ProfileBannerTexts = [
  {
    title: "Smart Search, Perfect Match",
    subtitle: "Love Meets Technology – Find Your Partner Today!",
    cta: "Upgrade To Get More Features",
  },
];

const ProfileBannerImages = [BannerImage2];

export default function ProfilesList({onOpenAuthModal}) {
  const [profiles, setProfiles] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0
  });
  
  // Gender and Religion filter states
  const [genderFilter, setGenderFilter] = useState("all"); // Changed from null to "all"
  const [religionFilter, setReligionFilter] = useState("all");
  
  const [searchTimeout, setSearchTimeout] = useState(null);

  const { isAuthenticated, user } = useAuth();
  const { membershipType, theme, colors, classes } = useTheme(); // ADDED: Theme context

  // Debug logging for membership and theme
  useEffect(() => {
    console.log('🎨 ProfilesList - User data:', user);
    console.log('🎨 ProfilesList - Membership type detected:', membershipType);
    console.log('🎨 ProfilesList - Theme:', theme);
    console.log('🎨 ProfilesList - User membership field:', user?.membership || user?.membershipType);
    console.log('🎨 ProfilesList - Colors object:', colors);
    console.log('🎨 ProfilesList - Background gradient:', colors.bgGradientStyle);
    console.log('🎨 ProfilesList - Blob colors:', { blob1: colors.blob1, blob2: colors.blob2, blob3: colors.blob3 });
  }, [user, membershipType, theme, colors]);

  // Fetch all profiles on component mount
  useEffect(() => {
    fetchAllProfiles();
  }, []);

  const checkDatabaseValues = async () => {
  try {
    const allProfiles = await profileService.getAllProfiles(0, 100);
    console.log("📊 DATABASE CHECK - All profiles with ages and occupations:");
    
    allProfiles.content?.forEach(profile => {
      console.log(`👤 ${profile.name} (ID: ${profile.id}): Age=${profile.age}, Occupation=${profile.occupation}, Profession=${profile.profession}`);
    });
    
    // Check age distribution
    const ages = allProfiles.content?.map(p => p.age).filter(age => age != null);
    console.log("📈 Age distribution:", {
      minAge: Math.min(...ages),
      maxAge: Math.max(...ages),
      averageAge: ages.reduce((a, b) => a + b, 0) / ages.length
    });
    
  } catch (err) {
    console.error("❌ Error checking database:", err);
  }
};

  const fetchAllProfiles = async (page = 0, size = 12) => {
    setLoading(true);
    setError("");
    
    try {
      console.log("🔄 ProfilesList: Fetching profiles from REAL backend...", { page, size });
      
      // Get user's membership type to filter profiles
      const userMembershipType = user?.membership || user?.membershipType || "SILVER";
      console.log("👤 User membership type:", userMembershipType);
      
      const data = await profileService.getAllProfiles(page, size, userMembershipType);
      console.log("✅ ProfilesList: Real backend response:", data);
      
      // Real backend returns Spring Boot Pageable structure
      let profilesData = data.content || data.profiles || [];
      
      // Filter profiles by membership type (client-side fallback if backend doesn't filter)
      if (userMembershipType && profilesData.length > 0) {
        profilesData = profilesData.filter(profile => {
          const profileMembership = profile.user?.membership || profile.membership || "SILVER";
          return profileMembership === userMembershipType;
        });
        console.log(`🔍 Filtered profiles by membership type ${userMembershipType}:`, profilesData.length);
      }
      
      const paginationData = {
        page: data.number || page,
        size: data.size || size,
        totalPages: data.totalPages || 1,
        totalElements: profilesData.length // Use filtered count
      };

      setProfiles(profilesData);
      setPagination(paginationData);
      
    } catch (err) {
      console.error("❌ ProfilesList: Error fetching from real backend", err);
      setError(err.message || "Failed to load profiles from server");
      
      // Fallback to mock data for development
      console.log("🔄 Using mock data as fallback");
      const mockData = getMockProfiles();
      setProfiles(mockData);
      setPagination({
        page: 0,
        size: 12,
        totalPages: 1,
        totalElements: mockData.length
      });
    } finally {
      setLoading(false);
    }
  };

  // In ProfilesList.jsx - update the performSearch function:

const performSearch = async (searchFilters) => {
  setLoading(true);
  setError("");
  
  try {
    console.log("🔍 ProfilesList: Searching with REAL backend", searchFilters);
    
    // Pass the original searchFilters (including "Other" fields) to searchProfiles
    // The mapFiltersToBackend function will handle the mapping and "Other" value replacement
    const searchData = await profileService.searchProfiles(searchFilters);
    console.log("✅ ProfilesList: Real search results:", searchData);
    
    // Handle response structure
    const searchProfiles = searchData.content || searchData.profiles || searchData || [];
    setSearchResults(searchProfiles);
    
  } catch (err) {
    console.error("❌ ProfilesList: Real search error", err);
    setError(err.message || "Search failed - using client-side filtering");
    
    // Fallback to client-side filtering
    console.log("🔄 Using client-side filtering as fallback");
    const fallbackResults = filterProfilesClientSide(profiles, searchFilters);
    setSearchResults(fallbackResults);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const filterProfilesClientSide = (allProfiles, filters) => {
  console.log("🔄 Using client-side filtering with:", { 
    profilesCount: allProfiles.length, 
    filters 
  });
  
  // Helper function to get the actual filter value (handles "Other" / "Others" options)
  const getFilterValue = (fieldName) => {
    const value = filters[fieldName];
    if ((value === "Other" || value === "Others") && filters[`${fieldName}Other`]) {
      const otherValue = filters[`${fieldName}Other`];
      if (otherValue && typeof otherValue === 'string' && otherValue.trim() !== '') {
        return otherValue.trim();
      }
    }
    return value;
  };
  
  return allProfiles.filter(profile => {
    // ✅ FIXED: Age filter with proper field names
    if (filters.minAge && profile.age < parseInt(filters.minAge)) return false;
    if (filters.maxAge && profile.age > parseInt(filters.maxAge)) return false;
    
    // Gender filter
    if (filters.gender) {
      const profileGender = profile.gender?.toLowerCase();
      const filterGender = filters.gender?.toLowerCase();
      if (profileGender !== filterGender) return false;
    }
    
    // Religion filter (with "Other" handling)
    const religionFilter = getFilterValue('religion');
    if (religionFilter && profile.religion) {
      const profileReligion = profile.religion.toLowerCase();
      const filterReligion = religionFilter.toLowerCase();
      if (!profileReligion.includes(filterReligion)) return false;
    }
    
    // Caste filter (case-insensitive partial match, with "Others" handling)
    const casteFilter = getFilterValue('caste');
    if (casteFilter && profile.caste) {
      const profileCaste = profile.caste.toLowerCase();
      const filterCaste = casteFilter.toLowerCase();
      if (!profileCaste.includes(filterCaste)) return false;
    }
    
    // Subcaste filter (case-insensitive partial match)
    if (filters.subCaste && profile.subCaste) {
      const profileSubCaste = profile.subCaste.toLowerCase();
      const filterSubCaste = filters.subCaste.toLowerCase();
      if (!profileSubCaste.includes(filterSubCaste)) return false;
    }
    
    // Category filter
    if (filters.category && profile.category !== filters.category) return false;
    
    // Marital status filter
    if (filters.maritalStatus && profile.maritalStatus !== filters.maritalStatus) return false;
    
    // Education filter (case-insensitive partial match, with "Other" handling)
    const educationFilter = getFilterValue('education');
    if (educationFilter && profile.education) {
      const profileEducation = profile.education.toLowerCase();
      const filterEducation = educationFilter.toLowerCase();
      if (!profileEducation.includes(filterEducation)) return false;
    }
    
    // Educational Qualification filter (with "Other" handling)
    const educationalQualificationFilter = getFilterValue('educationalQualification');
    if (educationalQualificationFilter && profile.educationalQualification) {
      const profileEduQual = profile.educationalQualification.toLowerCase();
      const filterEduQual = educationalQualificationFilter.toLowerCase();
      if (!profileEduQual.includes(filterEduQual)) return false;
    }
    
    // ✅ FIXED: Occupation filter - search in both occupation and profession fields (with "Other" handling)
    const occupationFilter = getFilterValue('occupation');
    if (occupationFilter && (profile.occupation || profile.profession)) {
      const profileOccupation = (profile.occupation || profile.profession || '').toLowerCase();
      const filterOccupation = occupationFilter.toLowerCase();
      if (!profileOccupation.includes(filterOccupation)) return false;
    }
    
    // ✅ FIXED: Profession filter - search in both profession and occupation fields
    if (filters.profession && (profile.profession || profile.occupation)) {
      const profileProfession = (profile.profession || profile.occupation || '').toLowerCase();
      const filterProfession = filters.profession.toLowerCase();
      if (!profileProfession.includes(filterProfession)) return false;
    }
    
    // Employed in filter
    if (filters.employedIn && profile.employedIn !== filters.employedIn) return false;
    
    // Annual income filter
    if (filters.annualIncome && profile.annualIncome !== filters.annualIncome) return false;
    
    // Location filters (with "Other" handling for country)
    const countryFilter = getFilterValue('country');
    if (countryFilter && profile.country) {
      const profileCountry = profile.country.toLowerCase();
      const filterCountry = countryFilter.toLowerCase();
      if (!profileCountry.includes(filterCountry)) return false;
    }
    if (filters.state && profile.state !== filters.state) return false;
    
    // District filter (case-insensitive partial match)
    if (filters.district && profile.district) {
      const profileDistrict = profile.district.toLowerCase();
      const filterDistrict = filters.district.toLowerCase();
      if (!profileDistrict.includes(filterDistrict)) return false;
    }
    
    // Dosham filter
    if (filters.dosham && filters.dosham !== "Doesn't Matter") {
      if (filters.dosham === "Yes" && profile.dosham !== "Yes") return false;
      if (filters.dosham === "No" && profile.dosham !== "No") return false;
    }
    
    return true;
  });
};

  // Apply gender and religion filters
  const applyQuickFilters = () => {
    let filtered = searchResults || profiles;
    
    // ✅ ADDED: Filter by membership type - only show profiles matching user's membership
    if (user?.membership || user?.membershipType) {
      const userMembership = user.membership || user.membershipType;
      filtered = filtered.filter(profile => {
        const profileMembership = profile.user?.membership || profile.membership || "SILVER";
        return profileMembership === userMembership;
      });
      console.log(`🔍 Filtered by membership type ${userMembership}:`, filtered.length, "profiles");
    }
    
    // Apply gender filter
    if (genderFilter === "brides") {
      filtered = filtered.filter(profile => 
        profile.gender === "Female" || profile.gender === "FEMALE" || profile.gender === "female"
      );
    } else if (genderFilter === "grooms") {
      filtered = filtered.filter(profile => 
        profile.gender === "Male" || profile.gender === "MALE" || profile.gender === "male"
      );
    }
    // If genderFilter is "all", show all genders
    
    // Apply religion filter
    if (religionFilter !== "all") {
      filtered = filtered.filter(profile => profile.religion === religionFilter);
    }
    
    return filtered;
  };

  // Clear all filters
  const clearAllFilters = () => {
    setGenderFilter("all");
    setReligionFilter("all");
    setSearchResults(null);
    setError("");
  };

  // Clear search and show all profiles
  const clearSearch = () => {
    setSearchResults(null);
    setError("");
  };

  // Load more profiles
  const loadMore = () => {
    const nextPage = pagination.page + 1;
    if (nextPage < pagination.totalPages) {
      fetchAllProfiles(nextPage, pagination.size);
    }
  };

  // Toggle gender filter
  const toggleGenderFilter = (gender) => {
    setGenderFilter(gender);
  };

  // Determine which profiles to show after applying quick filters
  const filteredProfiles = applyQuickFilters();
  const showLoadMore = !searchResults && pagination.page < pagination.totalPages - 1;
  const hasQuickFilters = genderFilter !== "all" || religionFilter !== "all";

  
  if (loading && profiles.length === 0) {
    return (
      <div 
        className="min-h-screen flex justify-center items-center relative overflow-hidden"
        style={{ background: colors.bgGradientStyle }}
      >
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div 
            className="absolute top-10 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob"
            style={{ backgroundColor: colors.blob1 }}
          ></div>
          <div 
            className="absolute top-10 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"
            style={{ backgroundColor: colors.blob2 }}
          ></div>
          <div 
            className="absolute bottom-10 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"
            style={{ backgroundColor: colors.blob3 }}
          ></div>
        </div>
        <div className="text-center relative z-10">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.accent }}
          ></div>
          <p className={classes.textColor}>Loading profiles...</p>
        </div>
      </div>
    );
  }

  // Get membership banner image based on membership type
  const getMembershipBanner = () => {
    const normalizedType = membershipType?.toUpperCase() || user?.membership?.toUpperCase() || user?.membershipType?.toUpperCase() || 'SILVER';
    switch (normalizedType) {
      case 'GOLD':
        return goldBanner;
      case 'DIAMOND':
        return diamondBanner;
      case 'SILVER':
      default:
        return silverBanner;
    }
  };

  const membershipBannerImage = getMembershipBanner();

  return (
    <div 
      className="min-h-screen relative"
      style={{ 
        backgroundImage: `url(${membershipBannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        // Add overlay to maintain readability
        position: 'relative'
      }}
    >
      {/* Subtle overlay for better content readability */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.04) 100%)',
          zIndex: 0
        }}
      ></div>
      {/* Animated Background Blobs - Membership-based colors (reduced opacity for banner visibility) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        <div 
          className="absolute top-20 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
          style={{ backgroundColor: colors.blob1 || '#9CA3AF' }}
        ></div>
        <div 
          className="absolute top-20 right-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
          style={{ backgroundColor: colors.blob2 || '#6B7280' }}
        ></div>
        <div 
          className="absolute bottom-20 left-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
          style={{ backgroundColor: colors.blob3 || '#4B5563' }}
        ></div>
      </div>
      
      {/* Theme Decorations - Sparkles, Coins, Diamonds */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <ThemeDecorations membershipType={membershipType} colors={colors} />
      </div>
      
      {/* Banner Section - Has its own background */}
      <div className="relative" style={{ zIndex: 3 }}>
        <Banner
          // images={ProfileBannerImages}
          texts={ProfileBannerTexts}
          autoPlayInterval={3000}
          onOpenAuthModal={onOpenAuthModal}
        />
      </div>
      
      {/* CategoryNav - Has its own background */}
      <div className="relative" style={{ zIndex: 3 }}>
        <CategoryNav />
      </div>
      
      {/* Main Content Area - Theme background visible here */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative" style={{ position: 'relative', zIndex: 3 }}>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {isAuthenticated && (
  <div className="lg:w-1/4">
    <ProfileFilters
      filters={filters}
      onFilterChange={(updatedFilters) => {
        console.log("🔄 Filter changed:", updatedFilters);
        
        // Debug age fields specifically
        console.log("🎯 Age fields:", {
          minAge: updatedFilters.minAge,
          maxAge: updatedFilters.maxAge,
          hasMinAge: !!updatedFilters.minAge,
          hasMaxAge: !!updatedFilters.maxAge
        });
        
        setFilters(updatedFilters);
        
        // Check if we have any active filters
        const hasActiveFilters = Object.values(updatedFilters).some(
          value => value !== "" && value !== null && value !== undefined
        );
        
        if (hasActiveFilters) {
          console.log("🔍 Performing search with filters...");
          performSearch(updatedFilters);
        } else {
          console.log("🔄 No active filters, showing all profiles");
          setSearchResults(null);
        }
      }}
      theme={(() => {
        const memType = membershipType || user?.membership || user?.membershipType || "SILVER";
        if (typeof memType === 'string') {
          const normalized = memType.toUpperCase();
          if (normalized === "GOLD") return "gold";
          if (normalized === "DIAMOND") return "diamond";
          if (normalized === "SILVER") return "silver";
        }
        return "default";
      })()}
      membershipType={membershipType || user?.membership || user?.membershipType || "SILVER"}
    />
  </div>
)}

          {/* Main Content Area */}
          <div className={isAuthenticated ? "lg:w-3/4" : "lg:w-full"}>
            {/* Header Stats - Membership-based styling */}
            <div 
              className={`${classes.cardBg} rounded-lg shadow-sm border p-6 mb-6`}
              style={{ borderColor: `${colors.accent}40` }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className={`${isAuthenticated && user?.membership ? 'text-xl' : 'text-2xl'} font-bold ${classes.textColor}`}>
                      Find Your Perfect Match
                    </h1>
                    {membershipType && (
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                        style={{
                          backgroundColor: colors.accentLight,
                          color: colors.accent
                        }}
                      >
                        {membershipType} Member
                      </span>
                    )}
                  </div>
                  <p className={`${classes.textColor} opacity-70 ${isAuthenticated && user?.membership ? 'text-sm' : ''}`}>
                    {searchResults || hasQuickFilters ? (
                      <>Found <span className="font-semibold" style={{ color: colors.accent }}>{filteredProfiles.length}</span> profiles matching your criteria</>
                    ) : (
                      <>Showing <span className="font-semibold" style={{ color: colors.accent }}>{filteredProfiles.length}</span> of <span className="font-semibold">{pagination.totalElements}</span> {membershipType} profiles</>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Clear All Filters Button */}
                  {(searchResults || hasQuickFilters) && (
                    <button
                      onClick={clearAllFilters}
                      className={`font-medium ${isAuthenticated && user?.membership ? 'text-xs' : 'text-sm'} flex items-center gap-1 px-3 py-1 border rounded transition-colors`}
                      style={{
                        color: colors.accent,
                        borderColor: `${colors.accent}60`,
                        backgroundColor: `${colors.accentLight}40`
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = `${colors.accentLight}60`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = `${colors.accentLight}40`;
                      }}
                    >
                      <span>✕</span>
                      Clear All Filters
                    </button>
                  )}
                  
                  {/* Clear Search Button */}
                  {searchResults && (
                    <button
                      onClick={clearSearch}
                      className={`${classes.textColor} opacity-70 hover:opacity-100 font-medium ${isAuthenticated && user?.membership ? 'text-xs' : 'text-sm'} flex items-center gap-1 px-3 py-1 border rounded transition-colors`}
                      style={{ borderColor: `${colors.accent}40` }}
                    >
                      <span>↶</span>
                      Clear Search
                    </button>
                  )}
                  
                  {/* Refresh Button */}
                  <button
                    onClick={() => fetchAllProfiles()}
                    className={`${classes.textColor} opacity-70 hover:opacity-100 font-medium text-sm flex items-center gap-1 px-3 py-1 border rounded transition-colors`}
                    style={{ borderColor: `${colors.accent}40` }}
                  >
                    <span>🔄</span>
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Filter Buttons - Membership-based styling */}
            <div 
              className={`${classes.cardBg} rounded-lg shadow-sm border p-6 mb-6`}
              style={{ borderColor: `${colors.accent}40` }}
            >
              <div className="mb-4">
                <h3 className={`${isAuthenticated && user?.membership ? 'text-base' : 'text-lg'} font-semibold ${classes.textColor} mb-3`}>Quick Filters</h3>

                {/* Religion Filter */}
                <div>
                  <label className={`block ${isAuthenticated && user?.membership ? 'text-xs' : 'text-sm'} font-medium ${classes.textColor} mb-2`}>Religion:</label>
                  <div className="flex gap-2 flex-wrap">
                    {["all", "Hindu", "Muslim", "Christian"].map((religion) => {
                      const isActive = religionFilter === (religion === "all" ? "all" : religion);
                      return (
                        <button
                          key={religion}
                          onClick={() => setReligionFilter(religion === "all" ? "all" : religion)}
                          className={`px-4 py-2 rounded-md ${isAuthenticated && user?.membership ? 'text-xs' : 'text-sm'} font-medium transition ${
                            isActive
                              ? "text-white shadow"
                              : `${classes.textColor} opacity-70 hover:opacity-100`
                          }`}
                          style={isActive ? {
                            backgroundColor: colors.accent
                          } : {
                            backgroundColor: colors.accentLight + '40'
                          }}
                        >
                          {religion === "all" ? "All Religions" : religion}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {(genderFilter !== "all" || religionFilter !== "all") && (
                <div className="pt-4 border-t" style={{ borderColor: `${colors.accent}40` }}>
                  <h4 className={`${isAuthenticated && user?.membership ? 'text-xs' : 'text-sm'} font-medium ${classes.textColor} mb-2`}>Active Filters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {genderFilter !== "all" && (
                      <span 
                        className={`inline-flex items-center px-3 py-1 rounded-full ${isAuthenticated && user?.membership ? 'text-xs' : 'text-sm'} font-medium`}
                        style={{
                          backgroundColor: colors.accentLight,
                          color: colors.accent
                        }}
                      >
                        {genderFilter === "brides" ? "👰 Brides" : "🤵 Grooms"}
                        <button 
                          onClick={() => setGenderFilter("all")}
                          className="ml-2 hover:opacity-70 text-xs transition-opacity"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {religionFilter !== "all" && (
                      <span 
                        className={`inline-flex items-center px-3 py-1 rounded-full ${isAuthenticated && user?.membership ? 'text-xs' : 'text-sm'} font-medium`}
                        style={{
                          backgroundColor: colors.accentLight,
                          color: colors.accent
                        }}
                      >
                        {religionFilter}
                        <button 
                          onClick={() => setReligionFilter("all")}
                          className="ml-2 hover:opacity-70 text-xs transition-opacity"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <div 
                className="mb-6 border rounded-lg p-4"
                style={{
                  backgroundColor: colors.accentLight + '40',
                  borderColor: colors.accent
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2" style={{ color: colors.accent }}>⚠️</span>
                    <span style={{ color: colors.accent }}>{error}</span>
                  </div>
                  <button
                    onClick={() => setError("")}
                    className="hover:opacity-70 transition-opacity"
                    style={{ color: colors.accent }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Profiles Grid */}
            {filteredProfiles.length === 0 ? (
              <div 
                className={`text-center py-12 ${classes.cardBg} rounded-lg shadow-sm border`}
                style={{ borderColor: `${colors.accent}40` }}
              >
                <div className={`${classes.textColor} opacity-70 ${isAuthenticated && user?.membership ? 'text-base' : 'text-lg'} mb-4`}>
                  {searchResults || hasQuickFilters
                    ? "No profiles found matching your search criteria."
                    : `No ${membershipType} profiles available at the moment.`
                  }
                </div>
                {(searchResults || hasQuickFilters) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    style={{
                      backgroundColor: colors.accent
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '1';
                    }}
                  >
                    Show All Profiles
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredProfiles.map((profile) => (
                    <ProfileCard 
                      key={profile.id} 
                      profile={profile} 
                    />
                  ))}
                </div>
                
                {/* Load More Button */}
                {showLoadMore && (
                  <div className="text-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className={`${classes.cardBg} border px-6 py-3 rounded-lg disabled:opacity-50 transition-colors font-medium`}
                      style={{
                        borderColor: `${colors.accent}60`,
                        color: colors.accent
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.target.style.backgroundColor = colors.accentLight + '60';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.target.style.backgroundColor = '';
                        }
                      }}
                    >
                      {loading ? "Loading..." : "Load More Profiles"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}