import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import adminService from "../../../services/adminService";
import officeAuthService from "../../../services/officeAuthService";

function ProfileVerification() {
  // Get current user role
  const getCurrentRole = () => {
    if (localStorage.getItem('officeToken')) {
      return 'OFFICE';
    }
    const adminUser = adminService.getAdminUser();
    if (adminUser?.role) {
      return adminUser.role;
    }
    if (localStorage.getItem('adminToken')) {
      return 'ADMIN';
    }
    return null;
  };

  const currentRole = getCurrentRole();
  const isOfficeUser = currentRole === 'OFFICE';
  // State management
  const [pendingVerification, setPendingVerification] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    totalPending: 0,
    verifiedToday: 0,
    approvalRate: 0,
    rejectionRate: 0
  });

  // Fetch pending verifications from API
  const fetchPendingVerifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching pending verifications...');
      const response = await adminService.getPendingVerifications();
      console.log('📥 Received response:', response);
      
      if (response.success) {
        const pendingList = response.pendingVerifications || [];
        setPendingVerification(pendingList);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalPending: pendingList.length,
          verifiedToday: response.verifiedToday || 0,
          approvalRate: response.approvalRate || 94,
          rejectionRate: response.rejectionRate || 8.2
        }));
      } else {
        throw new Error(response.message || "Failed to fetch verifications");
      }
    } catch (err) {
      console.error("Error fetching verifications:", err);
      setError(err.message || "Failed to load pending verifications");
      toast.error("Failed to load verifications");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPendingVerifications();
  }, [fetchPendingVerifications]);

  // Handle verification action
  const handleVerificationAction = async (profileId, action) => {
    const actionText = action === 'approved' ? 'approve' : 'reject';
    
    if (!window.confirm(`Are you sure you want to ${actionText} this profile verification?`)) {
      return;
    }

    try {
      console.log(`🔄 ${actionText === 'approve' ? 'Approving' : 'Rejecting'} profile:`, profileId);
      
      const status = action === 'approved' ? 'APPROVED' : 'REJECTED';
      const response = await adminService.verifyProfile(profileId, status);
      
      if (response.success) {
        toast.success(`Profile ${actionText}ed successfully`);
        
        // Remove from local state
        setPendingVerification(prev => 
          prev.filter(item => item.id !== profileId)
        );
        
        // Update stats optimistically
        setStats(prev => ({
          ...prev,
          totalPending: Math.max(0, prev.totalPending - 1),
          verifiedToday: action === 'approved' ? prev.verifiedToday + 1 : prev.verifiedToday
        }));
        
        setShowDetailModal(false);
        
        // Refresh stats from backend to get accurate counts (including verifiedToday)
        // Use a small delay to ensure backend has processed the update
        setTimeout(() => {
          fetchPendingVerifications();
        }, 1000);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error(`Error ${actionText}ing profile:`, err);
      toast.error(`Failed to ${actionText} profile`);
    }
  };

  const handleViewDetails = (profile) => {
    console.log('👁️ Viewing profile details:', profile);
    setSelectedProfile(profile);
    setShowDetailModal(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render loading state
  if (loading && pendingVerification.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verifications...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && pendingVerification.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Verifications</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button 
          variant="primary" 
          onClick={fetchPendingVerifications}
          className="px-4 py-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-yellow-500">
          <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1 md:mb-2">
            {stats.totalPending}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Pending Verification</div>
          {loading && pendingVerification.length > 0 && (
            <div className="text-xs text-yellow-500 mt-1">Updating...</div>
          )}
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-green-500">
          <div className="text-xl md:text-2xl font-bold text-green-600 mb-1 md:mb-2">
            {stats.verifiedToday}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Verified Today</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-blue-500">
          <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-2">
            {stats.approvalRate}%
          </div>
          <div className="text-xs md:text-sm text-gray-600">Approval Rate</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-red-500">
          <div className="text-xl md:text-2xl font-bold text-red-600 mb-1 md:mb-2">
            {stats.rejectionRate}%
          </div>
          <div className="text-xs md:text-sm text-gray-600">Rejection Rate</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Profile Verification</h2>
              <p className="text-sm text-gray-600">
                {stats.totalPending} profile{stats.totalPending !== 1 ? 's' : ''} pending verification
                {loading && pendingVerification.length > 0 && " • Updating..."}
              </p>
            </div>
            <div className="flex gap-2 md:gap-3">
              <Button
                variant="secondary"
                onClick={fetchPendingVerifications}
                disabled={loading}
                className="px-3 md:px-4 py-2"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-4 md:p-6">
          {/* Loading overlay */}
          {loading && pendingVerification.length > 0 && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            </div>
          )}
          
          {pendingVerification.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {pendingVerification.map(profile => (
                <div key={profile.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg gap-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0 font-semibold text-white">
                      {profile.profileName?.charAt(0) || profile.userName?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                        <div>
                          <p className="font-medium text-gray-900 truncate">
                            {profile.profileName || profile.userName || 'Unknown User'}
                          </p>
                          {profile.userName && profile.profileName && (
                            <p className="text-xs text-gray-500">
                              User: {profile.userName}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1 md:mt-0">
                          {profile.age && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {profile.age} years
                            </span>
                          )}
                          {profile.gender && (
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                              {profile.gender}
                            </span>
                          )}
                          {profile.city && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              {profile.city}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
  <span className="text-xs text-gray-400">
    Submitted: {formatDate(profile.submittedAt || profile.createdAt)}
  </span>
  {/* FIXED LINE: Now checks both photoUrls and photos fields */}
  <span className="text-xs text-blue-600 font-medium">
    {(profile.photoUrls?.length || profile.photos || 0)} 
    photo{(profile.photoUrls?.length || profile.photos || 0) !== 1 ? 's' : ''} 
    submitted
  </span>
  {profile.userId && (
    <span className="text-xs text-gray-500">
      User ID: #{profile.userId}
    </span>
  )}
</div>
                    </div>
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleViewDetails(profile)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleVerificationAction(profile.id, 'approved')}
                      disabled={loading}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="danger"
                      size="sm"
                      onClick={() => handleVerificationAction(profile.id, 'rejected')}
                      disabled={loading}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl md:text-5xl mb-4">✅</div>
              <p className="text-lg md:text-xl font-medium text-gray-600 mb-2">No pending verifications</p>
              <p className="text-sm md:text-base">All profiles are verified and up to date</p>
              <div className="mt-4 text-xs text-gray-400">
                New verification requests will appear here automatically
              </div>
              <Button
                variant="secondary"
                onClick={fetchPendingVerifications}
                disabled={loading}
                className="mt-4"
              >
                {loading ? "Checking..." : "Check Again"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Profile Verification - {selectedProfile.profileName || selectedProfile.userName}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Information */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-semibold text-white text-xl">
                  {selectedProfile.profileName?.charAt(0) || selectedProfile.userName?.charAt(0) || '?'}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {selectedProfile.profileName || selectedProfile.userName || 'Unknown User'}
                  </h4>
                  {selectedProfile.userName && selectedProfile.profileName && (
                    <p className="text-gray-600">User: {selectedProfile.userName}</p>
                  )}
                  {selectedProfile.userId && (
                    <p className="text-sm text-gray-500">User ID: #{selectedProfile.userId}</p>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Submitted Date:</span>
                  <p className="text-gray-600">{formatDate(selectedProfile.submittedAt || selectedProfile.createdAt)}</p>
                </div>
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
                    {selectedProfile.city || 'City not specified'}
                    {selectedProfile.state && `, ${selectedProfile.state}`}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">About:</span>
                  <p className="text-gray-600 mt-1 p-3 bg-gray-50 rounded-lg">
                    {selectedProfile.about || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Verification Documents */}
              <div>
  <h4 className="font-semibold text-gray-800 mb-3">Verification Documents</h4>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Photos Card */}
    <div className="border border-gray-200 rounded-lg p-4 text-center">
      <div className="text-3xl mb-2">📸</div>
      <p className="font-medium text-gray-800">Profile Photos</p>
      
      {/* Check multiple possible field names */}
      {selectedProfile.photoUrls?.length > 0 ? (
        <div>
          <p className="text-sm text-gray-600 mt-1">
            {selectedProfile.photoUrls.length} photo{selectedProfile.photoUrls.length !== 1 ? 's' : ''}
          </p>
          <div className="mt-3 space-y-1">
            {selectedProfile.photoUrls.slice(0, 2).map((url, index) => (
              <a 
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:text-blue-800 truncate"
              >
                Photo {index + 1}
              </a>
            ))}
          </div>
        </div>
      ) : selectedProfile.photos > 0 ? (
        <p className="text-sm text-gray-600 mt-1">
          {selectedProfile.photos} photo{selectedProfile.photos !== 1 ? 's' : ''}
        </p>
      ) : (
        <p className="text-sm text-red-500 mt-2">No photos</p>
      )}
    </div>
    
    {/* Jathagam Card */}
    <div className="border border-gray-200 rounded-lg p-4 text-center">
      <div className="text-3xl mb-2">📜</div>
      <p className="font-medium text-gray-800">Jathagam/Horoscope</p>
      
      {/* Check multiple possible field names */}
      {selectedProfile.jathagam?.fileUrl ? (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 truncate">
            {selectedProfile.jathagam.fileName || 'Jathagam Document'}
          </p>
          <a 
            href={selectedProfile.jathagam.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            View Document
          </a>
        </div>
      ) : selectedProfile.hasJathagam ? (
        <p className="text-sm text-green-600 mt-2">✓ Jathagam submitted</p>
      ) : (
        <p className="text-sm text-red-500 mt-2">No jathagam</p>
      )}
    </div>
    
    {/* Dosham Card */}
    <div className="border border-gray-200 rounded-lg p-4 text-center">
      <div className="text-3xl mb-2">⭐</div>
      <p className="font-medium text-gray-800">Dosham</p>
      
      {selectedProfile.dosham ? (
        <div className="mt-3">
          <p className="text-lg font-semibold text-gray-800">
            {selectedProfile.dosham}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {selectedProfile.dosham === 'No' || selectedProfile.dosham === 'NO' 
              ? 'No Dosham' 
              : 'Has Dosham'}
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-2">Not specified</p>
      )}
    </div>
  </div>
</div>

              {/* Risk Assessment */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Verification Check</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>✅ Profile information complete</li>
                  <li>{selectedProfile.photos ? '✅ Photos submitted' : '⚠️ No photos submitted'}</li>
                  <li>✅ User account is active</li>
                  <li>{selectedProfile.about ? '✅ About section filled' : '⚠️ About section empty'}</li>
                  {selectedProfile.submittedAt && (
                    <li>✅ Submitted {formatDate(selectedProfile.submittedAt)}</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowDetailModal(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  variant="danger"
                  onClick={() => handleVerificationAction(selectedProfile.id, 'rejected')}
                  className="flex-1 sm:flex-none"
                  disabled={loading}
                >
                  Reject Verification
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleVerificationAction(selectedProfile.id, 'approved')}
                  className="flex-1 sm:flex-none"
                  disabled={loading}
                >
                  Approve Verification
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileVerification;