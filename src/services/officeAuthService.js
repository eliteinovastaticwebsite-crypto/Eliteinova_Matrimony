import axiosOffice from '../api/axiosOffice';         // For office auth endpoints
import axiosDashboard from '../api/axiosDashboard';   // For dashboard endpoints

const officeAuthService = {
  // ==================== AUTH TOKEN MANAGEMENT ====================
  setAuthToken: (token, user) => {
    if (token && user) {
      console.log('🔑 Setting office auth token for:', user.email);
      localStorage.setItem('officeToken', token);
      localStorage.setItem('officeUser', JSON.stringify(user));
    } else {
      console.log('🔑 Removing office auth data');
      localStorage.removeItem('officeToken');
      localStorage.removeItem('officeUser');
    }
  },

  getAuthToken: () => {
    return localStorage.getItem('officeToken');
  },

  getOfficeUser: () => {
    const officeStr = localStorage.getItem('officeUser');
    return officeStr ? JSON.parse(officeStr) : null;
  },

  clearOfficeData: () => {
    localStorage.removeItem('officeToken');
    localStorage.removeItem('officeUser');
  },

  // ==================== OFFICE AUTHENTICATION ====================
  login: async (email, password) => {
    try {
      console.log('🔐 Office login attempt:', email);
      
      const res = await axiosOffice.post('/api/office/auth/login', {
        email,
        password,
      });

      if (res.data.success && res.data.token) {
        const officeUser = res.data.office || {
          email: email,
          role: 'OFFICE',
          name: email.split('@')[0]
        };
        officeAuthService.setAuthToken(res.data.token, officeUser);
        console.log('✅ Office login successful:', officeUser.name);
      }

      return res.data;
    } catch (error) {
      console.error('❌ Office login error:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Office login failed' 
      };
    }
  },

  logout: async () => {
    try {
      await axiosOffice.post('/api/office/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      officeAuthService.clearOfficeData();
      window.location.href = '/office/login';
    }
  },

  checkAuth: async () => {
    try {
      const token = officeAuthService.getAuthToken();
      if (!token) {
        return { success: false, authenticated: false };
      }

      const res = await axiosOffice.get('/api/office/auth/check');
      return res.data;
    } catch (error) {
      console.error('Auth check error:', error);
      return { success: false, authenticated: false };
    }
  },

  // ==================== PASSWORD RESET FUNCTIONALITY ====================
  
  /**
   * Send password reset OTP to staff email
   * @param {string} email - Staff email address
   * @returns {Promise} - Response with success status and message
   */
  sendPasswordResetOTP: async (email) => {
    try {
      console.log('📧 Sending password reset OTP to:', email);
      
      const res = await axiosOffice.post('/api/office/auth/forgot-password', {
        email
      });

      console.log('✅ Password reset OTP sent successfully');
      return res.data;
    } catch (error) {
      console.error('❌ Error sending password reset OTP:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Failed to send password reset OTP' 
      };
    }
  },

  /**
   * Verify the OTP sent for password reset
   * @param {string} email - Staff email address
   * @param {string} otp - 6-digit OTP received via email
   * @returns {Promise} - Response with success status
   */
  verifyPasswordResetOTP: async (email, otp) => {
    try {
      console.log('🔐 Verifying password reset OTP for:', email);
      
      const res = await axiosOffice.post('/api/office/auth/verify-reset-otp', {
        email,
        otp
      });

      console.log('✅ OTP verified successfully');
      return res.data;
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Failed to verify OTP' 
      };
    }
  },

  /**
   * Reset password with verified OTP
   * @param {string} email - Staff email address
   * @param {string} otp - Verified OTP
   * @param {string} newPassword - New password
   * @returns {Promise} - Response with success status
   */
  resetPassword: async (email, otp, newPassword) => {
    try {
      console.log('🔄 Resetting password for:', email);
      
      const res = await axiosOffice.post('/api/office/auth/reset-password', {
        email,
        otp,
        newPassword
      });

      console.log('✅ Password reset successful');
      return res.data;
    } catch (error) {
      console.error('❌ Error resetting password:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Failed to reset password' 
      };
    }
  },

  /**
   * Resend password reset OTP (alias for sendPasswordResetOTP)
   * @param {string} email - Staff email address
   * @returns {Promise} - Response with success status
   */
  resendPasswordResetOTP: async (email) => {
    // Reuse the send function with rate limiting handled by backend
    return officeAuthService.sendPasswordResetOTP(email);
  },

  /**
   * Change password when logged in (for authenticated users)
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} - Response with success status
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      console.log('🔄 Changing password for authenticated user');
      
      const res = await axiosOffice.post('/api/office/auth/change-password', {
        currentPassword,
        newPassword
      });

      console.log('✅ Password changed successfully');
      return res.data;
    } catch (error) {
      console.error('❌ Error changing password:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Failed to change password' 
      };
    }
  },

  // ==================== LIMITED DASHBOARD ACCESS ====================
  // Office users have limited access - only read-only endpoints
  
  getDashboardStats: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error.response?.data || { error: 'Failed to fetch dashboard stats' };
    }
  },

  getUsers: async (params = {}) => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error.response?.data || { error: 'Failed to fetch users' };
    }
  },

  getProfiles: async (params = {}) => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/profiles', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error.response?.data || { error: 'Failed to fetch profiles' };
    }
  },

  getPendingVerifications: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/verifications/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
      throw error.response?.data || { error: 'Failed to fetch pending verifications' };
    }
  },

  getPendingPhotos: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/photos/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending photos:', error);
      throw error.response?.data || { error: 'Failed to fetch pending photos' };
    }
  },

  getReports: async (params = {}) => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/reports', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error.response?.data || { error: 'Failed to fetch reports' };
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

  getSuccessStories: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/success-stories');
      return response.data;
    } catch (error) {
      console.error('Error fetching success stories:', error);
      throw error.response?.data || { error: 'Failed to fetch success stories' };
    }
  },

  // Office users can only view these analytics
  getMatchAnalytics: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/analytics/matches');
      return response.data;
    } catch (error) {
      console.error('Error fetching match analytics:', error);
      throw error.response?.data || { error: 'Failed to fetch match analytics' };
    }
  },

  getGeographicAnalytics: async () => {
    try {
      const response = await axiosDashboard.get('/api/dashboard/analytics/geographic');
      return response.data;
    } catch (error) {
      console.error('Error fetching geographic analytics:', error);
      throw error.response?.data || { error: 'Failed to fetch geographic analytics' };
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

  // Helper to check if office user can access a feature
  canAccess: (feature) => {
    const user = officeAuthService.getOfficeUser();
    if (!user || user.role !== 'OFFICE') return false;

    const OFFICE_READ_ONLY_FEATURES = [
      'dashboard-stats',
      'users-view',
      'profiles-view',
      'verifications-view',
      'photos-view',
      'reports-view',
      'success-stories-view',
      'analytics-matches',
      'analytics-geographic',
      'analytics-engagement'
    ];

    return OFFICE_READ_ONLY_FEATURES.includes(feature);
  }
};

export default officeAuthService;