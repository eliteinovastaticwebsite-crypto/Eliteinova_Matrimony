import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import adminService from "../../../services/adminService";

function UserManagement() {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterMembership, setFilterMembership] = useState("ALL");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;
  
  // Filters state
  const [filters, setFilters] = useState({
    status: "",
    membership: "",
    search: "",
  });

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    
    const params = {
      page: currentPage,
      size: pageSize,
      ...(filters.status && filters.status !== "ALL" && { status: filters.status }),
      ...(filters.membership && filters.membership !== "ALL" && { membership: filters.membership }),
      ...(filters.search && { search: filters.search }),
    };

    console.log('🔍 Fetching users with params:', params);
    
    const response = await adminService.getUsers(params);
    console.log('📥 Received response:', response);
    
    // Handle the response based on its structure
    if (response && response.success) {
      // Response has "users" array, not "data" or "content"
      const usersArray = response.users || [];
      const totalPages = response.totalPages || 1;
      const totalItems = response.totalItems || usersArray.length;
      
      console.log(`📊 Setting ${usersArray.length} users, ${totalPages} pages`);
      
      setUsers(usersArray);
      setTotalPages(totalPages);
      setTotalElements(totalItems);
    } else {
      // Handle error case
      const errorMessage = response?.message || "Failed to fetch users";
      console.error('❌ API error:', errorMessage);
      throw new Error(errorMessage);
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    setError(err.message || "Failed to load users. Please try again.");
    toast.error("Failed to load users");
  } finally {
    setLoading(false);
  }
}, [currentPage, filters]);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Apply filters with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({
        status: filterStatus,
        membership: filterMembership,
        search: searchTerm,
      });
      setCurrentPage(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, filterMembership]);

  // Handle user actions
  const handleBlockUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const action = newStatus === "INACTIVE" ? "block" : "unblock";
    
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      // Option 1: Use blockUser if endpoint exists
      // const response = await adminService.blockUser(userId);

      // Option 2: Use updateUserStatus (more reliable)
      const response = await adminService.updateUserStatus(userId, newStatus);  // CONSIDER THIS
      
      if (response.success) {
        toast.success(`User ${action}ed successfully`);
        
        // Update local state
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, status: newStatus }
            : user
        ));
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error(`Error ${action}ing user:`, err);
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await adminService.deleteUser(userId);
      
      if (response.success) {
        toast.success("User deleted successfully");
        
        // Remove from local state
        setUsers(users.filter(user => user.id !== userId));
        setTotalElements(prev => prev - 1);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user");
    }
  };

  const handleViewUser = (userId) => {
    // Navigate to user details page or open modal
    window.location.href = `/admin/users/${userId}`;
    // Or use your router: navigate(`/admin/users/${userId}`);
  };

  const handleEditUser = (userId) => {
    // Open edit modal or navigate to edit page
    console.log("Edit user:", userId);
    // Implement your edit modal logic here
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter users locally for display (if backend doesn't support filtering)
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id?.toString().includes(searchTerm);
    
    const matchesStatus = filterStatus === "ALL" || user.status === filterStatus;
    const matchesMembership = filterMembership === "ALL" || 
      (user.membershipPlan?.planName || "FREE") === filterMembership;
    
    return matchesSearch && matchesStatus && matchesMembership;
  });

  // Format membership display
  const getMembershipDisplay = (user) => {
  return user.membership || "FREE";
};

  // Render loading state
  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && users.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Users</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button 
          variant="primary" 
          onClick={fetchUsers}
          className="px-4 py-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">User Management</h2>
              <p className="text-sm text-gray-600">
                {totalElements} user{totalElements !== 1 ? 's' : ''} total
                {loading && users.length > 0 && " • Updating..."}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
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
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="INACTIVE">Inactive</option>
                <option value="BLOCKED">Blocked</option>
              </select>
              
              <select
                value={filterMembership}
                onChange={(e) => setFilterMembership(e.target.value)}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm md:text-base"
              >
                <option value="ALL">All Plans</option>
                <option value="FREE">Free</option>
                <option value="SILVER">Silver</option>
                <option value="GOLD">Gold</option>
                <option value="DIAMOND">Diamond</option>
              </select>
              
              <Button
                variant="secondary"
                onClick={fetchUsers}
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
          {loading && users.length > 0 && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          )}
          
          <div className="overflow-x-auto relative">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">ID</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">User</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">Status</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700 hidden sm:table-cell">Membership</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">Created</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 md:py-3 px-2 md:px-4 text-xs text-gray-500">
                      #{user.id}
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 text-sm">
                          {user.name?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm md:text-base truncate">
                            {user.name || "Unknown User"}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500 truncate">
                            {user.email || "No email"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {user.mobile || "No mobile"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : user.status === 'INACTIVE'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 hidden sm:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getMembershipDisplay(user) === 'DIAMOND'
                          ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800'
                          : getMembershipDisplay(user) === 'GOLD'
                          ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800'
                          : getMembershipDisplay(user) === 'SILVER'
                          ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getMembershipDisplay(user)}
                      </span>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-xs text-gray-500">
                      {new Date(user.createdAt || user.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4">
                      <div className="flex gap-1 md:gap-2 flex-wrap">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleViewUser(user.id)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleEditUser(user.id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant={user.status === 'ACTIVE' ? 'danger' : 'success'}
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleBlockUser(user.id, user.status)}
                        >
                          {user.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                        </Button>
                        <Button 
                          variant="danger"
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">👥</div>
              <p className="text-base md:text-lg">No users found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing page {currentPage + 1} of {totalPages} • {totalElements} total users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0 || loading}
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i;
                  } else if (currentPage <= 2) {
                    pageNum = i;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                      className="min-w-[40px]"
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1 || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;