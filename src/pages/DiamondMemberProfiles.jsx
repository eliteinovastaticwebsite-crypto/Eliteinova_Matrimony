// src/components/profiles/DiamondMemberProfiles.jsx
import React, { useState, useEffect } from "react";
import { mockProfileService as profileService } from "../services/MockProfileService";
import ProfileCard from "../components/profiles/ProfileCard";
import ProfileFilters from "../components/profiles/FilterSidebar";
import { useMockAuth as useAuth } from "../context/MockAuthContext";
import CategoryNav from "../components/common/CategoryNav";
import Banner from "../components/common/Banner";

import BannerImage2 from "../assets/BannerImage2.png";

const DiamondBannerTexts = [
  {
    title: "Diamond Membership - Elite Matches",
    subtitle: "Exclusive access to premium profiles and VIP features",
    cta: "You're enjoying our highest membership tier!",
  },
];

const DiamondBannerImages = [BannerImage2];

export default function DiamondMemberProfiles({ onOpenAuthModal }) {
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
  
  const [genderFilter, setGenderFilter] = useState(null);
  const [religionFilter, setReligionFilter] = useState("all");
  
  const { isAuthenticated } = useAuth();

  const theme = {
    primary: "#0EA5E9",
    secondary: "#38BDF8",
    accent: "#0369A1",
    background: "bg-gradient-to-br from-blue-50 to-cyan-50",
    cardBackground: "bg-white",
    cardBorder: "border border-blue-200",
    buttonPrimary: "bg-blue-600 hover:bg-blue-700",
    buttonSecondary: "bg-blue-100 hover:bg-blue-200 text-blue-800",
    textPrimary: "text-blue-900",
    textSecondary: "text-blue-700",
    badge: "bg-blue-100 text-blue-800"
  };

  useEffect(() => {
    fetchAllProfiles();
  }, []);

  const fetchAllProfiles = async (page = 0, size = 12) => {
    setLoading(true);
    setError("");
    
    try {
      console.log("🔄 DiamondMemberProfiles: Fetching elite profiles...", { page, size });
      const data = await profileService.getAllProfiles(page, size);
      console.log("✅ DiamondMemberProfiles: Service response:", data);
      
      const profilesData = data.content || [];
      const paginationData = {
        page: data.number || page,
        size: data.size || size,
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || profilesData.length
      };

      console.log("📊 DiamondMemberProfiles: Elite profiles data:", profilesData);
      setProfiles(profilesData);
      setPagination(paginationData);
      
    } catch (err) {
      console.error("❌ DiamondMemberProfiles: Error fetching elite profiles", err);
      const errorMessage = err.message || "Failed to load elite profiles";
      setError(errorMessage);
      
      console.log("🔄 Using local mock data as fallback");
      const mockData = getMockProfiles();
      setProfiles(mockData);
      setPagination({
        page: 0,
        size: 12,
        totalPages: 1,
        totalElements: mockData.length
      });
      setError("");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = async (filters) => {
    setLoading(true);
    setError("");
    
    try {
      console.log("🔍 DiamondMemberProfiles: Searching with elite filters", filters);
      
      const searchFilters = {
        gender: filters.gender,
        minAge: filters.ageMin,
        maxAge: filters.ageMax,
        religion: filters.religion,
        caste: filters.caste,
        subCaste: filters.subCaste,
        maritalStatus: filters.maritalStatus,
        education: filters.education,
        occupation: filters.occupation,
        employedIn: filters.employedIn,
        annualIncome: filters.annualIncome,
        country: filters.country,
        state: filters.state,
        district: filters.district,
        category: filters.category
      };

      Object.keys(searchFilters).forEach(key => {
        if (!searchFilters[key] || searchFilters[key] === "") {
          delete searchFilters[key];
        }
      });

      console.log("🔍 Converted elite search filters:", searchFilters);
      
      const searchData = await profileService.searchProfiles(searchFilters);
      console.log("✅ DiamondMemberProfiles: Elite search results:", searchData);
      
      let searchProfiles = [];
      
      if (searchData.profiles && Array.isArray(searchData.profiles)) {
        searchProfiles = searchData.profiles;
      } else if (Array.isArray(searchData)) {
        searchProfiles = searchData;
      } else if (searchData.content && Array.isArray(searchData.content)) {
        searchProfiles = searchData.content;
      } else if (searchData.fallback) {
        searchProfiles = filterProfilesClientSide(profiles, searchFilters);
      } else {
        searchProfiles = [];
      }
      
      setSearchResults(searchProfiles);
      
    } catch (err) {
      console.error("❌ DiamondMemberProfiles: Elite search error", err);
      setError(err.message || "Elite search failed");
      
      console.log("🔄 Using client-side filtering as fallback");
      const searchFilters = {
        gender: filters.gender,
        minAge: filters.ageMin,
        maxAge: filters.ageMax,
        religion: filters.religion,
        caste: filters.caste,
        subCaste: filters.subCaste,
        maritalStatus: filters.maritalStatus,
        education: filters.education,
        occupation: filters.occupation,
        employedIn: filters.employedIn,
        annualIncome: filters.annualIncome,
        country: filters.country,
        state: filters.state,
        district: filters.district,
        category: filters.category
      };
      
      const fallbackResults = filterProfilesClientSide(profiles, searchFilters);
      setSearchResults(fallbackResults);
    } finally {
      setLoading(false);
    }
  };

  const filterProfilesClientSide = (allProfiles, filters) => {
    console.log("🔄 Using elite client-side filtering with:", { 
      profilesCount: allProfiles.length, 
      filters 
    });
    
    return allProfiles.filter(profile => {
      if (filters.minAge && profile.age < parseInt(filters.minAge)) return false;
      if (filters.maxAge && profile.age > parseInt(filters.maxAge)) return false;
      
      if (filters.gender) {
        const profileGender = profile.gender?.toLowerCase();
        const filterGender = filters.gender?.toLowerCase();
        if (profileGender !== filterGender) return false;
      }
      
      if (filters.religion && profile.religion !== filters.religion) return false;
      
      if (filters.caste && profile.caste) {
        const profileCaste = profile.caste.toLowerCase();
        const filterCaste = filters.caste.toLowerCase();
        if (!profileCaste.includes(filterCaste)) return false;
      }
      
      if (filters.subCaste && profile.subCaste) {
        const profileSubCaste = profile.subCaste.toLowerCase();
        const filterSubCaste = filters.subCaste.toLowerCase();
        if (!profileSubCaste.includes(filterSubCaste)) return false;
      }
      
      if (filters.category && profile.category !== filters.category) return false;
      
      if (filters.maritalStatus && profile.maritalStatus !== filters.maritalStatus) return false;
      
      if (filters.education && profile.education) {
        const profileEducation = profile.education.toLowerCase();
        const filterEducation = filters.education.toLowerCase();
        if (!profileEducation.includes(filterEducation)) return false;
      }
      
      if (filters.occupation && profile.occupation) {
        const profileOccupation = profile.occupation.toLowerCase();
        const filterOccupation = filters.occupation.toLowerCase();
        if (!profileOccupation.includes(filterOccupation)) return false;
      }
      
      if (filters.employedIn && profile.employedIn !== filters.employedIn) return false;
      
      if (filters.annualIncome && profile.annualIncome !== filters.annualIncome) return false;
      
      if (filters.country && profile.country !== filters.country) return false;
      if (filters.state && profile.state !== filters.state) return false;
      
      if (filters.district && profile.district) {
        const profileDistrict = profile.district.toLowerCase();
        const filterDistrict = filters.district.toLowerCase();
        if (!profileDistrict.includes(filterDistrict)) return false;
      }
      
      if (filters.dosham && filters.dosham !== "Doesn't Matter") {
        if (filters.dosham === "Yes" && profile.dosham !== "Yes") return false;
        if (filters.dosham === "No" && profile.dosham !== "No") return false;
      }
      
      return true;
    });
  };

  const applyQuickFilters = () => {
    let filtered = searchResults || profiles;
    
    if (genderFilter === "brides") {
      filtered = filtered.filter(profile => 
        profile.gender === "Female" || profile.gender === "FEMALE" || profile.gender === "female"
      );
    } else if (genderFilter === "grooms") {
      filtered = filtered.filter(profile => 
        profile.gender === "Male" || profile.gender === "MALE" || profile.gender === "male"
      );
    }
    
    if (religionFilter !== "all") {
      filtered = filtered.filter(profile => profile.religion === religionFilter);
    }
    
    return filtered;
  };

  const clearAllFilters = () => {
    setGenderFilter(null);
    setReligionFilter("all");
    setSearchResults(null);
    setError("");
  };

  const clearSearch = () => {
    setSearchResults(null);
    setError("");
  };

  const loadMore = () => {
    const nextPage = pagination.page + 1;
    if (nextPage < pagination.totalPages) {
      fetchAllProfiles(nextPage, pagination.size);
    }
  };

  const toggleGenderFilter = (gender) => {
    if (genderFilter === gender) {
      setGenderFilter(null);
    } else {
      setGenderFilter(gender);
    }
  };

  const filteredProfiles = applyQuickFilters();
  const showLoadMore = !searchResults && pagination.page < pagination.totalPages - 1;
  const hasQuickFilters = genderFilter !== null || religionFilter !== "all";

  const getMockProfiles = () => [
    {
      id: 1,
      fullName: "Priya Kumar",
      age: 28,
      gender: "Female",
      location: "Chennai, Tamil Nadu",
      education: "M.Sc. Computer Science",
      occupation: "Software Engineer",
      annualIncome: "5-10",
      religion: "Hindu",
      caste: "Iyer",
      subCaste: "Iyer",
      category: "OC",
      maritalStatus: "Never Married",
      dosham: "No",
      employedIn: "Private",
      country: "India",
      state: "Tamil Nadu",
      district: "Chennai",
      profile_image: null,
      height: "5'4\"",
      motherTongue: "Tamil"
    },
    {
      id: 2,
      fullName: "Arun Raj",
      age: 32,
      gender: "Male", 
      location: "Coimbatore, Tamil Nadu",
      education: "B.Tech Mechanical",
      occupation: "Business Owner",
      annualIncome: "20+",
      religion: "Hindu",
      caste: "Nair",
      subCaste: "Nair",
      category: "OC",
      maritalStatus: "Never Married",
      dosham: "No",
      employedIn: "Business",
      country: "India",
      state: "Tamil Nadu",
      district: "Coimbatore",
      profile_image: null,
      height: "5'10\"",
      motherTongue: "Malayalam"
    },
    {
      id: 3,
      fullName: "Meena Subramanian",
      age: 26,
      gender: "Female",
      location: "Madurai, Tamil Nadu", 
      education: "B.Com",
      occupation: "Accountant",
      annualIncome: "5-10",
      religion: "Hindu",
      caste: "Naidu",
      subCaste: "Naidu",
      category: "OC",
      maritalStatus: "Never Married",
      dosham: "No",
      employedIn: "Private",
      country: "India",
      state: "Tamil Nadu",
      district: "Madurai",
      profile_image: null,
      height: "5'3\"",
      motherTongue: "Tamil"
    },
    {
      id: 4,
      fullName: "Rahman Khan",
      age: 30,
      gender: "Male",
      location: "Chennai, Tamil Nadu",
      education: "MBA",
      occupation: "Marketing Manager",
      annualIncome: "10-15",
      religion: "Muslim",
      caste: "Sunni",
      subCaste: "Sunni",
      category: "General",
      maritalStatus: "Never Married",
      dosham: "No",
      employedIn: "Private",
      country: "India",
      state: "Tamil Nadu",
      district: "Chennai",
      profile_image: null,
      height: "5'9\"",
      motherTongue: "Tamil"
    },
    {
      id: 5,
      fullName: "Maria Joseph",
      age: 27,
      gender: "Female",
      location: "Coimbatore, Tamil Nadu",
      education: "B.Sc Nursing",
      occupation: "Nurse",
      annualIncome: "5-10",
      religion: "Christian",
      caste: "Roman Catholic",
      subCaste: "Roman Catholic",
      category: "OC",
      maritalStatus: "Never Married",
      dosham: "No",
      employedIn: "Government",
      country: "India",
      state: "Tamil Nadu",
      district: "Coimbatore",
      profile_image: null,
      height: "5'5\"",
      motherTongue: "Tamil"
    },
    {
      id: 6,
      fullName: "Suresh Vanniyar",
      age: 35,
      gender: "Male",
      location: "Salem, Tamil Nadu",
      education: "Diploma",
      occupation: "Business Owner",
      annualIncome: "10-15",
      religion: "Hindu",
      caste: "Vanniyar",
      subCaste: "Vanniyar",
      category: "BC",
      maritalStatus: "Never Married",
      dosham: "Yes",
      employedIn: "Business",
      country: "India",
      state: "Tamil Nadu",
      district: "Salem",
      profile_image: null,
      height: "5'8\"",
      motherTongue: "Tamil"
    }
  ];

  if (loading && profiles.length === 0) {
    return (
      <div className={`min-h-screen ${theme.background} flex justify-center items-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4`}></div>
          <p className={theme.textSecondary}>Loading elite profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.background}`}>
      {/* Diamond Membership Badge */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="text-xl">💎</span>
          <span className="font-bold text-lg">Diamond Membership</span>
          <span className="text-sm opacity-90">• VIP Access • Unlimited Features • Personal Matchmaking</span>
        </div>
      </div>

      {/* Diamond Exclusive Header */}
      <div className="bg-white border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">⭐</span>
                <span className="text-sm font-medium text-blue-900">VIP Profile Access</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600">🔒</span>
                <span className="text-sm font-medium text-blue-900">Verified Profiles Only</span>
              </div>
            </div>
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              DIAMOND ELITE
            </div>
          </div>
        </div>
      </div>

      <Banner
        images={DiamondBannerImages}
        texts={DiamondBannerTexts}
        autoPlayInterval={3000}
        onOpenAuthModal={onOpenAuthModal}
      />
      
      <CategoryNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {isAuthenticated && (
            <div className="lg:w-1/4">
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">💎 Diamond Benefits</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Unlimited Profile Views</li>
                  <li>• Advanced Compatibility Scores</li>
                  <li>• Personal Matchmaking</li>
                  <li>• Priority Customer Support</li>
                </ul>
              </div>
              <ProfileFilters
                filters={filters}
                onFilterChange={(updatedFilters) => {
                  setFilters(updatedFilters);
                  handleSearchResults(updatedFilters);
                }}
                theme="diamond"
                membershipType="DIAMOND"
              />
            </div>
          )}

          <div className={isAuthenticated ? "lg:w-3/4" : "lg:w-full"}>
            {/* Header Stats */}
            <div className={`${theme.cardBackground} rounded-lg shadow-lg ${theme.cardBorder} p-6 mb-6`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className={`text-2xl font-bold ${theme.textPrimary} mb-2`}>
                    Diamond Elite Matches
                  </h1>
                  <p className={theme.textSecondary}>
                    {searchResults || hasQuickFilters ? (
                      <>Found <span className={`font-semibold text-blue-600`}>{filteredProfiles.length}</span> elite profiles matching your criteria</>
                    ) : (
                      <>Showing <span className={`font-semibold text-blue-600`}>{filteredProfiles.length}</span> of <span className="font-semibold">{pagination.totalElements}</span> verified elite profiles</>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                    <span className="text-blue-600">💎</span>
                    <span className="text-blue-800 text-sm font-medium">Diamond Priority</span>
                  </div>
                  
                  {(searchResults || hasQuickFilters) && (
                    <button
                      onClick={clearAllFilters}
                      className={`text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 px-3 py-1 border border-blue-200 rounded`}
                    >
                      <span>✕</span>
                      Clear All Filters
                    </button>
                  )}
                  
                  <button
                    onClick={() => fetchAllProfiles()}
                    className={`text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 px-3 py-1 border border-blue-200 rounded`}
                  >
                    <span>🔄</span>
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className={`${theme.cardBackground} rounded-lg shadow-lg ${theme.cardBorder} p-6 mb-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>Diamond Exclusive Filters</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">VIP ACCESS</span>
              </div>
              
              <div className="mb-4">
                <label className={`block text-sm font-medium ${theme.textPrimary} mb-2`}>Looking for:</label>
                <div className="flex gap-2 flex-wrap">
                  {["brides", "grooms"].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => toggleGenderFilter(gender)}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        genderFilter === gender
                          ? `bg-blue-600 text-white shadow-lg shadow-blue-200`
                          : `bg-blue-100 text-blue-800 hover:bg-blue-200 hover:shadow-md`
                      }`}
                    >
                      {gender === "brides" ? "👰 Elite Brides" : "🤵 Elite Grooms"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textPrimary} mb-2`}>Religion:</label>
                  <div className="flex gap-2 flex-wrap">
                    {["all", "Hindu", "Muslim", "Christian"].map((religion) => (
                      <button
                        key={religion}
                        onClick={() => setReligionFilter(religion === "all" ? "all" : religion)}
                        className={`px-3 py-2 rounded-md text-xs font-medium transition ${
                          religionFilter === (religion === "all" ? "all" : religion)
                            ? `bg-blue-600 text-white shadow`
                            : `bg-blue-100 text-blue-800 hover:bg-blue-200`
                        }`}
                      >
                        {religion === "all" ? "All" : religion}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${theme.textPrimary} mb-2`}>Verified Only:</label>
                  <div className="flex gap-2">
                    <button className="bg-green-100 text-green-800 px-3 py-2 rounded-md text-xs font-medium">
                      ✅ Verified Profiles
                    </button>
                  </div>
                </div>
              </div>

              {(genderFilter !== null || religionFilter !== "all") && (
                <div className="pt-4 border-t border-blue-200">
                  <h4 className={`text-sm font-medium ${theme.textPrimary} mb-2`}>Active Filters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {genderFilter !== null && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium`}>
                        {genderFilter === "brides" ? "👰 Elite Brides" : "🤵 Elite Grooms"}
                        <button 
                          onClick={() => setGenderFilter(null)}
                          className="ml-2 hover:text-blue-900 text-xs"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {religionFilter !== "all" && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium`}>
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

            {error && (
              <div className={`mb-6 bg-white border border-blue-200 rounded-lg p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-red-600 mr-2">⚠️</span>
                    <span className="text-blue-900">{error}</span>
                  </div>
                  <button
                    onClick={() => setError("")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {filteredProfiles.length === 0 ? (
              <div className={`text-center py-12 bg-white rounded-lg shadow-sm border border-blue-200`}>
                <div className={`text-blue-700 text-lg mb-4`}>
                  {searchResults || hasQuickFilters
                    ? "No elite profiles found matching your search criteria."
                    : "No elite profiles available at the moment."
                  }
                </div>
                {(searchResults || hasQuickFilters) && (
                  <button
                    onClick={clearAllFilters}
                    className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors`}
                  >
                    Show All Elite Profiles
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
                      theme="diamond"
                    />
                  ))}
                </div>
                
                {showLoadMore && (
                  <div className="text-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className={`bg-white border border-blue-300 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-colors`}
                    >
                      {loading ? "Loading..." : "Load More Elite Profiles"}
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