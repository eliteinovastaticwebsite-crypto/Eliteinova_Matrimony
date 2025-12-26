import { useState, useEffect, useCallback } from "react";
import Button from "../../ui/Button";
import adminService from "../../../services/adminService";

function UserReports() {
  // State variables
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [error, setError] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  
  // Stats
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    investigatingReports: 0,
    criticalReports: 0
  });

  // Fetch reports from REAL backend
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📤 Fetching reports from real backend...');
      
      // Call real backend API
      const response = await adminService.getUserReports();
      console.log('📥 Real backend reports response:', response);
      
      if (response.success && response.reports) {
        // Transform backend data to match frontend structure
        const transformedReports = response.reports.map((report) => {
          // Get reporter info from backend
          const reporterInfo = {
            id: report.reporterId || 0,
            name: report.reportedBy || 'Unknown Reporter',
            email: report.reporterEmail || 'reporter@example.com',
            membership: report.reporterMembership || 'FREE'
          };
          
          // Get reported user info from backend
          const reportedUserInfo = {
            id: report.reportedUserId || 0,
            name: report.reportedUser || 'Unknown User',
            email: report.reportedUserEmail || 'reported@example.com',
            membership: report.reportedUserMembership || 'FREE'
          };
          
          // Map category from reason
          const category = getCategoryFromReason(report.reason);
          
          return {
            id: report.id,
            reporter: reporterInfo,
            reportedUser: reportedUserInfo,
            reason: report.reason || 'Unknown Reason',
            description: report.description || 'No description provided',
            status: report.status || 'PENDING',
            severity: report.severity || 'MEDIUM',
            category: category,
            evidence: report.evidence || ['No evidence provided'],
            resolutionNotes: report.resolutionNotes || '',
            createdAt: report.reportedAt || report.createdAt || new Date().toISOString(),
            updatedAt: report.updatedAt || new Date().toISOString(),
            resolvedAt: report.resolvedAt,
            resolvedBy: report.resolvedBy,
            // Keep original backend data for reference
            backendData: report
          };
        });
        
        setReports(transformedReports);
        console.log('✅ Successfully loaded', transformedReports.length, 'reports from backend');
        
        // Fetch stats separately
        fetchReportStats();
        
      } else {
        setError('No reports found in backend response');
      }
    } catch (error) {
      console.error('❌ Error fetching reports from backend:', error);
      setError(`Failed to load reports: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch report statistics
  const fetchReportStats = async () => {
    try {
      // This endpoint should exist in your backend
      const response = await adminService.getReportStats();
      if (response.success) {
        setStats({
          totalReports: response.totalReports || 0,
          pendingReports: response.pendingReports || 0,
          investigatingReports: response.investigatingReports || 0,
          criticalReports: response.criticalReports || 0
        });
      }
    } catch (error) {
      console.error('Error fetching report stats:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Helper functions
  const getCategoryFromReason = (reason) => {
    if (!reason) return 'OTHER';
    
    const reasonLower = reason.toLowerCase();
    if (reasonLower.includes('fake') || reasonLower.includes('profile')) {
      return 'PROFILE_AUTHENTICITY';
    } else if (reasonLower.includes('harassment') || reasonLower.includes('behavior')) {
      return 'BEHAVIOR';
    } else if (reasonLower.includes('photo') || reasonLower.includes('image') || reasonLower.includes('content')) {
      return 'PROFILE_CONTENT';
    } else if (reasonLower.includes('spam')) {
      return 'SPAM';
    } else {
      return 'OTHER';
    }
  };

  // Handle report actions
  const handleReportAction = async (reportId, action, notes = '') => {
    if (!window.confirm(`Are you sure you want to ${action} this report?`)) {
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      console.log(`🔄 Processing ${action} for report ${reportId} with backend...`);
      
      // Call REAL backend API for report resolution
      const response = await adminService.resolveReport(reportId, action, notes);
      console.log('✅ Backend response for action:', response);
      
      if (response.success) {
        // Update local state
        setReports(prev => 
          prev.map(report => 
            report.id === reportId 
              ? { 
                  ...report, 
                  status: response.newStatus || report.status,
                  updatedAt: new Date().toISOString(),
                  resolutionNotes: notes || report.resolutionNotes
                }
              : report
          )
        );
        
        alert(`✅ Report ${action}ed successfully`);
        
        // Refresh stats
        fetchReportStats();
        
        // Close modal for final actions
        if (action === 'resolve' || action === 'reject') {
          setShowDetailModal(false);
          setResolutionNotes('');
        }
      } else {
        throw new Error(response.message || 'Backend error');
      }
    } catch (error) {
      console.error('❌ Error processing report action:', error);
      setError(`Failed to ${action} report: ${error.message || 'Unknown error'}`);
      alert(`❌ Failed to ${action} report`);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle viewing report details
  const handleViewDetails = async (report) => {
    try {
      // Optionally fetch detailed report data
      if (report.id) {
        const detailedResponse = await adminService.getReportById(report.id);
        if (detailedResponse.success && detailedResponse.report) {
          const detailedReport = detailedResponse.report;
          // Transform detailed report if needed
          const transformedReport = {
            ...report,
            reporter: detailedReport.reporter || report.reporter,
            reportedUser: detailedReport.reportedUser || report.reportedUser,
            description: detailedReport.description || report.description,
            evidence: detailedReport.evidence || report.evidence
          };
          setSelectedReport(transformedReport);
        } else {
          setSelectedReport(report);
        }
      } else {
        setSelectedReport(report);
      }
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching report details:', error);
      setSelectedReport(report);
      setShowDetailModal(true);
    }
  };

  // Delete a report
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      // You need to add deleteReport method to adminService.js
      const response = await adminService.deleteReport(reportId);
      if (response.success) {
        setReports(prev => prev.filter(report => report.id !== reportId));
        alert('✅ Report deleted successfully');
        fetchReportStats();
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('❌ Failed to delete report');
    } finally {
      setActionLoading(false);
    }
  };

  // UI Helper functions
  const getSeverityColor = (severity) => {
    const colors = {
      'LOW': 'bg-green-100 text-green-800 border-green-200',
      'MEDIUM': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'HIGH': 'bg-orange-100 text-orange-800 border-orange-200',
      'CRITICAL': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'UNDER_REVIEW': 'bg-blue-100 text-blue-800',
      'INVESTIGATING': 'bg-blue-100 text-blue-800',
      'RESOLVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'PROFILE_CONTENT': '📷',
      'BEHAVIOR': '🚫',
      'PROFILE_AUTHENTICITY': '👤',
      'SPAM': '📧',
      'SAFETY': '🛡️',
      'OTHER': '📋'
    };
    return icons[category] || '📋';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Filter reports locally
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === "" || 
      report.reportedUser.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "ALL" || report.status === filterStatus;
    const matchesSeverity = filterSeverity === "ALL" || report.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  // Loading Spinner
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading reports from backend...</p>
      </div>
    </div>
  );

  // Render loading state
  if (loading && reports.length === 0) {
    return <LoadingSpinner />;
  }

  // Render error state
  if (error && reports.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Reports</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button 
          variant="primary" 
          onClick={fetchReports}
          className="px-4 py-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-500">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-blue-500">
          <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-2">
            {stats.totalReports}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Total Reports</div>
          <div className="text-xs text-gray-500 mt-1">From Database</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-yellow-500">
          <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1 md:mb-2">
            {stats.pendingReports}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Pending</div>
          <div className="text-xs text-gray-500 mt-1">Requires Action</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-orange-500">
          <div className="text-xl md:text-2xl font-bold text-orange-600 mb-1 md:mb-2">
            {stats.investigatingReports}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Investigating</div>
          <div className="text-xs text-gray-500 mt-1">Under Review</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-red-500">
          <div className="text-xl md:text-2xl font-bold text-red-600 mb-1 md:mb-2">
            {stats.criticalReports}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Critical</div>
          <div className="text-xs text-gray-500 mt-1">High Priority</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">User Reports</h2>
              <p className="text-sm text-gray-600">
                Managing {reports.length} reports from backend database
              </p>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm md:text-base w-full"
              />
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm md:text-base"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm md:text-base"
              >
                <option value="ALL">All Severity</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
              
              <Button 
                variant="secondary" 
                size="sm"
                onClick={fetchReports}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Loading overlay */}
          {loading && reports.length > 0 && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          )}
          
          {/* Backend Data Info */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              📊 Displaying <span className="font-bold">{filteredReports.length}</span> reports from backend database. 
              Total in system: <span className="font-bold">{reports.length}</span>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              ✅ Connected to real backend API. Report IDs: {reports.map(r => r.id).join(', ')}
            </p>
          </div>

          {/* Reports Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">Report Details</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell">Category</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">Severity</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700 hidden md:table-cell">Status</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">Date</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getCategoryIcon(report.category)}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {report.reportedUser.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Reported by: {report.reporter.name}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 truncate lg:hidden">
                          {report.category.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 truncate sm:hidden">
                          {report.reason}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-900 capitalize">
                        {report.category.replace('_', ' ').toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4 hidden md:table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <span className="text-xs text-gray-500">
                        {formatDate(report.createdAt)}
                      </span>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleViewDetails(report)}
                          disabled={actionLoading}
                        >
                          Details
                        </Button>
                        {report.status === 'PENDING' && (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => handleReportAction(report.id, 'review', 'Marked for review')}
                            disabled={actionLoading}
                          >
                            Review
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl md:text-5xl mb-4">📭</div>
              <p className="text-lg md:text-xl font-medium text-gray-600 mb-2">No reports found</p>
              <p className="text-sm md:text-base">
                {filterStatus === 'ALL' 
                  ? 'No user reports in the database' 
                  : `No ${filterStatus.toLowerCase()} reports in the database`
                }
              </p>
              <Button 
                variant="secondary" 
                className="mt-4"
                onClick={fetchReports}
              >
                Check Again
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Report Investigation - #{selectedReport.id}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={actionLoading}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Backend Data Info */}
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  ✅ This report is loaded from the backend database. Report ID: {selectedReport.id}
                </p>
              </div>

              {/* Report Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Reporter Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span className="font-medium">{selectedReport.reporter.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span className="text-gray-600">{selectedReport.reporter.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Membership:</span>
                      <span className="text-gray-600">{selectedReport.reporter.membership}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Reported At:</span>
                      <span className="text-gray-600">{formatDate(selectedReport.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Reported User</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span className="font-medium">{selectedReport.reportedUser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span className="text-gray-600">{selectedReport.reportedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Membership:</span>
                      <span className="text-gray-600">{selectedReport.reportedUser.membership}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">User ID:</span>
                      <span className="text-gray-600">{selectedReport.reportedUser.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Details */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Report Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Reason:</span>
                    <p className="text-gray-600 font-medium">{selectedReport.reason}</p>
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-gray-600 capitalize">
                      {selectedReport.category.replace('_', ' ').toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Severity:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(selectedReport.severity)}`}>
                      {selectedReport.severity}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                  {selectedReport.description}
                </p>
              </div>

              {/* Evidence */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Evidence</h4>
                <div className="border border-gray-200 rounded-lg p-4">
                  {selectedReport.evidence && selectedReport.evidence.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedReport.evidence.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No evidence provided</p>
                  )}
                </div>
              </div>

              {/* Resolution Notes (if any) */}
              {selectedReport.resolutionNotes && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Resolution Notes</h4>
                  <p className="text-gray-600 text-sm bg-blue-50 p-4 rounded-lg">
                    {selectedReport.resolutionNotes}
                  </p>
                </div>
              )}

              {/* Add Resolution Notes */}
              {selectedReport.status !== 'RESOLVED' && selectedReport.status !== 'REJECTED' && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Resolution Notes (Optional)</h4>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Add notes about the resolution..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
                    rows="3"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Backend Report ID: #{selectedReport.id} • Created: {formatDate(selectedReport.createdAt)}
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowDetailModal(false)}
                  disabled={actionLoading}
                >
                  Close
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => handleDeleteReport(selectedReport.id)}
                  disabled={actionLoading}
                >
                  Delete
                </Button>
                
                {selectedReport.status !== 'REJECTED' && (
                  <Button
                    variant="secondary"
                    onClick={() => handleReportAction(selectedReport.id, 'reject', resolutionNotes)}
                    disabled={actionLoading}
                  >
                    Reject Report
                  </Button>
                )}
                
                {selectedReport.status === 'PENDING' && (
                  <Button
                    variant="primary"
                    onClick={() => handleReportAction(selectedReport.id, 'review', resolutionNotes || 'Marked for review')}
                    disabled={actionLoading}
                  >
                    Mark Investigating
                  </Button>
                )}
                
                <Button
                  variant="primary"
                  onClick={() => handleReportAction(selectedReport.id, 'resolve', resolutionNotes)}
                  disabled={actionLoading}
                >
                  Resolve Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserReports;