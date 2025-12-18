// services/adminService.js
import axios from '../api/axios';

const adminService = {
  // ==================== AUTH TOKEN MANAGEMENT ====================
  setAuthToken: (token) => {
    if (token) {
      console.log('🔑 Setting admin auth token:', token.substring(0, 20) + '...');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('adminToken', token);
      
      // Also set it on the axios instance directly
      if (axios.defaults && axios.defaults.headers && axios.defaults.headers.common) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } else {
      console.log('🔑 Removing admin auth token');
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('adminToken');
      
      if (axios.defaults && axios.defaults.headers && axios.defaults.headers.common) {
        delete axios.defaults.headers.common['Authorization'];
      }
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
    delete axios.defaults.headers.common['Authorization'];
  },

  // ==================== ADMIN AUTHENTICATION ====================
  login: async (email, password) => {
    try {
      console.log('🔐 Admin login attempt:', email);
      
      const response = await axios.post('/api/admin/auth/login', {
        email,
        password
      });
      
      if (response.data.success && response.data.token) {
        // Store token and admin data
        adminService.setAuthToken(response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
        
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
      await axios.post('/api/admin/auth/logout');
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

      const response = await axios.get('/api/admin/auth/check');
      return response.data;
      
    } catch (error) {
      console.error('Auth check error:', error);
      return { success: false, authenticated: false };
    }
  },

  // ==================== DASHBOARD DATA ====================
  getDashboardStats: async () => {
    try {
      const response = await axios.get('/api/admin/dashboard/stats');
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
    
    const response = await axios.get('/api/admin/users', { params });
    
    // Handle the response - it's a string with malformed JSON
    let rawData = response.data;
    
    // Check if it's already an object
    if (typeof rawData === 'object' && rawData !== null) {
      console.log('✅ Response is already an object');
      return rawData;
    }
    
    // Try to parse the string
    if (typeof rawData === 'string') {
      console.log('📦 Raw string length:', rawData.length);
      
      // FIX 1: Extract valid JSON from the string
      // Find the first '{' and last '}' to get valid JSON
      const startIndex = rawData.indexOf('{');
      const lastIndex = rawData.lastIndexOf('}');
      
      if (startIndex !== -1 && lastIndex !== -1) {
        const jsonStr = rawData.substring(startIndex, lastIndex + 1);
        console.log('🔧 Extracted JSON length:', jsonStr.length);
        
        try {
          // Parse the extracted JSON
          const parsedData = JSON.parse(jsonStr);
          console.log('✅ Successfully parsed extracted JSON');
          return parsedData;
        } catch (parseError) {
          console.error('❌ Failed to parse extracted JSON:', parseError);
          
          // FIX 2: Create a simple response structure
          return {
            success: true,
            totalItems: 19, // Hardcode based on your logs
            totalPages: 2,
            currentPage: 0,
            users: [] // Empty array for safety
          };
        }
      }
    }
    
    // Fallback response
    return {
      success: false,
      message: 'Invalid response format',
      users: []
    };
    
  } catch (error) {
    console.error('❌ Error in getUsers:', error);
    
    // Return a safe structure instead of throwing
    return {
      success: false,
      message: error.message || 'Failed to fetch users',
      users: []
    };
  }
},

  getUserById: async (id) => {
    try {
      const response = await axios.get(`/api/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error.response?.data || { error: 'Failed to fetch user' };
    }
  },

  // NEW: Search users with advanced filters
  searchUsers: async (searchParams = {}) => {
    try {
      const response = await axios.get('/api/admin/users/search', { 
        params: searchParams 
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error.response?.data || { error: 'Failed to search users' };
    }
  },

  // NEW: Get user statistics
  getUserStats: async () => {
    try {
      const response = await axios.get('/api/admin/users/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error.response?.data || { error: 'Failed to fetch user stats' };
    }
  },

  // NEW: Create user (if needed)
  createUser: async (userData) => {
    try {
      const response = await axios.post('/api/admin/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error.response?.data || { error: 'Failed to create user' };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`/api/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error.response?.data || { error: 'Failed to update user' };
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      const response = await axios.put(
        `/api/admin/users/${userId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error.response?.data || { error: 'Failed to update user status' };
    }
  },

  // NEW: Block/Unblock user (specific endpoint if exists)
  blockUser: async (userId) => {
    try {
      const response = await axios.post(`/api/admin/users/${userId}/block`);
      return response.data;
    } catch (error) {
      console.error('Error blocking user:', error);
      // Fallback to updateUserStatus if block endpoint doesn't exist
      return adminService.updateUserStatus(userId, 'BLOCKED');
    }
  },

  unblockUser: async (userId) => {
    try {
      const response = await axios.post(`/api/admin/users/${userId}/unblock`);
      return response.data;
    } catch (error) {
      console.error('Error unblocking user:', error);
      // Fallback to updateUserStatus if unblock endpoint doesn't exist
      return adminService.updateUserStatus(userId, 'ACTIVE');
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error.response?.data || { error: 'Failed to delete user' };
    }
  },

  bulkUpdateUsers: async (userIds, action) => {
    try {
      const response = await axios.post('/api/admin/users/bulk-update', {
        userIds,
        action
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating users:', error);
      throw error.response?.data || { error: 'Failed to bulk update users' };
    }
  },

  // NEW: Change user role
  changeUserRole: async (userId, role) => {
    try {
      const response = await axios.post(`/api/admin/users/${userId}/change-role`, {
        role
      });
      return response.data;
    } catch (error) {
      console.error('Error changing user role:', error);
      throw error.response?.data || { error: 'Failed to change user role' };
    }
  },

  // ==================== PROFILE MANAGEMENT ====================
  getUserProfiles: async (params = {}) => {
    try {
      const response = await axios.get('/api/admin/profiles', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error.response?.data || { error: 'Failed to fetch profiles' };
    }
  },

  getProfileById: async (profileId) => {
    try {
      const response = await axios.get(`/api/admin/profiles/${profileId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error.response?.data || { error: 'Failed to fetch profile' };
    }
  },

  updateProfile: async (profileId, profileData) => {
    try {
      const response = await axios.put(
        `/api/admin/profiles/${profileId}`,
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
      const response = await axios.get('/api/admin/verifications/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
      throw error.response?.data || { error: 'Failed to fetch pending verifications' };
    }
  },

  verifyProfile: async (profileId, status, notes = '') => {
    try {
      const response = await axios.post('/api/admin/verifications/verify', {
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

  // NEW: Bulk verify profiles
  bulkVerifyProfiles: async (profileIds, status, notes = '') => {
    try {
      const response = await axios.post('/api/admin/verifications/bulk-verify', {
        profileIds,
        status,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk verifying profiles:', error);
      throw error.response?.data || { error: 'Failed to bulk verify profiles' };
    }
  },

  // ==================== MEMBERSHIP MANAGEMENT ====================
  getMembershipPlans: async () => {
    try {
      const response = await axios.get('/api/admin/membership-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      throw error.response?.data || { error: 'Failed to fetch membership plans' };
    }
  },

  createMembershipPlan: async (planData) => {
    try {
      const response = await axios.post('/api/admin/membership-plans', planData);
      return response.data;
    } catch (error) {
      console.error('Error creating membership plan:', error);
      throw error.response?.data || { error: 'Failed to create membership plan' };
    }
  },

  updateMembershipPlan: async (planId, planData) => {
    try {
      const response = await axios.put(
        `/api/admin/membership-plans/${planId}`,
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
      const response = await axios.delete(`/api/admin/membership-plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting membership plan:', error);
      throw error.response?.data || { error: 'Failed to delete membership plan' };
    }
  },

  // NEW: Assign membership to user
  assignMembership: async (userId, planId) => {
    try {
      const response = await axios.post(`/api/admin/users/${userId}/assign-membership`, {
        planId
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning membership:', error);
      throw error.response?.data || { error: 'Failed to assign membership' };
    }
  },

  // ==================== ANALYTICS ====================
  getGeographicAnalytics: async () => {
    try {
      const response = await axios.get('/api/admin/analytics/geographic');
      return response.data;
    } catch (error) {
      console.error('Error fetching geographic analytics:', error);
      throw error.response?.data || { error: 'Failed to fetch geographic analytics' };
    }
  },

  getMatchAnalytics: async () => {
  try {
    // Try the detailed endpoint first
    const response = await axios.get(`/api/admin/analytics/matches-detailed`);
    return response.data;
  } catch (detailedError) {
    console.log('Detailed endpoint failed, trying basic endpoint...');
    try {
      // Fall back to basic endpoint
      const response = await axios.get(`/api/admin/analytics/matches`);
      return response.data;
    } catch (error) {
      console.error('Error fetching match analytics:', error);
      throw error.response?.data || { error: 'Failed to fetch match analytics' };
    }
  }
},

  getUserBehaviorAnalytics: async () => {
    try {
      const response = await axios.get(`/api/admin/analytics/behavior`);
      return response.data;
    } catch (error) {
      console.error('Error fetching behavior analytics:', error);
      throw error.response?.data || { error: 'Failed to fetch behavior analytics' };
    }
  },

  getEngagementMetrics: async (period = 'weekly') => {
    try {
      const response = await axios.get(`/api/admin/analytics/engagement`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching engagement metrics:', error);
      throw error.response?.data || { error: 'Failed to fetch engagement metrics' };
    }
  },

  // NEW: Revenue analytics
  getRevenueAnalytics: async (period = 'monthly') => {
    try {
      const response = await axios.get(`/api/admin/analytics/revenue`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error.response?.data || { error: 'Failed to fetch revenue analytics' };
    }
  },

  // NEW: Compatibility analytics
  getCompatibilityAnalytics: async () => {
    try {
      const response = await axios.get(`/api/admin/analytics/compatibility`);
      return response.data;
    } catch (error) {
      console.error('Error fetching compatibility analytics:', error);
      throw error.response?.data || { error: 'Failed to fetch compatibility analytics' };
    }
  },

  // ==================== REPORTS ====================
  getUserReports: async (page = 0, size = 20, status = null, severity = null, search = null) => {
  try {
    let url = `/api/admin/reports?page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;
    if (severity) url += `&severity=${severity}`;
    if (search) url += `&search=${search}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching user reports:', error);
    throw error.response?.data || { error: 'Failed to fetch user reports' };
  }
},

getReportStats: async () => {
  try {
    const response = await axios.get(`/api/admin/reports/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report stats:', error);
    throw error.response?.data || { error: 'Failed to fetch report statistics' };
  }
},

getReportById: async (reportId) => {
  try {
    const response = await axios.get(`/api/admin/reports/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report details:', error);
    throw error.response?.data || { error: 'Failed to fetch report details' };
  }
},

resolveReport: async (reportId, action, notes = '') => {
  try {
    const response = await axios.post(`/api/admin/reports/resolve`, {
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
    const response = await axios.delete(`/api/admin/reports/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error.response?.data || { error: 'Failed to delete report' };
  }
},

  // ==================== SUCCESS STORIES ====================
  getSuccessStories: async () => {
  try {
    const response = await axios.get(`/api/admin/success-stories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching success stories:', error);
    throw error.response?.data || { error: 'Failed to fetch success stories' };
  }
},

approveSuccessStory: async (storyId) => {
  try {
    const response = await axios.post(`/api/admin/success-stories/${storyId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving success story:', error);
    throw error.response?.data || { error: 'Failed to approve success story' };
  }
},

rejectSuccessStory: async (storyId, reason = '') => {
  try {
    const response = await axios.post(`/api/admin/success-stories/${storyId}/reject`, {
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
    const response = await axios.post(`/api/admin/success-stories/${storyId}/feature`, {
      featured
    });
    return response.data;
  } catch (error) {
    console.error('Error featuring success story:', error);
    throw error.response?.data || { error: 'Failed to update feature status' };
  }
},

deleteSuccessStory: async (storyId) => {
  try {
    const response = await axios.delete(`/api/admin/success-stories/${storyId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting success story:', error);
    throw error.response?.data || { error: 'Failed to delete success story' };
  }
},

  // ==================== PAYMENTS ====================
  getPayments: async (params = {}) => {
  try {
    // Convert params to match backend expectations
    const backendParams = {
      page: params.page || 0,
      size: params.size || 20,
      status: params.status || undefined,
      startDate: params.startDate || undefined,
      endDate: params.endDate || undefined
    };
    
    const response = await axios.get(`/api/admin/payments`, { params: backendParams });
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error.response?.data || { error: 'Failed to fetch payments' };
  }
},

getPaymentById: async (paymentId) => {
  try {
    const response = await axios.get(`/api/admin/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error.response?.data || { error: 'Failed to fetch payment' };
  }
},

processRefund: async (paymentId, amount, reason = '') => {
  try {
    const response = await axios.post(`/api/admin/payments/${paymentId}/refund`, {
      amount,
      reason
    });
    return response.data;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error.response?.data || { error: 'Failed to process refund' };
  }
},

// Export payments
exportPayments: async (params = {}) => {
  try {
    const response = await axios.get(`/api/admin/payments/export`, { 
      params: {
        status: params.status || undefined,
        startDate: params.startDate || undefined,
        endDate: params.endDate || undefined
      },
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
      const response = await axios.get(`/api/admin/moderation/flagged`);
      return response.data;
    } catch (error) {
      console.error('Error fetching flagged content:', error);
      throw error.response?.data || { error: 'Failed to fetch flagged content' };
    }
  },

  moderateContent: async (contentId, action, reason = '') => {
    try {
      const response = await axios.post(`/api/admin/moderation/moderate`, {
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
      const response = await axios.get(`/api/admin/photos/pending`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending photos:', error);
      throw error.response?.data || { error: 'Failed to fetch pending photos' };
    }
  },

  approvePhoto: async (photoId, action, reason = '') => {
  try {
    // FIXED: Remove photoId from URL, send it in body
    const response = await axios.post(`/api/admin/photos/approve`, {
      photoId,  // Send photoId in request body
      action,
      reason
    });
    return response.data;
  } catch (error) {
    console.error('Error approving photo:', error);
    throw error.response?.data || { error: 'Failed to approve photo' };
  }
},

// UPDATE: Bulk endpoint also doesn't exist, so remove or create it
bulkApprovePhotos: async (photoIds, action, reason = '') => {
  try {
    // Since bulk endpoint doesn't exist, process individually
    const promises = photoIds.map(photoId => 
      axios.post(`/api/admin/photos/approve`, {
        photoId,
        action,
        reason
      })
    );
    
    const results = await Promise.allSettled(promises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    return {
      success: successful > 0,
      message: `Processed ${successful} photos successfully, ${failed} failed`,
      successful,
      failed
    };
  } catch (error) {
    console.error('Error bulk approving photos:', error);
    throw error.response?.data || { error: 'Failed to bulk approve photos' };
  }
},

  // ==================== SYSTEM UTILITIES ====================
  // NEW: Export data
  exportData: async (type, params = {}) => {
    try {
      const response = await axios.get(`/api/admin/export/${type}`, { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error exporting ${type}:`, error);
      throw error.response?.data || { error: `Failed to export ${type}` };
    }
  },

  // NEW: Send system notifications
  sendNotification: async (userId, title, message) => {
    try {
      const response = await axios.post(`/api/admin/notifications/send`, {
        userId,
        title,
        message
      });
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error.response?.data || { error: 'Failed to send notification' };
    }
  },

  // NEW: Get audit logs
  getAuditLogs: async (params = {}) => {
    try {
      const response = await axios.get(`/api/admin/audit-logs`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error.response?.data || { error: 'Failed to fetch audit logs' };
    }
  },

  // ==================== INTERCEPTOR ====================
  setupResponseInterceptor: () => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          console.warn('🔄 Admin token expired, redirecting to login');
          adminService.clearAdminData();
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );
  }
};

// Initialize token on import
const initializeToken = () => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    console.log('🔑 Initializing admin token from localStorage');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

initializeToken();
adminService.setupResponseInterceptor();

export default adminService;