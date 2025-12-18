import { useState, useEffect } from 'react';
import { BellIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import notificationService from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { isAuthenticated } = useAuth();

  const fetchNotifications = async () => {
  if (!isAuthenticated) return;

  setLoading(true);
  setError('');

  try {
    console.log('🔔 Fetching notifications from backend...');
    const raw = await notificationService.getNotifications(); // current service returns response.data
    console.log('🔔 Raw notifications API response (frontend):', raw);

    const payloadRaw = raw?.data ?? raw;
console.log('🔍 payloadRaw typeof:', typeof payloadRaw);

// If the backend accidentally returned a stringified JSON, parse it
let payload = payloadRaw;
if (typeof payload === 'string') {
  try {
    payload = JSON.parse(payload);
    console.log('🔁 Parsed string payload into object/array.');
  } catch (parseErr) {
    console.warn('⚠️ payload is a string but JSON.parse failed. Will attempt to coerce keys -> array later.', parseErr);
    // keep payload as string (we'll still attempt fallback scans)
  }
}

console.log('🔍 Normalized payload type:', typeof payload, Array.isArray(payload) ? 'array' : Object.keys(payload || {}).slice(0,10));

    // Quick direct checks
    if (Array.isArray(payload)) {
      console.log('ℹ️ payload is an array (unexpected but OK). Length:', payload.length);
    } else {
      console.log('ℹ️ payload keys:', payload ? Object.keys(payload).slice(0, 10) : 'NULL');
    }

    // Try common places first
    let notificationsArray =
      Array.isArray(payload) ? payload
      : Array.isArray(payload?.notifications) ? payload.notifications
      : Array.isArray(payload?.data?.notifications) ? payload.data.notifications
      : null;

    // If not found, try a quick coercion if payload.notifications exists but not array
    if (!Array.isArray(notificationsArray) && payload && payload.notifications) {
      const pn = payload.notifications;
      console.log('ℹ️ payload.notifications exists but not array. typeof:', typeof pn);
      if (typeof pn === 'string') {
        try { const parsed = JSON.parse(pn); notificationsArray = Array.isArray(parsed) ? parsed : [parsed]; }
        catch (e) { notificationsArray = [pn]; }
      } else if (typeof pn === 'object') {
        notificationsArray = Array.isArray(pn) ? pn : [pn];
      }
    }

    // FINAL FALLBACK: recursively find first array of objects containing "id" or "title"
    if (!Array.isArray(notificationsArray)) {
      const seen = new WeakSet();
      const findArray = (obj) => {
        if (!obj || typeof obj !== 'object' || seen.has(obj)) return null;
        seen.add(obj);
        if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'object') {
          // check if array elements look like notifications
          const first = obj.find(el => el && (el.id != null || el.title || el.message));
          if (first) return obj;
        }
        for (const key of Object.keys(obj)) {
          try {
            const val = obj[key];
            const res = findArray(val);
            if (res) return res;
          } catch (e) {
            // swallow
          }
        }
        return null;
      };

      notificationsArray = findArray(payload);
      console.log('🔎 Recursive search result - found array?', Array.isArray(notificationsArray), 'length:', notificationsArray?.length);
    }

    // If still not an array, log payload and continue with empty list (don't throw)
    if (!Array.isArray(notificationsArray)) {
      console.warn('⚠️ Could not find notifications array in payload — rendering empty list. Full payload logged below.');
      console.warn(payload);
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const transformedNotifications = notificationsArray.map(n => {
  // Extract profile ID from actionUrl or message
  let extractedProfileId = null;
  
  if (n.type === 'CONTACT_REQUEST_RESPONSE' || n.type === 'INTEREST') {
    // Check actionUrl for profile ID
    if (n.actionUrl && n.actionUrl.includes('/profiles/')) {
      const matches = n.actionUrl.match(/\/profiles\/(\d+)/);
      if (matches && matches[1]) {
        extractedProfileId = parseInt(matches[1]);
      }
    }
    
    // Also check message for profile ID
    if (!extractedProfileId && n.message) {
      const idMatch = n.message.match(/profile\s*ID[:\s]*(\d+)/i) ||
                     n.message.match(/profile\s*#(\d+)/i);
      if (idMatch && idMatch[1]) {
        extractedProfileId = parseInt(idMatch[1]);
      }
    }
  }

  // Use the actual field names from the backend DTO
  return {
    id: n?.id || n?.notificationId || `temp_${Date.now()}_${Math.random()}`, // ✅ FIXED: Use n.id
    title: n?.title || 'Notification',
    message: n?.message || n?.content || '', // ✅ FIXED: Use n.message
    type: mapNotificationType(n?.type), // ✅ FIXED: Pass n.type
    backendType: n?.type || 'SYSTEM',
    timestamp: n?.createdAt ? new Date(n.createdAt) : new Date(), // ✅ FIXED: Use n.createdAt
    read: Boolean(n?.isRead), // ✅ FIXED: Use n.isRead
    actionUrl: `/notifications/${n?.id || n?.notificationId}`, // ✅ FIXED: Use n.id
    originalActionUrl: n?.actionUrl || null,
    actorId: n?.actor?.id || null,
    actorName: n?.actor?.name || n?.actor?.username || null,
    // ✅ NEW: Add extracted profile ID for contact requests
    profileId: extractedProfileId,
    // Keep raw data for details page
    rawNotification: n
  };
});

    console.log('✅ Notifications loaded (transformed):', transformedNotifications.length, transformedNotifications.slice(0,3));
    setNotifications(transformedNotifications);
    setUnreadCount(transformedNotifications.filter(x => !x.read).length);

  } catch (err) {
    console.error('❌ Error fetching notifications:', err);
    setError(err?.message || 'Failed to load notifications');
    // dev fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Using mock fallback data');
      const mockData = getMockNotifications();
      setNotifications(mockData);
      setUnreadCount(mockData.filter(n => !n.read).length);
    }
  } finally {
    setLoading(false);
  }
};

// Test script for debugging
const testAcceptContact = async (profileId = 14) => {
  console.log('🔍 Testing accept-contact endpoint...');
  
  // Get token
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  console.log('🔍 Token found:', token ? 'YES' : 'NO');
  if (token) {
    console.log('🔍 Token length:', token.length);
    console.log('🔍 Token first 100 chars:', token.substring(0, 100) + '...');
    
    // Decode token to check expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔍 Token payload:', payload);
      console.log('🔍 Token expires:', new Date(payload.exp * 1000));
      console.log('🔍 Is token expired?', Date.now() > payload.exp * 1000);
    } catch (e) {
      console.log('❌ Cannot parse token:', e.message);
    }
  }
  
  // Test the endpoint
  try {
    const response = await fetch(`http://localhost:8080/api/profiles/${profileId}/accept-contact`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    console.log('🔍 Response status:', response.status);
    const data = await response.json();
    console.log('🔍 Response data:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return { success: false, error: error.message };
  }
};

// Run the test
testAcceptContact(14);

  // Map backend notification types to frontend types
  const mapNotificationType = (backendType) => {
    const typeMap = {
      'INTEREST': 'match',
      'MATCH': 'match',
      'MESSAGE': 'message',
      'SYSTEM': 'system',
      'PAYMENT': 'system',
      'REMINDER': 'reminder'
    };
    return typeMap[backendType] || 'system';
  };

  // Get default action URL based on notification type
  const getDefaultActionUrl = (type) => {
    const urlMap = {
      'INTEREST': '/matches',
      'MATCH': '/matches',
      'MESSAGE': '/messages',
      'SYSTEM': '/profile',
      'PAYMENT': '/subscription',
      'REMINDER': '/discover'
    };
    return urlMap[type] || null;
  };

  // Mock data for development/fallback
  const getMockNotifications = () => {
    return [
      {
        id: '1',
        type: 'match',
        title: 'New Match!',
        message: 'You have a new potential match with Sarah',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
        actionUrl: '/matches'
      },
      {
        id: '2',
        type: 'message',
        title: 'New Message',
        message: 'John sent you a message: "Hey there!"',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: true,
        actionUrl: '/messages'
      }
    ];
  };

  // Fetch notifications on component mount and when auth changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const markAsRead = async (id) => {
  try {
    console.log('📝 Marking notification as read - START:', {
      id,
      type: typeof id,
      notificationId: id,
      url: `/api/notifications/${id}/mark-read`
    });
    
    await notificationService.markAsRead(id);
    
    console.log('✅ Marked as read - SUCCESS');
    
    // Update local state
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
    
  } catch (err) {
    console.error('❌ Error marking as read - DETAILS:', {
      error: err,
      message: err.message,
      response: err.response,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      headers: err.response?.headers
    });
    
    // Still update UI for better UX
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }
};

const deleteNotification = async (id) => {
  try {
    console.log('🗑️ Deleting notification - START:', {
      id,
      type: typeof id,
      notificationId: id,
      url: `/api/notifications/${id}`
    });
    
    if (window.confirm('Are you sure you want to delete this notification?')) {
      // Check if notification was unread
      const notification = notifications.find(n => n.id === id);
      const wasUnread = notification && !notification.read;
      
      // Call backend API
      await notificationService.deleteNotification(id);
      
      console.log('✅ Delete notification - SUCCESS');
      
      // Remove from local state
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      
      // Update unread count if needed
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  } catch (err) {
    console.error('❌ Error deleting notification - DETAILS:', {
      error: err,
      message: err.message,
      response: err.response,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      headers: err.response?.headers
    });
    
    // Show error but continue with local deletion for better UX
    alert('Failed to delete notification from server. Removing locally.');
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    
    // Update unread count if needed
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }
};

  const markAllAsRead = async () => {
    try {
      console.log('📝 Marking all notifications as read');
      await notificationService.markAllAsRead();
      
      // Update all notifications locally
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
      console.log('✅ All notifications marked as read');
    } catch (err) {
      console.error('❌ Error marking all as read:', err);
      // Still update UI for better UX
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'match':
        return '💕';
      case 'message':
        return '💬';
      case 'system':
        return '⚙️';
      case 'reminder':
        return '⏰';
      default:
        return '🔔';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' ? true : !notif.read
  );

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Please Login</h3>
            <p className="text-gray-600 mb-6">You need to be logged in to view notifications.</p>
            <a
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-600 mr-2">⚠️</span>
                <span className="text-red-800">{error}</span>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <BellIcon className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">
                  {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchNotifications}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
                title="Refresh"
              >
                <span>🔄</span> Refresh
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-yellow-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Notifications
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-yellow-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 ${
                  !notification.read ? 'border-l-4 border-yellow-500' : ''
                } hover:shadow-md`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete notification"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    {notification.actionUrl && (
                      <div className="mt-4">
                        <a
                          href={notification.actionUrl}
                          className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm"
                        >
                          View Details
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;