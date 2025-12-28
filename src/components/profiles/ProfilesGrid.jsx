// src/components/profiles/ProfilesGrid.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import profileService from "../../services/ProfileService"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 

// Theme configurations for ProfilesGrid
const gridThemes = {
  silver: {
    primary: "#6B7280",
    background: "bg-gradient-to-br from-gray-50 to-gray-100",
    cardBackground: "bg-white",
    cardBorder: "border border-gray-200",
    buttonPrimary: "bg-gray-600 hover:bg-gray-700",
    buttonSecondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    badge: "bg-gray-100 text-gray-800",
    activeFilter: "bg-gray-100 text-gray-800"
  },
  gold: {
    primary: "#D97706",
    background: "bg-gradient-to-br from-amber-50 to-yellow-50",
    cardBackground: "bg-white",
    cardBorder: "border border-amber-200",
    buttonPrimary: "bg-amber-600 hover:bg-amber-700",
    buttonSecondary: "bg-amber-100 hover:bg-amber-200 text-amber-800",
    badge: "bg-amber-100 text-amber-800",
    activeFilter: "bg-amber-100 text-amber-800"
  },
  diamond: {
    primary: "#0EA5E9",
    background: "bg-gradient-to-br from-blue-50 to-cyan-50",
    cardBackground: "bg-white",
    cardBorder: "border border-blue-200",
    buttonPrimary: "bg-blue-600 hover:bg-blue-700",
    buttonSecondary: "bg-blue-100 hover:bg-blue-200 text-blue-800",
    badge: "bg-blue-100 text-blue-800",
    activeFilter: "bg-blue-100 text-blue-800"
  },
  default: {
    primary: "#DC2626",
    background: "bg-gray-50",
    cardBackground: "bg-white",
    cardBorder: "border border-red-100",
    buttonPrimary: "bg-red-600 hover:bg-red-700",
    buttonSecondary: "bg-red-100 hover:bg-red-200 text-red-800",
    badge: "bg-red-100 text-red-800",
    activeFilter: "bg-red-100 text-red-800"
  }
};

