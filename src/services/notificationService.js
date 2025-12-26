import api from '../api/axiosUser';

const notificationService = {
  // Get all user notifications
  getNotifications: async () => {
    try {
      const response = await api.get('/api/notifications');
      console.log('🔔 Notifications response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      throw new Error(error.response?.data?.message || 'Failed to load notifications');
    }
  },

  // Get unread notifications only
  getUnreadNotifications: async () => {
    try {
      const response = await api.get('/api/notifications/unread');
      console.log('🔔 Unread notifications:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching unread notifications:', error);
      throw new Error(error.response?.data?.message || 'Failed to load unread notifications');
    }
  },

 markAsRead: async (notificationId) => {
  try {
    console.log('📝 Marking notification as read:', notificationId);
    
    // ✅ Just use the api instance - it already has auth headers
    const response = await api.post(
      `/api/notifications/${notificationId}/mark-read`,
      {} // empty body
    );
    
    console.log('✅ Marked as read:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error marking as read:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    } else if (error.response?.status === 404) {
      throw new Error('Notification not found');
    }
    throw new Error(error.response?.data?.message || 'Failed to mark as read');
  }
},

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.post('/api/notifications/mark-all-read');
      console.log('✅ Marked all as read response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark all as read');
    }
  },

  // Get unread notification count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/api/notifications/unread-count');
      console.log('🔔 Unread count:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
      throw new Error(error.response?.data?.message || 'Failed to get unread count');
    }
  },

  // Delete notification (add this method to backend controller first)
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/api/notifications/${notificationId}`);
      console.log('🗑️ Delete notification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete notification');
    }
  }
};

export default notificationService;