import axiosAdmin from '../api/axiosAdmin';        // For admin auth endpoints
import axiosDashboard from '../api/axiosDashboard'; // For dashboard endpoints

const adminService = {
  // ==================== AUTH TOKEN MANAGEMENT ====================
  setAuthToken: (token, user) => {
    if (token && user) {
      console.log('🔑 Setting admin auth token for:', user.email);
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
    } else {
      console.log('🔑 Removing admin auth data');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  },

  getAuthToken: () => {
    return localStorage.getItem('adminToken');
  },

  getAdminUser: () => {
    const adminStr = localStorage.getItem('adminUser');
    return adminStr ? JSON.parse(adminStr) : null;
  },

  clearAdminData: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  // ==================== ADMIN AUTHENTICATION ====================
  login: async (email, password) => {
    try {
      console.log('🔐 Admin login attempt:', email);
      
      const response = await axiosAdmin.post('/api/admin/auth/login', {
        email,
        password
      });
      
      if (response.data.success && response.data.token) {
        adminService.setAuthToken(response.data.token, response.data.admin);
        console.log('✅ Admin login successful:', response.data.admin.name);
      }
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Admin login error:', error);
      throw error.response?.data || { 
        success: false, 
        error: 'Admin login failed' 
      };
    }
  },

  logout: async () => {
    try {
      await axiosAdmin.post('/api/admin/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      adminService.clearAdminData();
    }
  },

  checkAuth: async () => {
    try {
      const token = adminService.getAuthToken();
      if (!token) {
        return { success: false, authenticated: false };
      }

      const response = await axiosAdmin.get('/api/admin/auth/check');
      
      if (response.data.authenticated && !response.data.role) {
        const adminUser = adminService.getAdminUser();
        response.data.role = adminUser?.role || 'ADMIN';
      }
      
      return response.data;
      
    } catch (error) {
      console.error('Auth check error:', error);
      return { success: false, authenticated: false };
    }
  },

  // ==================== PASSWORD RESET ====================
  forgotPassword: async (email) => {
    try {
      console.log('🔐 Requesting password reset for:', email);
      
      const response = await axiosAdmin.post('/api/admin/auth/forgot-password', {
        email
      });
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      throw error.response?.data || { 
        success: false, 
        error: 'Failed to request password reset' 
      };
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      console.log('🔐 Resetting password with token');
      
      const response = await axiosAdmin.post('/api/admin/auth/reset-password', {
        token,
        newPassword
      });
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Reset password error:', error);
      throw error.response?.data || { 
        success: false, 
        error: 'Failed to reset password' 
      };
    }
  },

  // ==================== DASHBOARD DATA ====================
  // ALL dashboard endpoints now use axiosDashboard
  getDashboardStats: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error.response?.data || { error: 'Failed to fetch dashboard stats' };
    }
  },

  // ==================== USER MANAGEMENT ====================
  getUsers: async (params = {}) => {
    try {
      console.log('📤 Fetching users with params:', params);
      
      const response = await axiosDashboard.get('/api/dashboard/users', { params });
      return response.data;
      
    } catch (error) {
      console.error('❌ Error in getUsers:', error);
      
      return {
        success: false,
        message: error.response?.data?.error || error.message || 'Failed to fetch users',
        users: []
      };
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axiosDashboard.get(`/api/dashboard/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error.response?.data || { error: 'Failed to fetch user' };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axiosDashboard.put(
        `/api/dashboard/users/${userId}`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error.response?.data || { error: 'Failed to update user' };
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      const response = await axiosDashboard.put(
        `/api/dashboard/users/${userId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error.response?.data || { error: 'Failed to update user status' };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axiosDashboard.delete(`/api/dashboard/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error.response?.data || { error: 'Failed to delete user' };
    }
  },

  bulkUpdateUsers: async (userIds, action) => {
    try {
      const response = await axiosDashboard.post('/api/dashboard/users/bulk-update', {
        userIds,
        action
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating users:', error);
      throw error.response?.data || { error: 'Failed to bulk update users' };
    }
  },

  // ==================== PROFILE MANAGEMENT ====================
  getUserProfiles: async (params = {}) => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/profiles', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error.response?.data || { error: 'Failed to fetch profiles' };
    }
  },

  getProfileById: async (profileId) => {
    try {
      const response = await axiosDashboard.get(`/api/dashboard/profiles/${profileId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error.response?.data || { error: 'Failed to fetch profile' };
    }
  },

  updateProfile: async (profileId, profileData) => {
    try {
      const response = await axiosDashboard.put(
        `/api/dashboard/profiles/${profileId}`,
        profileData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error.response?.data || { error: 'Failed to update profile' };
    }
  },

  // ==================== PROFILE VERIFICATION ====================
  getPendingVerifications: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/verifications/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
      throw error.response?.data || { error: 'Failed to fetch pending verifications' };
    }
  },

  verifyProfile: async (profileId, status, notes = '') => {
    try {
      const response = await axiosDashboard.post('/api/dashboard/verifications/verify', {
        profileId,
        status,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying profile:', error);
      throw error.response?.data || { error: 'Failed to verify profile' };
    }
  },

  // ==================== MEMBERSHIP MANAGEMENT ====================
  getMembershipPlans: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/membership-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      throw error.response?.data || { error: 'Failed to fetch membership plans' };
    }
  },

  createMembershipPlan: async (planData) => {
    try {
      const response = await axiosDashboard.post('/api/dashboard/membership-plans', planData);
      return response.data;
    } catch (error) {
      console.error('Error creating membership plan:', error);
      throw error.response?.data || { error: 'Failed to create membership plan' };
    }
  },

  updateMembershipPlan: async (planId, planData) => {
    try {
      const response = await axiosDashboard.put(
        `/api/dashboard/membership-plans/${planId}`,
        planData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating membership plan:', error);
      throw error.response?.data || { error: 'Failed to update membership plan' };
    }
  },

  deleteMembershipPlan: async (planId) => {
    try {
      const response = await axiosDashboard.delete(`/api/dashboard/membership-plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting membership plan:', error);
      throw error.response?.data || { error: 'Failed to delete membership plan' };
    }
  },

  // ==================== ANALYTICS ====================
  getGeographicAnalytics: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/analytics/geographic');
      return response.data;
    } catch (error) {
      console.error('Error fetching geographic analytics:', error);
      throw error.response?.data || { error: 'Failed to fetch geographic analytics' };
    }
  },

  getMatchAnalytics: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/analytics/matches');
      return response.data;
    } catch (error) {
      console.error('Error fetching match analytics:', error);
      throw error.response?.data || { error: 'Failed to fetch match analytics' };
    }
  },

  getDetailedMatchAnalytics: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/analytics/matches-detailed');
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed match analytics:', error);
      throw error.response?.data || { error: 'Failed to fetch detailed match analytics' };
    }
  },

  getUserBehaviorAnalytics: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/analytics/behavior');
      return response.data;
    } catch (error) {
      console.error('Error fetching behavior analytics:', error);
      throw error.response?.data || { error: 'Failed to fetch behavior analytics' };
    }
  },

  getEngagementMetrics: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/analytics/engagement');
      return response.data;
    } catch (error) {
      console.error('Error fetching engagement metrics:', error);
      throw error.response?.data || { error: 'Failed to fetch engagement metrics' };
    }
  },

  getCompatibilityAnalytics: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/analytics/compatibility');
      return response.data;
    } catch (error) {
      console.error('Error fetching compatibility analytics:', error);
      throw error.response?.data || { error: 'Failed to fetch compatibility analytics' };
    }
  },

  getRevenueAnalytics: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/analytics/revenue');
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error.response?.data || { error: 'Failed to fetch revenue analytics' };
    }
  },

  // ==================== REPORTS ====================
  getUserReports: async (page = 0, size = 20, status = null, severity = null, search = null) => {
    try {
      const params = { page, size };
      if (status) params.status = status;
      if (severity) params.severity = severity;
      if (search) params.search = search;
      
      const response = await axiosDashboard.get('/api/dashboard/reports', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user reports:', error);
      throw error.response?.data || { error: 'Failed to fetch user reports' };
    }
  },

  getReportStats: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/reports/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching report stats:', error);
      throw error.response?.data || { error: 'Failed to fetch report statistics' };
    }
  },

  getReportById: async (reportId) => {
    try {
      const response = await axiosDashboard.get(`/api/dashboard/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report details:', error);
      throw error.response?.data || { error: 'Failed to fetch report details' };
    }
  },

  resolveReport: async (reportId, action, notes = '') => {
    try {
      const response = await axiosDashboard.post('/api/dashboard/reports/resolve', {
        reportId,
        action,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error resolving report:', error);
      throw error.response?.data || { error: 'Failed to resolve report' };
    }
  },

  deleteReport: async (reportId) => {
    try {
      const response = await axiosDashboard.delete(`/api/dashboard/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error.response?.data || { error: 'Failed to delete report' };
    }
  },

  // ==================== SUCCESS STORIES ====================
  getSuccessStories: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/success-stories');
      return response.data;
    } catch (error) {
      console.error('Error fetching success stories:', error);
      throw error.response?.data || { error: 'Failed to fetch success stories' };
    }
  },

  approveSuccessStory: async (storyId) => {
    try {
      const response = await axiosDashboard.post(`/api/dashboard/success-stories/${storyId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving success story:', error);
      throw error.response?.data || { error: 'Failed to approve success story' };
    }
  },

  rejectSuccessStory: async (storyId, reason = '') => {
    try {
      const response = await axiosDashboard.post(`/api/dashboard/success-stories/${storyId}/reject`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting success story:', error);
      throw error.response?.data || { error: 'Failed to reject success story' };
    }
  },

  featureSuccessStory: async (storyId, featured = true) => {
    try {
      const response = await axiosDashboard.post(`/api/dashboard/success-stories/${storyId}/feature`, {
        featured
      });
      return response.data;
    } catch (error) {
      console.error('Error featuring success story:', error);
      throw error.response?.data || { error: 'Failed to update feature status' };
    }
  },

  // ==================== PAYMENT MANAGEMENT ====================
  getPayments: async (params = {}) => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/payments', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error.response?.data || { error: 'Failed to fetch payments' };
    }
  },

  getPaymentById: async (paymentId) => {
    try {
      const response = await axiosDashboard.get(`/api/dashboard/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error.response?.data || { error: 'Failed to fetch payment' };
    }
  },

  processRefund: async (paymentId, amount, reason = '') => {
    try {
      const response = await axiosDashboard.post(`/api/dashboard/payments/${paymentId}/refund`, {
        amount,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error.response?.data || { error: 'Failed to process refund' };
    }
  },

  exportPayments: async (params = {}) => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/payments/export', { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting payments:', error);
      throw error.response?.data || { error: 'Failed to export payments' };
    }
  },

  // ==================== CONTENT MODERATION ====================
  getFlaggedContent: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/moderation/flagged');
      return response.data;
    } catch (error) {
      console.error('Error fetching flagged content:', error);
      throw error.response?.data || { error: 'Failed to fetch flagged content' };
    }
  },

  moderateContent: async (contentId, action, reason = '') => {
    try {
      const response = await axiosDashboard.post('/api/dashboard/moderation/moderate', {
        contentId,
        action,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error moderating content:', error);
      throw error.response?.data || { error: 'Failed to moderate content' };
    }
  },

  // ==================== PHOTO APPROVAL ====================
  getPendingPhotos: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/photos/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending photos:', error);
      throw error.response?.data || { error: 'Failed to fetch pending photos' };
    }
  },

  approvePhoto: async (photoId, action, reason = '') => {
    try {
      const response = await axiosDashboard.post('/api/dashboard/photos/approve', {
        photoId,
        action,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error approving photo:', error);
      throw error.response?.data || { error: 'Failed to approve photo' };
    }
  },

  // ==================== ADMIN/OFFICE USER MANAGEMENT ====================
  createAdminOrOfficeUser: async (userData, role) => {
    try {
      const response = await axiosAdmin.post('/api/admin/users/create-user', {
        ...userData,
        role: role
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error.response?.data || { error: 'Failed to create user' };
    }
  },

  getAllAdminAndOfficeUsers: async () => {
    try {
      const response = await axiosAdmin.get('/api/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error.response?.data || { error: 'Failed to fetch users' };
    }
  },

  updateAdminOrOfficeUser: async (userId, userData) => {
    try {
      const response = await axiosAdmin.put(`/api/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error.response?.data || { error: 'Failed to update user' };
    }
  },

  deleteAdminOrOfficeUser: async (userId) => {
    try {
      const response = await axiosAdmin.delete(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error.response?.data || { error: 'Failed to delete user' };
    }
  },

  // ==================== HELPER METHOD ====================
  // Check if current user can access a feature (for frontend UI)
  canAccess: (feature) => {
    const user = adminService.getAdminUser();
    if (!user) return false;

    const ADMIN_ONLY_FEATURES = [
      'membership-plans',
      'payments',
      'analytics-behavior',
      'analytics-compatibility',
      'analytics-revenue',
      'moderation',
      'user-management-write',
      'profile-verification-write',
      'report-resolution',
      'office-user-management'
    ];

    if (user.role === 'ADMIN') {
      return true;
    } else if (user.role === 'OFFICE') {
      return !ADMIN_ONLY_FEATURES.includes(feature);
    }
    
    return false;
  }
};

export default adminService;