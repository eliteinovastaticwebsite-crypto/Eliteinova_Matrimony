import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import adminService from "../../../services/adminService";

function ProfileManagement() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 1,
    totalItems: 0,
    pageSize: 20
  });

  // Fetch profiles from backend
  const fetchProfiles = async (page = pagination.currentPage) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size: pagination.pageSize
      };

      const response = await adminService.getUserProfiles(params);
      
      if (response.success) {
        setProfiles(response.profiles || []);
        setPagination({
          ...pagination,
          currentPage: response.currentPage || 0,
          totalPages: response.totalPages || 1,
          totalItems: response.totalItems || 0
        });
      } else {
        setError(response.message || "Failed to fetch profiles");
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setError(err.message || "Error fetching profiles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed profile from backend
  const fetchProfileDetails = async (profileId) => {
    try {
      const response = await adminService.getProfileById(profileId);
      if (response.success) {
        setSelectedProfile(response.profile);
        setShowDetailModal(true);
      } else {
        alert(response.message || "Failed to load profile details");
      }
    } catch (err) {
      console.error("Error fetching profile details:", err);
      alert("Failed to load profile details");
    }
  };

  // Handle profile status updates using real API
  const handleProfileAction = async (profileId, action) => {
    try {
      // Map actions to new status
      let newStatus;
      let actionMessage;
      
      switch(action) {
        case 'approve':
          newStatus = 'ACTIVE';
          actionMessage = 'approved';
          break;
        case 'reject':
          newStatus = 'INACTIVE';
          actionMessage = 'rejected';
          break;
        case 'suspend':
          newStatus = 'SUSPENDED';
          actionMessage = 'suspended';
          break;
        default:
          newStatus = 'ACTIVE';
          actionMessage = 'updated';
      }

      // Update profile using real API
      const response = await adminService.updateProfile(profileId, { 
        status: newStatus 
      });
      
      if (response.success) {
        // Update local state
        setProfiles(prev => 
          prev.map(profile => 
            profile.id === profileId 
              ? { 
                  ...profile, 
                  user: { ...profile.user, status: newStatus }
                }
              : profile
          )
        );
        
        // Update selected profile if it's the same one
        if (selectedProfile && selectedProfile.id === profileId) {
          setSelectedProfile(prev => ({
            ...prev,
            user: { ...prev.user, status: newStatus }
          }));
        }
        
        alert(`Profile ${actionMessage} successfully!`);
        setShowDetailModal(false);
      } else {
        alert(response.message || "Failed to update profile");
      }
      
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.message || "Error updating profile");
    }
  };

  // Handle view details
  const handleViewDetails = (profile) => {
    fetchProfileDetails(profile.id);
  };

  // Filter profiles based on search term and filter
  const filteredProfiles = profiles.filter(profile => {
    const profileName = profile.name || '';
    const profileEmail = profile.user?.email || '';
    const profileCity = profile.city || '';
    const profileState = profile.state || '';
    
    const matchesSearch = profileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profileEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profileCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profileState.toLowerCase().includes(searchTerm.toLowerCase());
    
    const profileStatus = profile.user?.status || 'INACTIVE';
    const matchesFilter = filter === 'ALL' || profileStatus === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const calculateStats = () => {
    const totalProfiles = profiles.length;
    const activeProfiles = profiles.filter(p => p.user?.status === 'ACTIVE').length;
    const pendingProfiles = profiles.filter(p => p.user?.status === 'PENDING').length;
    const premiumUsers = profiles.filter(p => p.isPremium).length;

    return {
      totalProfiles,
      activeProfiles,
      pendingProfiles,
      premiumUsers
    };
  };

  const stats = calculateStats();

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800 border-green-200',
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'INACTIVE': 'bg-red-100 text-red-800 border-red-200',
      'SUSPENDED': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getMembershipColor = (isPremium) => {
    if (isPremium) {
      return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
    }
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getVerificationBadge = (isVerified) => {
    if (isVerified) {
      return {
        text: 'Verified',
        class: 'bg-green-100 text-green-800 border-green-200'
      };
    }
    return {
      text: 'Unverified',
      class: 'bg-gray-100 text-gray-800 border-gray-200'
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      fetchProfiles(newPage);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchProfiles();
  }, []);

  if (loading && profiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => fetchProfiles()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-blue-500">
          <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-2">
            {stats.totalProfiles}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Total Profiles</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-green-500">
          <div className="text-xl md:text-2xl font-bold text-green-600 mb-1 md:mb-2">
            {stats.activeProfiles}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Active Profiles</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-yellow-500">
          <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1 md:mb-2">
            {stats.pendingProfiles}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Pending Approval</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-purple-500">
          <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1 md:mb-2">
            {stats.premiumUsers}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Premium Users</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                Profile Management {pagination.totalItems > 0 && `(${pagination.totalItems})`}
              </h2>
              <p className="text-sm text-gray-600">Manage user profiles and information</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base w-full"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base w-full sm:w-auto"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fetchProfiles()}
                className="whitespace-nowrap"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {loading && profiles.length > 0 ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Refreshing profiles...</p>
            </div>
          ) : error && profiles.length > 0 ? (
            <div className="text-center py-4 text-red-600">
              <p className="mb-2">{error}</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => fetchProfiles()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProfiles.map((profile) => {
                  const profileStatus = profile.user?.status || 'INACTIVE';
                  const verificationBadge = getVerificationBadge(profile.isVerified);
                  
                  return (
                    <div key={profile.id} className="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <div className="flex items-center min-w-0 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 font-semibold text-white">
                            {profile.name?.charAt(0) || '?'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                              {profile.name || 'Unknown'}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500 truncate">
                              {profile.user?.email || 'No email'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(profileStatus)}`}>
                            {profileStatus}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getMembershipColor(profile.isPremium)}`}>
                            {profile.isPremium ? 'PREMIUM' : 'FREE'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs border ${verificationBadge.class}`}>
                            {verificationBadge.text}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                        <div className="flex justify-between">
                          <span>Age:</span>
                          <span className="font-medium">{profile.age || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gender:</span>
                          <span className="font-medium">{profile.gender || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
  <span>Location:</span>
  <span className="font-medium">
    {profile.city || profile.state 
      ? `${profile.city || ''}${profile.city && profile.state ? ', ' : ''}${profile.state || ''}`.trim()
      : 'N/A'
    }
  </span>
</div>
                        <div className="flex justify-between">
                          <span>Religion:</span>
                          <span className="font-medium">{profile.religion || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Joined:</span>
                          <span className="font-medium">
                            {formatDate(profile.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 md:gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleViewDetails(profile)}
                        >
                          View Profile
                        </Button>
                        {profileStatus === 'PENDING' && (
                          <>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => handleProfileAction(profile.id, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => handleProfileAction(profile.id, 'reject')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {profileStatus === 'ACTIVE' && (
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => handleProfileAction(profile.id, 'suspend')}
                          >
                            Suspend
                          </Button>
                        )}
                        {profileStatus === 'SUSPENDED' && (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => handleProfileAction(profile.id, 'approve')}
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredProfiles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl md:text-5xl mb-4">👤</div>
                  <p className="text-lg md:text-xl font-medium text-gray-600 mb-2">
                    {searchTerm || filter !== 'ALL' ? 'No matching profiles found' : 'No profiles available'}
                  </p>
                  <p className="text-sm md:text-base">
                    {searchTerm || filter !== 'ALL' 
                      ? 'Try adjusting your search criteria or filters' 
                      : 'No profiles have been created yet'}
                  </p>
                  {(searchTerm || filter !== 'ALL') && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setSearchTerm('');
                        setFilter('ALL');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.currentPage + 1} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal - Now using real API data */}
      {showDetailModal && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Profile Details - {selectedProfile.name || 'Unknown'}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center font-semibold text-white text-xl">
                  {selectedProfile.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {selectedProfile.name || 'Unknown'}
                  </h4>
                  <p className="text-gray-600">{selectedProfile.user?.email || 'No email'}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedProfile.user?.status)}`}>
                      {selectedProfile.user?.status || 'INACTIVE'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getMembershipColor(selectedProfile.isPremium)}`}>
                      {selectedProfile.isPremium ? 'PREMIUM' : 'FREE'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getVerificationBadge(selectedProfile.isVerified).class}`}>
                      {getVerificationBadge(selectedProfile.isVerified).text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Age:</span>
                  <p className="text-gray-600">{selectedProfile.age || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Gender:</span>
                  <p className="text-gray-600">{selectedProfile.gender || 'Not specified'}</p>
                </div>
                <div>
  <span className="font-medium text-gray-700">Location:</span>
  <p className="text-gray-600">
    {selectedProfile.city || selectedProfile.state 
      ? `${selectedProfile.city || ''}${selectedProfile.city && selectedProfile.state ? ', ' : ''}${selectedProfile.state || ''}`.trim()
      : 'Not specified'
    }
  </p>
</div>
                <div>
                  <span className="font-medium text-gray-700">Religion:</span>
                  <p className="text-gray-600">{selectedProfile.religion || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Caste:</span>
                  <p className="text-gray-600">{selectedProfile.caste || 'Not specified'}</p>
                </div>
                {selectedProfile.education && (
                  <div>
                    <span className="font-medium text-gray-700">Education:</span>
                    <p className="text-gray-600">{selectedProfile.education}</p>
                  </div>
                )}
                {selectedProfile.profession && (
                  <div>
                    <span className="font-medium text-gray-700">Profession:</span>
                    <p className="text-gray-600">{selectedProfile.profession}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">User ID:</span>
                  <p className="text-gray-600">{selectedProfile.user?.id || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Profile ID:</span>
                  <p className="text-gray-600">{selectedProfile.id || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Joined Date:</span>
                  <p className="text-gray-600">
                    {formatDate(selectedProfile.createdAt)}
                  </p>
                </div>
                {selectedProfile.updatedAt && (
                  <div>
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <p className="text-gray-600">
                      {formatDate(selectedProfile.updatedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Cultural Information */}
              {(selectedProfile.religion || selectedProfile.caste) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Cultural Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {selectedProfile.religion && (
                      <div>
                        <span className="font-medium text-gray-700">Religion:</span>
                        <p className="text-gray-600">{selectedProfile.religion}</p>
                      </div>
                    )}
                    {selectedProfile.caste && (
                      <div>
                        <span className="font-medium text-gray-700">Caste:</span>
                        <p className="text-gray-600">{selectedProfile.caste}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Professional Information */}
              {(selectedProfile.education || selectedProfile.profession) && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {selectedProfile.education && (
                      <div>
                        <span className="font-medium text-gray-700">Education:</span>
                        <p className="text-gray-600">{selectedProfile.education}</p>
                      </div>
                    )}
                    {selectedProfile.profession && (
                      <div>
                        <span className="font-medium text-gray-700">Profession:</span>
                        <p className="text-gray-600">{selectedProfile.profession}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Account Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Account Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <p className={`font-medium ${
                      selectedProfile.user?.status === 'ACTIVE' ? 'text-green-600' :
                      selectedProfile.user?.status === 'PENDING' ? 'text-yellow-600' :
                      selectedProfile.user?.status === 'SUSPENDED' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {selectedProfile.user?.status || 'INACTIVE'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Premium Status:</span>
                    <p className={`font-medium ${selectedProfile.isPremium ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {selectedProfile.isPremium ? 'Premium Member' : 'Free Member'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Verification:</span>
                    <p className={`font-medium ${selectedProfile.isVerified ? 'text-green-600' : 'text-gray-600'}`}>
                      {selectedProfile.isVerified ? 'Verified Profile' : 'Unverified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
              {selectedProfile.user?.status === 'PENDING' && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => handleProfileAction(selectedProfile.id, 'reject')}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleProfileAction(selectedProfile.id, 'approve')}
                  >
                    Approve
                  </Button>
                </>
              )}
              {selectedProfile.user?.status === 'ACTIVE' && (
                <Button
                  variant="secondary"
                  onClick={() => handleProfileAction(selectedProfile.id, 'suspend')}
                >
                  Suspend
                </Button>
              )}
              {selectedProfile.user?.status === 'SUSPENDED' && (
                <Button
                  variant="primary"
                  onClick={() => handleProfileAction(selectedProfile.id, 'approve')}
                >
                  Activate
                </Button>
              )}
              {selectedProfile.user?.status === 'INACTIVE' && (
                <Button
                  variant="primary"
                  onClick={() => handleProfileAction(selectedProfile.id, 'approve')}
                >
                  Activate
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileManagement;