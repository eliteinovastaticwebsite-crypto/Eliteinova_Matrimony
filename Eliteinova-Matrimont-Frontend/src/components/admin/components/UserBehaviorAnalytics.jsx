import { useState, useEffect } from "react";
import adminService from "../../../services/adminService";

function UserBehaviorAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [behaviorData, setBehaviorData] = useState({
    averageSessionDuration: 0,
    pagesPerSession: 0,
    bounceRate: 0,
    profileViews: 0,
    interestSent: 0,
    messagesExchanged: 0,
    searchesPerformed: 0,
    peakHours: {},
    activityLevels: {},
    success: false
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Fetch behavior analytics
  const fetchBehaviorAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUserBehaviorAnalytics();
      
      if (response.success) {
        setBehaviorData({
          averageSessionDuration: response.averageSessionDuration || 0,
          pagesPerSession: response.pagesPerSession || 0,
          bounceRate: response.bounceRate || 0,
          profileViews: response.profileViews || 0,
          interestSent: response.interestSent || 0,
          messagesExchanged: response.messagesExchanged || 0,
          searchesPerformed: response.searchesPerformed || 0,
          peakHours: response.peakHours || {},
          activityLevels: response.activityLevels || {},
          success: true
        });
      }
    } catch (error) {
      console.error('Error fetching behavior analytics:', error);
      showNotification(error.message || 'Failed to load behavior analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchBehaviorAnalytics();
  }, []);

  // Format session duration
  const formatSessionDuration = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Calculate total active users
  const totalActiveUsers = Object.values(behaviorData.activityLevels || {}).reduce((sum, count) => sum + count, 0);

  // Get activity trends data (empty array for now - can be enhanced if backend provides)
  const getActivityTrendsData = () => {
    if (timeRange === '7d') return [0, 0, 0, 0, 0, 0, 0];
    if (timeRange === '30d') return Array.from({length: 30}, () => 0);
    return Array.from({length: 90}, () => 0);
  };

  // Process user segments from activity levels
  const userSegments = Object.entries(behaviorData.activityLevels || {}).map(([segment, users]) => {
    // Generate color based on segment name
    const getSegmentColor = (segmentName) => {
      const colorMap = {
        'Highly Active': 'bg-green-500',
        'Moderately Active': 'bg-blue-500',
        'Low Activity': 'bg-yellow-500',
        'Inactive': 'bg-red-500'
      };
      return colorMap[segmentName] || 'bg-gray-500';
    };

    return {
      segment,
      users,
      growth: "0%", // No growth data from backend
      color: getSegmentColor(segment)
    };
  });

  // Process top actions from behavior data
  const topActions = [
    { 
      action: 'Profile Views', 
      count: behaviorData.profileViews || 0, 
      trend: "0%",
      icon: '👁️'
    },
    { 
      action: 'Interests Sent', 
      count: behaviorData.interestSent || 0, 
      trend: "0%",
      icon: '❤️'
    },
    { 
      action: 'Messages Exchanged', 
      count: behaviorData.messagesExchanged || 0, 
      trend: "0%",
      icon: '💬'
    },
    { 
      action: 'Searches Performed', 
      count: behaviorData.searchesPerformed || 0, 
      trend: "0%",
      icon: '🔍'
    },
    { 
      action: 'Pages/Session', 
      count: Math.round(behaviorData.pagesPerSession || 0), 
      trend: "0%",
      icon: '📄'
    }
  ];

  // Process peak hours for display
  const peakHoursData = Object.entries(behaviorData.peakHours || {}).map(([hour, count]) => ({
    hour,
    count,
    percentage: totalActiveUsers > 0 ? (count / totalActiveUsers) * 100 : 0
  })).sort((a, b) => b.count - a.count);

  const SimpleBarChart = ({ data }) => {
    const maxValue = Math.max(...data.filter(val => val !== undefined));
    
    return (
      <div className="flex items-end justify-between h-32 gap-1 md:gap-2 px-2">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:opacity-80"
              style={{ 
                height: maxValue > 0 ? `${(value / maxValue) * 100}%` : '0%',
                minHeight: '2px'
              }}
            />
            <span className="text-xs text-gray-500 mt-1 hidden md:block">
              {timeRange === '7d' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index] : index + 1}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading behavior analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Notification Banner */}
      {notification.show && (
        <div className={`rounded-lg p-4 ${
          notification.type === 'error' 
            ? 'bg-red-50 border border-red-200 text-red-800' 
            : 'bg-green-50 border border-green-200 text-green-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {notification.type === 'error' ? (
                <span className="text-red-500 mr-2">⚠️</span>
              ) : (
                <span className="text-green-500 mr-2">✓</span>
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification({ show: false, message: '', type: '' })}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-blue-500">
          <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-2">
            {(behaviorData.profileViews || 0).toLocaleString()}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Profile Views</div>
          <div className="text-xs text-gray-500 mt-1">Total count</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-green-500">
          <div className="text-xl md:text-2xl font-bold text-green-600 mb-1 md:mb-2">
            {(behaviorData.messagesExchanged || 0).toLocaleString()}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Messages Exchanged</div>
          <div className="text-xs text-gray-500 mt-1">Total count</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-purple-500">
          <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1 md:mb-2">
            {(behaviorData.interestSent || 0).toLocaleString()}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Interests Sent</div>
          <div className="text-xs text-gray-500 mt-1">Total count</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-yellow-500">
          <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1 md:mb-2">
            {formatSessionDuration(behaviorData.averageSessionDuration || 0)}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Avg Session</div>
          <div className="text-xs text-gray-500 mt-1">Duration</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Activity Trends */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">User Activity Trends</h3>
            <div className="flex gap-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button
                onClick={fetchBehaviorAnalytics}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded hover:bg-blue-100 transition-colors"
              >
                ↻ Refresh
              </button>
            </div>
          </div>
          <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-sm text-gray-500">Activity trend data not available</p>
              <p className="text-xs text-gray-400 mt-1">Showing {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} day placeholder</p>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Start</span>
            <span>Daily Active Users</span>
            <span>End</span>
          </div>
        </div>

        {/* User Segments */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">User Engagement Segments</h3>
          <div className="space-y-3 md:space-y-4">
            {userSegments.length > 0 ? (
              userSegments.map((segment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800">{segment.segment}</span>
                    <span className="text-sm font-semibold text-gray-800">{segment.users} users</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${segment.color} transition-all duration-1000`}
                        style={{ 
                          width: `${totalActiveUsers > 0 ? (segment.users / totalActiveUsers) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full min-w-[50px] text-center bg-gray-100 text-gray-800">
                      {segment.growth}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <div className="text-3xl mb-3">📊</div>
                <p className="text-sm">No user segment data available</p>
              </div>
            )}
          </div>
          {totalActiveUsers > 0 && (
            <div className="mt-3 text-xs text-gray-600">
              Total active users: {totalActiveUsers.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Top Actions and Behavior Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top User Actions */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Top User Actions</h3>
          <div className="space-y-3">
            {topActions.length > 0 ? (
              topActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-sm">{action.icon}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800 block">{action.action}</span>
                      <span className="text-xs text-gray-500">
                        {action.action === 'Pages/Session' ? 'Average per session' : 'Total count'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">
                      {action.action === 'Pages/Session' ? action.count.toFixed(1) : action.count.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {action.trend}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-3xl mb-3">📈</div>
                <p className="text-sm">No action data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Behavior Patterns */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Behavior Patterns</h3>
          <div className="space-y-4">
            {peakHoursData.length > 0 ? (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Peak Activity: {peakHoursData[0]?.hour}</span>
                  <span>{peakHoursData[0]?.count} users</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${peakHoursData[0]?.percentage || 0}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No peak hours data</p>
              </div>
            )}
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Pages per Session</span>
                <span>{(behaviorData.pagesPerSession || 0).toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (behaviorData.pagesPerSession || 0) * 10)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Bounce Rate</span>
                <span>{(behaviorData.bounceRate || 0).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, behaviorData.bounceRate || 0)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Searches Performed</span>
                <span>{(behaviorData.searchesPerformed || 0).toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, ((behaviorData.searchesPerformed || 0) / 10000) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Data Summary */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">📊 Real Data Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{totalActiveUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {totalActiveUsers > 0 ? ((behaviorData.messagesExchanged || 0) / totalActiveUsers).toFixed(1) : '0'}
            </div>
            <div className="text-sm text-gray-600">Avg Messages/User</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {totalActiveUsers > 0 ? ((behaviorData.profileViews || 0) / totalActiveUsers).toFixed(1) : '0'}
            </div>
            <div className="text-sm text-gray-600">Avg Profile Views/User</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">
              {totalActiveUsers > 0 ? ((behaviorData.searchesPerformed || 0) / totalActiveUsers).toFixed(1) : '0'}
            </div>
            <div className="text-sm text-gray-600">Avg Searches/User</div>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Data loaded from backend: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default UserBehaviorAnalytics;