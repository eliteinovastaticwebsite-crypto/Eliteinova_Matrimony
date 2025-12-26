import axiosOffice from '../api/axiosOffice';         // For office auth endpoints
import axiosDashboard from '../api/axiosDashboard';   // For dashboard endpoints

const officeAuthService = {
  login: async (email, password) => {
    try {
      const res = await axiosOffice.post('/api/office/auth/login', {
        email,
        password,
      });

      if (res.data.success && res.data.token) {
        localStorage.setItem('officeToken', res.data.token);
        // Store minimal office user info
        const officeUser = {
          email: email,
          role: 'OFFICE',
          name: email.split('@')[0] // Simple name from email
        };
        localStorage.setItem('officeUser', JSON.stringify(officeUser));
      }

      return res.data;
    } catch (error) {
      console.error('Office login error:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Office login failed' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('officeToken');
    localStorage.removeItem('officeUser');
    window.location.href = '/office/login';
  },

  checkAuth: async () => {
    try {
      const res = await axiosOffice.get('/api/office/auth/check');
      return res.data;
    } catch {
      return { authenticated: false };
    }
  },

  getOfficeUser: () => {
    const officeStr = localStorage.getItem('officeUser');
    return officeStr ? JSON.parse(officeStr) : null;
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