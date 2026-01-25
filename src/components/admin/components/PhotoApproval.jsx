import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import adminService from "../../../services/adminService";
import officeAuthService from "../../../services/officeAuthService";

function PhotoApproval() {
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
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedByUser, setGroupedByUser] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Stats state
  const [stats, setStats] = useState({
    totalPending: 0,
    totalUsers: 0,
    avgPhotosPerUser: 0,
    approvalRate: 0
  });

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Fetch pending photos
  const fetchPendingPhotos = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingPhotos();
      
      if (response.success) {
        const photos = response.pendingPhotos || [];
        setPendingPhotos(photos);
        
        // Group photos by user
        const grouped = groupPhotosByUser(photos);
        setGroupedByUser(grouped);
        
        // Calculate stats
        calculateStats(grouped, photos.length);
        
        // Set initial filtered data
        setFilteredPhotos(grouped);
      }
    } catch (error) {
      console.error('Error fetching pending photos:', error);
      showNotification(error.message || 'Failed to load pending photos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Group photos by user
  const groupPhotosByUser = (photos) => {
    const groupedMap = {};
    
    photos.forEach(photo => {
      const userId = photo.userId;
      if (!groupedMap[userId]) {
        groupedMap[userId] = {
          id: userId,
          user: {
            id: userId,
            name: photo.userName,
            email: photo.email || `${photo.userName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            age: photo.age || 25,
            location: photo.location || 'Unknown'
          },
          photos: [],
          submittedAt: photo.submittedAt,
          totalPhotos: 0,
          pendingCount: 0
        };
      }
      
      groupedMap[userId].photos.push({
        id: photo.id,
        url: photo.photoUrl,
        description: photo.photoUrl.split('/').pop() || 'Profile Photo',
        status: photo.status || 'PENDING',
        uploadedAt: photo.submittedAt,
        size: '2.4 MB',
        dimensions: '1080x1350',
        profileId: photo.profileId,
        originalPhoto: photo
      });
    });
    
    // Convert to array and calculate counts
    return Object.values(groupedMap).map(userGroup => ({
      ...userGroup,
      totalPhotos: userGroup.photos.length,
      pendingCount: userGroup.photos.filter(p => p.status === 'PENDING').length,
      submittedAt: userGroup.photos[0]?.uploadedAt || new Date().toISOString()
    }));
  };

  // Calculate statistics
  const calculateStats = (grouped, totalPhotos) => {
    const totalPending = totalPhotos;
    const totalUsers = grouped.length;
    const avgPhotosPerUser = totalUsers > 0 ? (totalPhotos / totalUsers).toFixed(1) : 0;
    
    const approvalRate = 89;
    
    setStats({
      totalPending,
      totalUsers,
      avgPhotosPerUser,
      approvalRate
    });
  };

  // Update stats based on current data
  const updateStats = () => {
    const newGrouped = groupedByUser.filter(userGroup => userGroup.pendingCount > 0);
    const newTotalPending = newGrouped.reduce((sum, user) => sum + user.pendingCount, 0);
    const newTotalUsers = newGrouped.length;
    const newAvgPhotosPerUser = newTotalUsers > 0 ? (newTotalPending / newTotalUsers).toFixed(1) : 0;
    
    setStats({
      totalPending: newTotalPending,
      totalUsers: newTotalUsers,
      avgPhotosPerUser: newAvgPhotosPerUser,
      approvalRate: 89
    });
  };

  // Filter photos based on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPhotos(groupedByUser.filter(userGroup => userGroup.pendingCount > 0));
      return;
    }
    
    const filtered = groupedByUser.filter(userGroup =>
      (userGroup.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       userGroup.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       userGroup.user.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      userGroup.pendingCount > 0
    );
    
    setFilteredPhotos(filtered);
  }, [searchTerm, groupedByUser]);

  // Update stats when groupedByUser changes
  useEffect(() => {
    updateStats();
  }, [groupedByUser]);

  // Load data on component mount
  useEffect(() => {
    fetchPendingPhotos();
  }, []);

  // Handle single photo action
  const handlePhotoAction = async (userId, photoId, action, reason = '') => {
    // Check if office user is trying to approve/reject
    if (isOfficeUser) {
      showNotification('Office users have read-only access. Only admins can approve or reject photos.', 'error');
      return;
    }

    try {
      // Create a copy of the current state for optimistic update
      const newGroupedByUser = [...groupedByUser];
      const userIndex = newGroupedByUser.findIndex(user => user.id === userId);
      
      if (userIndex !== -1) {
        // Find the photo and update its status
        const updatedPhotos = newGroupedByUser[userIndex].photos.map(photo => 
          photo.id === photoId 
            ? { ...photo, status: action === 'approve' ? 'APPROVED' : 'REJECTED' }
            : photo
        );
        
        // Calculate new pending count
        const pendingCount = updatedPhotos.filter(p => p.status === 'PENDING').length;
        
        // Update the user object
        newGroupedByUser[userIndex] = {
          ...newGroupedByUser[userIndex],
          photos: updatedPhotos,
          pendingCount
        };
        
        // Update state immediately (optimistic update)
        setGroupedByUser(newGroupedByUser);
        
        // Also update filteredPhotos
        setFilteredPhotos(prev => 
          prev.map(userGroup => 
            userGroup.id === userId
              ? { ...userGroup, photos: updatedPhotos, pendingCount }
              : userGroup
          ).filter(userGroup => userGroup.pendingCount > 0)
        );
        
        // Update pendingPhotos
        setPendingPhotos(prev => prev.filter(photo => photo.id !== photoId));
      }
      
      // Call API
      const response = await adminService.approvePhoto(photoId, action, reason);
      
      if (response.success) {
        showNotification(`Photo ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        
        // Refresh data from backend to ensure consistency
        setTimeout(() => {
          fetchPendingPhotos();
        }, 500);
      }
    } catch (error) {
      console.error('Error processing photo action:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to process photo action';
      
      // Check if it's an access denied error
      if (error.response?.status === 403 || errorMessage.includes('access') || errorMessage.includes('permission')) {
        showNotification('Access denied: Only administrators can approve or reject photos.', 'error');
      } else {
        showNotification(errorMessage, 'error');
      }
      
      // Revert by refreshing data
      fetchPendingPhotos();
    }
  };

  // Handle bulk action for a user
  const handleBulkAction = async (userId, action, reason = '') => {
    // Check if office user is trying to approve/reject
    if (isOfficeUser) {
      showNotification('Office users have read-only access. Only admins can approve or reject photos.', 'error');
      return;
    }

    try {
      const userGroup = groupedByUser.find(g => g.id === userId);
      if (!userGroup) return;

      // Optimistic update - remove user from lists immediately
      setGroupedByUser(prev => prev.filter(user => user.id !== userId));
      setFilteredPhotos(prev => prev.filter(user => user.id !== userId));
      setPendingPhotos(prev => 
        prev.filter(photo => !userGroup.photos.some(p => p.id === photo.id))
      );

      const photoIds = userGroup.photos.map(p => p.id);
      
      // Process each photo individually
      const promises = photoIds.map(photoId => 
        adminService.approvePhoto(photoId, action, reason)
      );
      
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      
      if (successful > 0) {
        showNotification(`All photos ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        setShowDetailModal(false);
        // Refresh data from backend to ensure consistency
        setTimeout(() => {
          fetchPendingPhotos();
        }, 500);
      }
    } catch (error) {
      console.error('Error processing bulk action:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to process bulk action';
      
      // Check if it's an access denied error
      if (error.response?.status === 403 || errorMessage.includes('access') || errorMessage.includes('permission')) {
        showNotification('Access denied: Only administrators can approve or reject photos.', 'error');
      } else {
        showNotification(errorMessage, 'error');
      }
      
      // Revert by refreshing
      fetchPendingPhotos();
    }
  };

  // Handle view details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  // Handle global bulk action
  const handleGlobalBulkAction = async () => {
    if (!bulkAction) return;
    
    // Check if office user is trying to approve/reject
    if (isOfficeUser) {
      showNotification('Office users have read-only access. Only admins can approve or reject photos.', 'error');
      setBulkAction('');
      return;
    }
    
    try {
      // Optimistic update - clear everything
      setGroupedByUser([]);
      setFilteredPhotos([]);
      setPendingPhotos([]);
      
      const allPhotoIds = pendingPhotos.map(p => p.id);
      
      // Process all photos
      const promises = allPhotoIds.map(photoId => 
        adminService.approvePhoto(photoId, bulkAction, 'Bulk action')
      );
      
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      
      if (successful > 0) {
        showNotification(`All photos ${bulkAction === 'approve' ? 'approved' : 'rejected'} successfully`);
        setBulkAction('');
        // Refresh data from backend to ensure consistency
        setTimeout(() => {
          fetchPendingPhotos();
        }, 500);
      }
    } catch (error) {
      console.error('Error processing global bulk action:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to process bulk action';
      
      // Check if it's an access denied error
      if (error.response?.status === 403 || errorMessage.includes('access') || errorMessage.includes('permission')) {
        showNotification('Access denied: Only administrators can approve or reject photos.', 'error');
      } else {
        showNotification(errorMessage, 'error');
      }
      
      // Revert by refreshing
      fetchPendingPhotos();
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'APPROVED': 'bg-green-100 text-green-800 border-green-200',
      'REJECTED': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Office User Info Banner */}
      {isOfficeUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900">Read-Only Access</h3>
              <p className="text-sm text-blue-700 mt-1">
                As an office user, you can view pending photos but cannot approve or reject them. Only administrators can perform approval actions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notification Banner */}
      {notification.show && (
        <div className={`rounded-lg p-4 ${
          notification.type === 'error' 
            ? 'bg-red-50 border border-red-200 text-red-800' 
            : 'bg-green-50 border border-green-200 text-green-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {notification.type === 'error' ? (
                <span className="text-red-500 mr-2">⚠️</span>
              ) : (
                <span className="text-green-500 mr-2">✓</span>
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification({ show: false, message: '', type: '' })}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-yellow-500">
          <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1 md:mb-2">
            {loading ? '...' : stats.totalPending}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Pending Photos</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-blue-500">
          <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-2">
            {loading ? '...' : stats.totalUsers}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Users Waiting</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-green-500">
          <div className="text-xl md:text-2xl font-bold text-green-600 mb-1 md:mb-2">
            {loading ? '...' : stats.avgPhotosPerUser}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Avg Photos/User</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-purple-500">
          <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1 md:mb-2">
            {stats.approvalRate}%
          </div>
          <div className="text-xs md:text-sm text-gray-600">Approval Rate</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Photo Approval Queue</h2>
              <p className="text-sm text-gray-600">Review and approve user profile photos</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-md">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name, email, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* Bulk Actions - Admin Only */}
              {!isOfficeUser && (
                <div className="flex gap-2">
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                    disabled={loading || filteredPhotos.length === 0}
                  >
                    <option value="">Bulk Actions</option>
                    <option value="approve">Approve All</option>
                    <option value="reject">Reject All</option>
                  </select>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!bulkAction || loading}
                    onClick={handleGlobalBulkAction}
                  >
                    Apply
                  </Button>
                </div>
              )}
              {isOfficeUser && (
                <div className="text-sm text-gray-500 italic">
                  Read-only mode: Office users cannot approve or reject photos
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading pending photos...</p>
            </div>
          ) : filteredPhotos.length > 0 ? (
            <div className="space-y-4 md:space-y-6">
              {filteredPhotos.map((userPhotos) => (
                <div key={userPhotos.id} className="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
                  {/* User Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-blue-700">
                        {userPhotos.user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-800 text-base md:text-lg truncate">
                          {userPhotos.user.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{userPhotos.user.email}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs text-gray-400">{userPhotos.user.age} years</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">{userPhotos.user.location}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-blue-600 font-medium">
                            {userPhotos.pendingCount} pending photos
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">
                        Submitted: {formatDate(userPhotos.submittedAt)}
                      </span>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleViewDetails(userPhotos)}
                      >
                        Review All Photos
                      </Button>
                    </div>
                  </div>

                  {/* Photos Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {userPhotos.photos.map((photo) => (
                      <div key={photo.id} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:border-gray-300 transition-colors">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-32 md:h-40 rounded-lg flex items-center justify-center mb-3 relative group">
                          {/* Show photo preview if URL exists */}
                          {photo.url ? (
                            <img 
                              src={photo.url} 
                              alt={photo.description}
                              className="h-full w-full object-cover rounded-lg"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<span class="text-gray-400 text-lg">📷</span>';
                              }}
                            />
                          ) : (
                            <span className="text-gray-400 text-lg">📷</span>
                          )}
                          
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                              Click to enlarge
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {photo.description}
                              </p>
                              <p className="text-xs text-gray-500">
                                {photo.dimensions} • {photo.size}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(photo.status)} flex-shrink-0 ml-2`}>
                              {photo.status}
                            </span>
                          </div>
                          
                          {photo.status === 'PENDING' && (
                            <div className="flex gap-2">
                              {!isOfficeUser ? (
                                <>
                                  <Button 
                                    variant="primary" 
                                    size="sm"
                                    className="flex-1 text-xs"
                                    onClick={() => handlePhotoAction(userPhotos.id, photo.id, 'approve')}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="secondary" 
                                    size="sm"
                                    className="flex-1 text-xs"
                                    onClick={() => handlePhotoAction(userPhotos.id, photo.id, 'reject')}
                                  >
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                <div className="w-full text-center text-xs text-gray-500 py-2">
                                  Read-only: Admin action required
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500">
                            {formatDate(photo.uploadedAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 md:mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      {userPhotos.pendingCount} of {userPhotos.photos.length} photos pending approval
                    </div>
                    {!isOfficeUser ? (
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleBulkAction(userPhotos.id, 'approve')}
                        >
                          Approve All
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleBulkAction(userPhotos.id, 'reject')}
                        >
                          Reject All
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        Read-only mode
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12 text-gray-500">
              <div className="text-4xl md:text-5xl mb-4">✅</div>
              <p className="text-lg md:text-xl font-medium text-gray-600 mb-2">
                {searchTerm ? 'No matching photos found' : 'No pending photo approvals'}
              </p>
              <p className="text-sm md:text-base">
                {searchTerm ? 'Try a different search term' : 'All photos have been reviewed and processed'}
              </p>
              {searchTerm && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              )}
              <div className="mt-4 text-xs text-gray-400">
                New photo submissions will appear here for review
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Photo Review - {selectedUser.user.name}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedUser.photos.map((photo) => (
                  <div key={photo.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                      {photo.url ? (
                        <img 
                          src={photo.url} 
                          alt={photo.description}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<span class="text-gray-400 text-2xl">📷</span>';
                          }}
                        />
                      ) : (
                        <span className="text-gray-400 text-2xl">📷</span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">{photo.description}</h4>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Dimensions: {photo.dimensions}</div>
                        <div>Size: {photo.size}</div>
                        <div>Uploaded: {formatDate(photo.uploadedAt)}</div>
                      </div>
                      
                      {photo.status === 'PENDING' && (
                        <div className="flex gap-2 mt-3">
                          {!isOfficeUser ? (
                                <>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handlePhotoAction(selectedUser.id, photo.id, 'approve')}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handlePhotoAction(selectedUser.id, photo.id, 'reject')}
                                  >
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                <div className="w-full text-center text-xs text-gray-500 py-2">
                                  Read-only: Admin action required
                                </div>
                              )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedUser.pendingCount} photos pending approval
              </div>
              <div className="flex gap-2">
                {!isOfficeUser ? (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleBulkAction(selectedUser.id, 'approve')}
                    >
                      Approve All
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowDetailModal(false)}
                    >
                      Close
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoApproval;