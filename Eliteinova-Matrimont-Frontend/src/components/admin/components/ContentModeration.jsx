import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import adminService from "../../../services/adminService";

function ContentModeration() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profiles');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [moderationReason, setModerationReason] = useState('');
  
  // State for different types of content
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [reportedContent, setReportedContent] = useState([]);
  const [flaggedComments, setFlaggedComments] = useState([]);
  
  // Stats
  const [stats, setStats] = useState({
    totalPending: 0,
    pendingProfiles: 0,
    reportedContent: 0,
    flaggedComments: 0
  });

  // Fetch all moderation content
  const fetchModerationContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real application, you would have separate endpoints for:
      // 1. Pending profiles (users with status PENDING)
      // 2. Flagged content (from getFlaggedContent endpoint)
      // 3. Flagged comments (separate endpoint or part of flagged content)
      
      // For now, let's fetch flagged content and simulate other data
      const flaggedResponse = await adminService.getFlaggedContent();
      
      if (flaggedResponse.success) {
        // Transform backend data to match frontend structure
        const transformedContent = (flaggedResponse.flaggedContent || []).map(item => ({
          id: item.id,
          type: item.type,
          user: { name: item.userName, email: "user@example.com" }, // Email would come from backend
          reason: item.reason,
          description: item.content,
          reportedBy: { name: item.reportedBy, email: "reporter@example.com" },
          status: item.status,
          severity: getSeverityFromType(item.type),
          createdAt: item.reportedAt || new Date().toISOString()
        }));
        
        setReportedContent(transformedContent);
        
        // For demo, let's simulate pending profiles and flagged comments
        // In a real app, you would fetch these from separate endpoints
        const mockPendingProfiles = [
          {
            id: 101,
            name: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            status: 'PENDING',
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            id: 102,
            name: 'Priya Sharma',
            email: 'priya@example.com',
            status: 'PENDING',
            createdAt: '2024-01-14T14:20:00Z'
          }
        ];
        
        const mockFlaggedComments = [
          {
            id: 201,
            user: { name: 'Amit Patel', email: 'amit@example.com' },
            comment: 'This seems suspicious and potentially scammy...',
            context: 'In response to profile: Priya Sharma',
            reason: 'Spam',
            status: 'PENDING',
            severity: 'MEDIUM',
            createdAt: '2024-01-13T09:15:00Z'
          }
        ];
        
        setPendingProfiles(mockPendingProfiles);
        setFlaggedComments(mockFlaggedComments);
        
        // Calculate stats
        calculateStats(transformedContent, mockPendingProfiles, mockFlaggedComments);
      } else {
        setError(flaggedResponse.message || "Failed to fetch moderation content");
      }
    } catch (err) {
      console.error("Error fetching moderation content:", err);
      setError(err.message || "Error fetching moderation content");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine severity from content type
  const getSeverityFromType = (type) => {
    switch(type) {
      case 'PROFILE': return 'HIGH';
      case 'PHOTO': return 'MEDIUM';
      case 'COMMENT': return 'LOW';
      default: return 'MEDIUM';
    }
  };

  // Calculate stats
  const calculateStats = (reported, profiles, comments) => {
    const totalPending = (profiles?.length || 0) + 
                        (reported?.filter(r => r.status === 'PENDING')?.length || 0) +
                        (comments?.length || 0);
    
    setStats({
      totalPending,
      pendingProfiles: profiles?.length || 0,
      reportedContent: reported?.filter(r => r.status === 'PENDING')?.length || 0,
      flaggedComments: comments?.length || 0
    });
  };

  // Handle moderation action
  const handleModerationAction = async (type, id, action) => {
    try {
      setError(null);
      
      // For flagged content, use the actual API endpoint
      if (type === 'reported') {
        const response = await adminService.moderateContent(id, action, moderationReason);
        
        if (response.success) {
          // Remove the item from the list
          setReportedContent(prev => prev.filter(item => item.id !== id));
          alert("Content moderated successfully!");
        } else {
          alert(response.message || "Failed to moderate content");
          return;
        }
      } else {
        // For profiles and comments, simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (type === 'profile') {
          setPendingProfiles(prev => prev.filter(user => user.id !== id));
        } else if (type === 'comment') {
          setFlaggedComments(prev => prev.filter(comment => comment.id !== id));
        }
        
        alert(`Content ${action} successfully!`);
      }
      
      setShowDetailModal(false);
      setModerationReason('');
      
      // Refresh stats
      fetchModerationContent();
    } catch (err) {
      console.error("Error processing moderation action:", err);
      alert(err.message || "Error processing moderation action");
    }
  };

  const handleViewDetails = (item, type) => {
    setSelectedItem({ ...item, type });
    setShowDetailModal(true);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      LOW: 'bg-green-100 text-green-800 border-green-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
      CRITICAL: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      UNDER_REVIEW: 'bg-blue-100 text-blue-800',
      RESOLVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Initialize data
  useEffect(() => {
    fetchModerationContent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading moderation content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="mb-4">{error}</p>
        <button
          onClick={fetchModerationContent}
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
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-red-500">
          <div className="text-xl md:text-2xl font-bold text-red-600 mb-1 md:mb-2">{stats.totalPending}</div>
          <div className="text-xs md:text-sm text-gray-600">Total Pending</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-yellow-500">
          <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1 md:mb-2">{stats.pendingProfiles}</div>
          <div className="text-xs md:text-sm text-gray-600">Profiles</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-blue-500">
          <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-2">{stats.reportedContent}</div>
          <div className="text-xs md:text-sm text-gray-600">Reported Content</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-purple-500">
          <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1 md:mb-2">{stats.flaggedComments}</div>
          <div className="text-xs md:text-sm text-gray-600">Flagged Comments</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {[
              { id: 'profiles', label: 'Profile Approvals', count: stats.pendingProfiles, icon: '👤' },
              { id: 'reported', label: 'Reported Content', count: stats.reportedContent, icon: '🚩' },
              { id: 'comments', label: 'Flagged Comments', count: stats.flaggedComments, icon: '💬' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center flex-1 min-w-0 py-3 px-4 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 md:p-6">
          {/* Profile Approvals */}
          {activeTab === 'profiles' && (
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-800">Pending Profile Approvals</h3>
              {pendingProfiles.length > 0 ? (
                pendingProfiles.map(user => (
                  <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg gap-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                        {user.name?.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        <p className="text-xs text-gray-400">Registered: {formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleViewDetails(user, 'profile')}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleModerationAction('profile', user.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleModerationAction('profile', user.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 md:py-8 text-gray-500">
                  <div className="text-3xl md:text-4xl mb-3 md:mb-4">✅</div>
                  <p className="text-base md:text-lg">No pending profile approvals</p>
                  <p className="text-sm">All profiles have been moderated</p>
                </div>
              )}
            </div>
          )}

          {/* Reported Content */}
          {activeTab === 'reported' && (
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-800">Reported Content</h3>
              {reportedContent.length > 0 ? (
                reportedContent.map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg gap-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-sm">🚩</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-medium text-gray-800 truncate">{item.user.name}</p>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getSeverityColor(item.severity)}`}>
                            {item.severity}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{item.reason}</p>
                        <p className="text-xs text-gray-400">Reported by: {item.reportedBy.name} • {formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleViewDetails(item, 'reported')}
                      >
                        Investigate
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleModerationAction('reported', item.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleModerationAction('reported', item.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 md:py-8 text-gray-500">
                  <div className="text-3xl md:text-4xl mb-3 md:mb-4">✅</div>
                  <p className="text-base md:text-lg">No reported content</p>
                  <p className="text-sm">All reports have been addressed</p>
                </div>
              )}
            </div>
          )}

          {/* Flagged Comments */}
          {activeTab === 'comments' && (
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-800">Flagged Comments</h3>
              {flaggedComments.length > 0 ? (
                flaggedComments.map(comment => (
                  <div key={comment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg gap-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-yellow-600 text-sm">💬</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-medium text-gray-800 truncate">{comment.user.name}</p>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getSeverityColor(comment.severity)}`}>
                            {comment.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{comment.comment}</p>
                        <p className="text-xs text-gray-400">{comment.context} • {formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleViewDetails(comment, 'comment')}
                      >
                        Review
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleModerationAction('comment', comment.id, 'removed', comment)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 md:py-8 text-gray-500">
                  <div className="text-3xl md:text-4xl mb-3 md:mb-4">✅</div>
                  <p className="text-base md:text-lg">No flagged comments</p>
                  <p className="text-sm">All comments have been reviewed</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Content Review Details
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {selectedItem.type === 'profile' && (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-semibold">
                      {selectedItem.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{selectedItem.name}</h4>
                      <p className="text-sm text-gray-600">{selectedItem.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Status:</span>
                      <span className="ml-2 text-yellow-600">Pending Approval</span>
                    </div>
                    <div>
                      <span className="font-medium">Registered:</span>
                      <span className="ml-2">{formatDate(selectedItem.createdAt)}</span>
                    </div>
                  </div>
                </>
              )}

              {selectedItem.type === 'reported' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Reported User:</span>
                      <p className="mt-1 font-medium">{selectedItem.user.name}</p>
                      <p className="text-gray-600">{selectedItem.user.email}</p>
                    </div>
                    <div>
                      <span className="font-medium">Reported By:</span>
                      <p className="mt-1 font-medium">{selectedItem.reportedBy.name}</p>
                      <p className="text-gray-600">{selectedItem.reportedBy.email}</p>
                    </div>
                    <div>
                      <span className="font-medium">Reason:</span>
                      <p className="mt-1 font-medium">{selectedItem.reason}</p>
                    </div>
                    <div>
                      <span className="font-medium">Severity:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getSeverityColor(selectedItem.severity)}`}>
                        {selectedItem.severity}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="mt-1 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {selectedItem.description}
                    </p>
                  </div>
                </>
              )}

              {selectedItem.type === 'comment' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">User:</span>
                      <p className="mt-1 font-medium">{selectedItem.user.name}</p>
                      <p className="text-gray-600">{selectedItem.user.email}</p>
                    </div>
                    <div>
                      <span className="font-medium">Severity:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getSeverityColor(selectedItem.severity)}`}>
                        {selectedItem.severity}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Comment:</span>
                    <p className="mt-1 text-sm text-gray-700 bg-gray-50 p-3 rounded italic">
                      "{selectedItem.comment}"
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Context:</span>
                    <p className="mt-1 text-sm text-gray-600">{selectedItem.context}</p>
                  </div>
                </>
              )}

              {/* Moderation Reason Input */}
              {(selectedItem.type === 'reported' || selectedItem.type === 'comment') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moderation Reason (Optional)
                  </label>
                  <textarea
                    value={moderationReason}
                    onChange={(e) => setModerationReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                    rows="2"
                    placeholder="Enter reason for moderation action..."
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDetailModal(false);
                  setModerationReason('');
                }}
              >
                Close
              </Button>
              {selectedItem.type === 'profile' && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => handleModerationAction('profile', selectedItem.id, 'approved', selectedItem)}
                  >
                    Approve Profile
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleModerationAction('profile', selectedItem.id, 'rejected', selectedItem)}
                  >
                    Reject Profile
                  </Button>
                </>
              )}
              {selectedItem.type === 'reported' && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => handleModerationAction('reported', selectedItem.id, 'approved', selectedItem)}
                  >
                    Approve Content
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleModerationAction('reported', selectedItem.id, 'rejected', selectedItem)}
                  >
                    Reject Report
                  </Button>
                </>
              )}
              {selectedItem.type === 'comment' && (
                <Button
                  variant="primary"
                  onClick={() => handleModerationAction('comment', selectedItem.id, 'removed', selectedItem)}
                >
                  Remove Comment
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={fetchModerationContent}
          className="flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Moderation Queue
        </Button>
      </div>
    </div>
  );
}

export default ContentModeration;