export default function ProfilesGrid({ theme = "default" }) {
  const [profiles, setProfiles] = useState([]);
  const [filter, setFilter] = useState("all");
  const [religionFilter, setReligionFilter] = useState("all");
  const [communityFilter, setCommunityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const currentTheme = gridThemes[theme] || gridThemes.default;

  // Get category from navigation state
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setCommunityFilter(location.state.selectedCategory);
    }
  }, [location]);

  // Fetch profiles from real backend
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError("");
      
      try {
        console.log("🔄 ProfilesGrid: Fetching profiles using REAL service...");
        
        // Use real profile service to get all profiles
        const data = await profileService.getAllProfiles(pagination.page, pagination.size);
        console.log("✅ ProfilesGrid: Real service response:", data);
        
        // Handle response structure (Spring Boot Pageable)
        let profilesData = [];
        let paginationData = {
          page: 0,
          size: 12,
          totalPages: 1,
          totalElements: 0
        };
        
        if (data.content && Array.isArray(data.content)) {
          profilesData = data.content;
          paginationData = {
            page: data.number || 0,
            size: data.size || 12,
            totalPages: data.totalPages || 1,
            totalElements: data.totalElements || profilesData.length
          };
        } else if (data.profiles && Array.isArray(data.profiles)) {
          profilesData = data.profiles;
        } else if (Array.isArray(data)) {
          profilesData = data;
        } else {
          console.log("❌ No profiles found in response structure:", data);
          profilesData = [];
        }

        console.log("📊 ProfilesGrid: Profiles loaded:", profilesData.length);
        setProfiles(profilesData);
        setPagination(paginationData);
        setLoading(false);
      } catch (err) {
        console.error("❌ ProfilesGrid: Error fetching profiles:", err);
        setError(err.message || "Failed to load profiles from server");
        
        // Optional: Fallback to mock data for development
        if (process.env.NODE_ENV === 'development') {
          console.log("🔄 Using mock data as fallback");
          setProfiles(getMockProfiles());
          setPagination({
            page: 0,
            size: 12,
            totalPages: 1,
            totalElements: 6
          });
        }
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [pagination.page]);

  // Load more profiles
  const loadMore = () => {
    const nextPage = pagination.page + 1;
    if (nextPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: nextPage }));
    }
  };

  // Mock data for development fallback
  const getMockProfiles = () => {
    return [
      {
        id: 1,
        name: "Priya Sharma",
        age: 28,
        profession: "Software Engineer",
        location: "Chennai",
        religion: "Hindu",
        caste: "Iyer",
        gender: "Female",
        imageUrl: "/api/placeholder/300/400",
        community: "Brahmin"
      },
      {
        id: 2,
        name: "Rahul Verma",
        age: 32,
        profession: "Doctor",
        location: "Delhi",
        religion: "Hindu",
        caste: "Punjabi",
        gender: "Male",
        imageUrl: "/api/placeholder/300/400",
        community: "General"
      },
      {
        id: 3,
        name: "Sneha Patel",
        age: 26,
        profession: "Teacher",
        location: "Ahmedabad",
        religion: "Hindu",
        caste: "Patel",
        gender: "Female",
        imageUrl: "/api/placeholder/300/400",
        community: "Patel"
      }
    ];
  };

  // Filter profiles based on active filters
  const filteredProfiles = profiles.filter((p) => {
    if (!p || typeof p !== 'object') return false;
    
    const genderMatch =
      filter === "all" ? true : 
      filter === "brides" ? 
        p.gender === "Female" || p.gender === "FEMALE" || p.gender === "female" : 
        p.gender === "Male" || p.gender === "MALE" || p.gender === "male";
      
    const religionMatch = religionFilter === "all" ? true : p.religion === religionFilter;
    
    const communityMatch = communityFilter === "all" ? true : 
      p.community?.toLowerCase().includes(communityFilter.toLowerCase()) ||
      p.caste?.toLowerCase().includes(communityFilter.toLowerCase()) ||
      p.category?.toLowerCase().includes(communityFilter.toLowerCase());

    return genderMatch && religionMatch && communityMatch;
  });

  console.log("🎯 Filtered profiles count:", filteredProfiles.length);
  console.log("🏷️ Active community filter:", communityFilter);

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${currentTheme.background} p-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className={`p-4 rounded-full bg-${currentTheme.primary.replace('#', '')}-100 inline-flex mb-4`}>
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">Please login to browse profiles.</p>
            <button
              onClick={() => navigate('/login')}
              className={`${currentTheme.buttonPrimary} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors font-medium`}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && profiles.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${currentTheme.buttonPrimary} mx-auto`}></div>
          <p className="mt-4 text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <div className={`min-h-screen ${currentTheme.background} p-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className={`p-4 rounded-full bg-red-100 inline-flex mb-4`}>
              <span className="text-2xl text-red-600">⚠️</span>
            </div>
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className={`${currentTheme.buttonPrimary} text-white px-4 py-2 rounded hover:opacity-90 mr-2`}
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/login')}
                className={`${currentTheme.buttonSecondary} px-4 py-2 rounded hover:opacity-90`}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.background} p-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Message */}
        <div className={`mb-6 p-6 ${currentTheme.cardBackground} rounded-2xl shadow-sm ${currentTheme.cardBorder}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {theme === "silver" ? "Silver Matches" : 
                 theme === "gold" ? "Gold Premium Matches" : 
                 theme === "diamond" ? "Diamond Elite Matches" : 
                 "Find Your Perfect Match"}
              </h1>
              <p className="text-gray-600">
                Browse through <span className="font-semibold text-red-600">{pagination.totalElements}</span> verified profiles
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.reload()}
                className={`${currentTheme.buttonSecondary} px-4 py-2 rounded-lg text-sm font-medium`}
                title="Refresh"
              >
                <span>🔄</span> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(communityFilter !== "all" || religionFilter !== "all") && (
          <div className={`mb-6 p-4 ${currentTheme.cardBackground} rounded-lg shadow-sm ${currentTheme.cardBorder}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {communityFilter !== "all" && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full ${currentTheme.activeFilter} text-sm font-medium`}>
                  Community: {communityFilter}
                  <button 
                    onClick={() => setCommunityFilter("all")}
                    className="ml-2 hover:opacity-70"
                  >
                    ✕
                  </button>
                </span>
              )}
              {religionFilter !== "all" && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full ${currentTheme.activeFilter} text-sm font-medium`}>
                  Religion: {religionFilter}
                  <button 
                    onClick={() => setReligionFilter("all")}
                    className="ml-2 hover:opacity-70"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Religion Filter */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["all", "Hindu", "Muslim", "Christian"].map((rel) => (
            <button
              key={rel}
              onClick={() => setReligionFilter(rel === "all" ? "all" : rel)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                religionFilter === (rel === "all" ? "all" : rel)
                  ? `${currentTheme.buttonPrimary} text-white shadow`
                  : `${currentTheme.buttonSecondary}`
              }`}
            >
              {rel === "all" ? "All Religions" : rel}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className={`mb-6 p-4 ${currentTheme.cardBackground} rounded-lg shadow-sm ${currentTheme.cardBorder}`}>
          <div className="flex justify-between items-center">
            <p className="text-gray-700">
              Showing <span className={`font-semibold text-${currentTheme.primary.replace('#', '')}`}>{filteredProfiles.length}</span> profiles
              {communityFilter !== "all" && ` in ${communityFilter} community`}
            </p>
            
            {/* Clear Filters Button */}
            {(communityFilter !== "all" || religionFilter !== "all") && (
              <button
                onClick={() => {
                  setCommunityFilter("all");
                  setReligionFilter("all");
                  setFilter("all");
                }}
                className={`text-sm ${currentTheme.buttonSecondary} px-3 py-1 rounded`}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className={`p-4 rounded-full bg-gray-100 inline-flex mb-4`}>
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-500 text-lg mb-4">
              {communityFilter !== "all" 
                ? `No profiles found in ${communityFilter} community.` 
                : "No profiles found matching your criteria."
              }
            </p>
            <button
              onClick={() => {
                setCommunityFilter("all");
                setReligionFilter("all");
                setFilter("all");
              }}
              className={`${currentTheme.buttonPrimary} text-white px-6 py-2 rounded hover:opacity-90 transition-colors`}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} theme={theme} />
              ))}
            </div>
            
            {/* Load More Button */}
            {pagination.page < pagination.totalPages - 1 && (
              <div className="text-center mb-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className={`${currentTheme.buttonPrimary} text-white px-8 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors font-medium`}
                >
                  {loading ? "Loading..." : "Load More Profiles"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}