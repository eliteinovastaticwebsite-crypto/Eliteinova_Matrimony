// src/components/profiles/ProfilesList.jsx
import React, { useState, useEffect } from "react";
import profileService from "../../services/profileService"; // REAL SERVICE
import ProfileCard from "./ProfileCard";
import ProfileFilters from "../profiles/FilterSidebar";
import { useAuth } from "../../context/AuthContext"; // REAL AUTH CONTEXT
import CategoryNav from "../common/CategoryNav";
import Banner from "../common/Banner";

import BannerImage2 from "../../assets/BannerImage2.png";

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
    
    // Convert filter field names to match backend API
    const backendFilters = {
      // Personal Details
      minAge: searchFilters.minAge ? parseInt(searchFilters.minAge) : undefined, 
      maxAge: searchFilters.maxAge ? parseInt(searchFilters.maxAge) : undefined,
      religion: searchFilters.religion,
      caste: searchFilters.caste,
      subCaste: searchFilters.subCaste,
      maritalStatus: searchFilters.maritalStatus,
      dosham: searchFilters.dosham,
      
      // Professional Details
      education: searchFilters.education,
      profession: searchFilters.profession, 
      occupation: searchFilters.occupation,
      employedIn: searchFilters.employedIn,
      annualIncome: searchFilters.annualIncome,
      
      // Location Details
      location: searchFilters.location, 
      country: searchFilters.country,
      state: searchFilters.state,
      district: searchFilters.district,
      
      // Additional
      category: searchFilters.category,
    };

    // Remove empty filters
    Object.keys(backendFilters).forEach(key => {
      if (!backendFilters[key] || backendFilters[key] === "") {
        delete backendFilters[key];
      }
    });

    console.log("🔍 Sending to real backend:", backendFilters);
    
    const searchData = await profileService.searchProfiles(backendFilters);
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
    
    // Religion filter
    if (filters.religion && profile.religion !== filters.religion) return false;
    
    // Caste filter (case-insensitive partial match)
    if (filters.caste && profile.caste) {
      const profileCaste = profile.caste.toLowerCase();
      const filterCaste = filters.caste.toLowerCase();
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
    
    // Education filter (case-insensitive partial match)
    if (filters.education && profile.education) {
      const profileEducation = profile.education.toLowerCase();
      const filterEducation = filters.education.toLowerCase();
      if (!profileEducation.includes(filterEducation)) return false;
    }
    
    // ✅ FIXED: Occupation filter - search in both occupation and profession fields
    if (filters.occupation && (profile.occupation || profile.profession)) {
      const profileOccupation = (profile.occupation || profile.profession || '').toLowerCase();
      const filterOccupation = filters.occupation.toLowerCase();
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
    
    // Location filters
    if (filters.country && profile.country !== filters.country) return false;
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
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <Banner
        images={ProfileBannerImages}
        texts={ProfileBannerTexts}
        autoPlayInterval={3000}
        onOpenAuthModal={onOpenAuthModal}
      />
      <CategoryNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
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
    />
  </div>
)}

          {/* Main Content Area */}
          <div className={isAuthenticated ? "lg:w-3/4" : "lg:w-full"}>
            {/* Header Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Find Your Perfect Match
                  </h1>
                  <p className="text-gray-600">
                    {searchResults || hasQuickFilters ? (
                      <>Found <span className="font-semibold text-red-600">{filteredProfiles.length}</span> profiles matching your criteria</>
                    ) : (
                      <>Showing <span className="font-semibold text-red-600">{filteredProfiles.length}</span> of <span className="font-semibold">{pagination.totalElements}</span> profiles</>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Clear All Filters Button */}
                  {(searchResults || hasQuickFilters) && (
                    <button
                      onClick={clearAllFilters}
                      className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 px-3 py-1 border border-red-200 rounded"
                    >
                      <span>✕</span>
                      Clear All Filters
                    </button>
                  )}
                  
                  {/* Clear Search Button */}
                  {searchResults && (
                    <button
                      onClick={clearSearch}
                      className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center gap-1 px-3 py-1 border border-gray-200 rounded"
                    >
                      <span>↶</span>
                      Clear Search
                    </button>
                  )}
                  
                  {/* Refresh Button */}
                  <button
                    onClick={() => fetchAllProfiles()}
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center gap-1 px-3 py-1 border border-gray-200 rounded"
                  >
                    <span>🔄</span>
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Filters</h3>

                {/* Religion Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Religion:</label>
                  <div className="flex gap-2 flex-wrap">
                    {["all", "Hindu", "Muslim", "Christian"].map((religion) => (
                      <button
                        key={religion}
                        onClick={() => setReligionFilter(religion === "all" ? "all" : religion)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                          religionFilter === (religion === "all" ? "all" : religion)
                            ? "bg-red-600 text-white shadow"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {religion === "all" ? "All Religions" : religion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {(genderFilter !== "all" || religionFilter !== "all") && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {genderFilter !== "all" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                        {genderFilter === "brides" ? "👰 Brides" : "🤵 Grooms"}
                        <button 
                          onClick={() => setGenderFilter("all")}
                          className="ml-2 hover:text-red-900 text-xs"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {religionFilter !== "all" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                        {religionFilter}
                        <button 
                          onClick={() => setReligionFilter("all")}
                          className="ml-2 hover:text-blue-900 text-xs"
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
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-red-600 mr-2">⚠️</span>
                    <span className="text-red-800">{error}</span>
                  </div>
                  <button
                    onClick={() => setError("")}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Profiles Grid */}
            {filteredProfiles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-gray-500 text-lg mb-4">
                  {searchResults || hasQuickFilters
                    ? "No profiles found matching your search criteria."
                    : "No profiles available at the moment."
                  }
                </div>
                {(searchResults || hasQuickFilters) && (
                  <button
                    onClick={clearAllFilters}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
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
                      className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
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