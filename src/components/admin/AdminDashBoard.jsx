import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import adminService from "../../services/adminService";
import officeAuthService from "../../services/officeAuthService";
import {
  BellIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// Import all separate components
import DashboardOverview from "./components/DashboardOverview";
import UserManagement from "./components/UserManagement";
import ProfileVerification from "./components/ProfileVerification";
import UserReports from "./components/UserReports";
import MatchAnalytics from "./components/MatchAnalytics";
import CompatibilityAnalytics from "./components/CompatibilityAnalytics";
import SuccessStories from "./components/SuccessStories";
import MembershipManagement from "./components/MembershipManagement";
import PaymentsManagement from "./components/PaymentsManagement";
import RevenueAnalytics from "./components/RevenueAnalytics";
import ContentModeration from "./components/ContentModeration";
import ProfileManagement from "./components/ProfileManagement";
import PhotoApproval from "./components/PhotoApproval";
import GeographicAnalytics from "./components/GeographicAnalytics";
import UserBehaviorAnalytics from "./components/UserBehaviorAnalytics";
import EngagementMetrics from "./components/EngagementMetrics";
import AdminOfficeUserManagement from "./components/AdminOfficeUserManagement";

import { getMenuItemsByRole } from "./components/SidebarConfig";

export function AdminDashBoard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const isNavigatingRef = useRef(false);

  const getCurrentRole = () => {
  // Check for office token first
  if (localStorage.getItem('officeToken')) {
    return 'OFFICE';
  }
  
  // Check for admin user
  const adminUser = adminService.getAdminUser();
  if (adminUser?.role) {
    return adminUser.role;
  }
  
  // Fallback: check if admin token exists
  if (localStorage.getItem('adminToken')) {
    return 'ADMIN';
  }
  
  return null;
};

const role = getCurrentRole();
const menuItems = getMenuItemsByRole(role);


  // Handle logout confirmation
  const handleLogout = async () => {
    try {
      if (role === 'OFFICE') {
        await officeAuthService.logout();
      } else {
        await adminService.logout();
        window.location.href = '/admin-login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Clear data even if API call fails
      if (role === 'OFFICE') {
        officeAuthService.clearOfficeData();
        window.location.href = '/office-login';
      } else {
        adminService.clearAdminData();
        window.location.href = '/admin-login';
      }
    }
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    if (pendingNavigation) {
      isNavigatingRef.current = true;
      handleLogout();
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
    setPendingNavigation(null);
    // Push current location to prevent navigation
    if (pendingNavigation) {
      window.history.pushState(null, '', location.pathname);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    fetchDashboardData();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navigation guard for browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      // Skip if we're programmatically navigating
      if (isNavigatingRef.current) {
        isNavigatingRef.current = false;
        return;
      }

      // Show confirmation dialog
      event.preventDefault();
      window.history.pushState(null, '', location.pathname);
      setPendingNavigation(true);
      setShowLogoutConfirm(true);
    };

    // Push current state to history
    window.history.pushState(null, '', location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  // Handle browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message = 'Do you want to logout? Your session will be cleared.';
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const fetchDashboardData = async () => {
  try {
    setLoading(true);

    const statsResult = await adminService.getDashboardStats();
    setStats(statsResult);

    if (role === "ADMIN") {
      const [usersResult, membershipsResult] = await Promise.all([
        adminService.getUsers(),
        adminService.getMembershipPlans()
      ]);

      setUsers(usersResult.users || []);
      setMemberships(membershipsResult.plans || []);
    }

  } catch (err) {
    setError("Failed to load dashboard");
  } finally {
    setLoading(false);
  }
}

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (isMobile) setSidebarOpen(false);
  };

  const handleUserAction = async (action, userId, data) => {
    try {
      switch (action) {
        case 'updateStatus':
          await adminService.updateUserStatus(userId, data.status);
          break;
        case 'delete':
          await adminService.deleteUser(userId);
          break;
        case 'bulkUpdate':
          await adminService.bulkUpdateUsers(data.userIds, data.action);
          break;
        default:
          console.warn('Unknown action:', action);
      }
      
      // Refresh data after action
      fetchDashboardData();
      return { success: true };
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      return { 
        success: false, 
        error: err.message || err.error || `Failed to perform ${action}` 
      };
    }
  };

  const handleMembershipAction = async (action, planId, data) => {
    try {
      switch (action) {
        case 'create':
          await adminService.createMembershipPlan(data);
          break;
        case 'update':
          await adminService.updateMembershipPlan(planId, data);
          break;
        case 'delete':
          await adminService.deleteMembershipPlan(planId);
          break;
        default:
          console.warn('Unknown action:', action);
      }
      
      fetchDashboardData();
      return { success: true };
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      return { 
        success: false, 
        error: err.message || err.error || `Failed to perform ${action}` 
      };
    }
  };

  const handleVerificationAction = async (userId, status, notes) => {
    try {
      await adminService.verifyProfile(userId, status, notes);
      fetchDashboardData();
      return { success: true };
    } catch (err) {
      console.error('Error verifying profile:', err);
      return { 
        success: false, 
        error: err.message || err.error || 'Failed to verify profile' 
      };
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Vertical Sidebar */}
      <div className={`
        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-20'} 
        bg-white shadow-lg transition-all duration-300 flex flex-col
        fixed md:relative z-50 h-full md:h-auto
      `}>
        <div className="p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">
                {role === "ADMIN" ? "Admin Panel" : "Office Panel"}
              </h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors text-lg ${
                !sidebarOpen && isMobile ? 'hidden' : ''
              }`}
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
          {menuItems.map((section, index) => (
            <div key={index} className="py-1 md:py-2">
              {sidebarOpen && (
                <h3 className="px-4 md:px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.category}
                </h3>
              )}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center px-4 md:px-6 py-3 text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg mr-3 min-w-6 flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="font-medium text-sm md:text-base truncate">
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-medium">A</span>
              </div>
              <div>
                <p className="text-sm font-medium">
  {role === "ADMIN" ? "Admin User" : "Office User"}
</p>
<p className="text-xs text-gray-500">
  {role}
</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto min-w-0 transition-all duration-300 scrollbar-hide">
        {/* Mobile Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-5 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-lg"
                >
                  {sidebarOpen ? '✕' : '☰'}
                </button>
              )}
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {role === "ADMIN" ? "Admin Dashboard" : "Office Dashboard"}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {error && (
                <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <button 
                onClick={() => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('officeToken');
  localStorage.removeItem('adminUser');
  localStorage.removeItem('officeUser');
  localStorage.removeItem('role');
  
  // Redirect based on current role
  if (role === 'OFFICE') {
    window.location.href = '/office-login';
  } else {
    window.location.href = '/admin-login';
  }
}}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Render active component based on tab */}
          {activeTab === "overview" && (
            <DashboardOverview 
              stats={stats} 
              users={users} 
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "users" && (
            <UserManagement 
              users={users} 
              onRefresh={fetchDashboardData}
              onUserAction={handleUserAction}
            />
          )}
          
          {activeTab === "verification" && (
            <ProfileVerification 
              users={users} 
              onVerification={handleVerificationAction}
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "reports" && (
            <UserReports 
              users={users} 
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "matches" && (
            <MatchAnalytics 
              stats={stats} 
              users={users} 
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "compatibility" && (
            <CompatibilityAnalytics 
              users={users} 
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "success" && (
            <SuccessStories 
              users={users} 
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "memberships" && (
            <MembershipManagement 
              memberships={memberships} 
              onRefresh={fetchDashboardData}
              onMembershipAction={handleMembershipAction}
            />
          )}
          
          {activeTab === "payments" && (
            <PaymentsManagement 
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "revenue" && (
            <RevenueAnalytics 
              stats={stats} 
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "moderation" && (
            <ContentModeration 
              users={users} 
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "profiles" && (
            <ProfileManagement 
              users={users} 
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "photos" && (
            <PhotoApproval 
              users={users} 
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "geography" && (
            <GeographicAnalytics 
              users={users} 
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "behavior" && (
            <UserBehaviorAnalytics 
              users={users} 
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "engagement" && (
            <EngagementMetrics 
              users={users} 
              onRefresh={fetchDashboardData}
            />
          )}
          
          {activeTab === "office-users" && (
            <AdminOfficeUserManagement />
          )}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Confirm Logout</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Do you want to logout? Your session will be cleared and you will be redirected to the login page.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashBoard;