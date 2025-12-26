import { useState, useEffect } from "react";
import adminService from "../../../services/adminService";

function EngagementMetrics() {
  const [timeRange, setTimeRange] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [engagementData, setEngagementData] = useState({
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    monthlyActiveUsers: 0,
    day1Retention: 0,
    day7Retention: 0,
    day30Retention: 0,
    profileCompletionRate: 0,
    interestResponseRate: 0,
    messageResponseRate: 0,
    engagementTrend: {},
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

  // Fetch engagement metrics
  const fetchEngagementMetrics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getEngagementMetrics(timeRange);
      
      if (response.success) {
        setEngagementData({
          dailyActiveUsers: response.dailyActiveUsers || 0,
          weeklyActiveUsers: response.weeklyActiveUsers || 0,
          monthlyActiveUsers: response.monthlyActiveUsers || 0,
          day1Retention: response.day1Retention || 0,
          day7Retention: response.day7Retention || 0,
          day30Retention: response.day30Retention || 0,
          profileCompletionRate: response.profileCompletionRate || 0,
          interestResponseRate: response.interestResponseRate || 0,
          messageResponseRate: response.messageResponseRate || 0,
          engagementTrend: response.engagementTrend || {},
          success: true
        });
      }
    } catch (error) {
      console.error('Error fetching engagement metrics:', error);
      showNotification(error.message || 'Failed to load engagement metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when timeRange changes
  useEffect(() => {
    fetchEngagementMetrics();
  }, [timeRange]);

  // Calculate overall engagement score
  const calculateEngagementScore = () => {
    const scores = [
      engagementData.profileCompletionRate || 0,
      engagementData.interestResponseRate || 0,
      engagementData.messageResponseRate || 0,
      engagementData.day1Retention || 0,
      engagementData.day7Retention || 0 * 2, // Weighted higher
      engagementData.day30Retention || 0 * 3 // Weighted highest
    ].filter(score => score > 0);
    
    if (scores.length === 0) return 0;
    
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average);
  };

  // Process engagement trend for chart
  const processEngagementTrend = () => {
    const trend = engagementData.engagementTrend || {};
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map(day => trend[day] || 0);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return value ? `${value.toFixed(1)}%` : '0%';
  };

  const engagementScore = calculateEngagementScore();
  const engagementTrendData = processEngagementTrend();

  const SimpleLineChart = ({ data, color = 'blue' }) => {
    const maxValue = Math.max(...data);
    if (maxValue === 0) {
      return (
        <div className="h-40 md:h-48 flex items-center justify-center bg-gray-50 rounded">
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm text-gray-500">No trend data available</p>
          </div>
        </div>
      );
    }

    const colorClass = `text-${color}-500`;
    
    return (
      <div className="relative h-40 md:h-48">
        <svg viewBox={`0 0 ${data.length * 15} 100`} className="w-full h-full">
          <path
            d={`M 0,${100 - (data[0] / maxValue) * 100} ${data.map((value, index) => `L ${index * 15},${100 - (value / maxValue) * 100}`).join(' ')}`}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className={colorClass}
          />
          {data.map((value, index) => (
            <circle
              key={index}
              cx={index * 15}
              cy={100 - (value / maxValue) * 100}
              r="2"
              fill="currentColor"
              className={colorClass}
            />
          ))}
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading engagement metrics...</p>
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

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-blue-500">
          <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-2">
            {(engagementData.dailyActiveUsers || 0).toLocaleString()}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Daily Active Users</div>
          <div className="text-xs text-gray-500 mt-1">Active today</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-green-500">
          <div className="text-xl md:text-2xl font-bold text-green-600 mb-1 md:mb-2">
            {(engagementData.monthlyActiveUsers || 0).toLocaleString()}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Monthly Active Users</div>
          <div className="text-xs text-gray-500 mt-1">Total users</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-purple-500">
          <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1 md:mb-2">
            {formatPercentage(engagementData.day1Retention || 0)}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Day 1 Retention</div>
          <div className="text-xs text-gray-500 mt-1">Users returning after 1 day</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-yellow-500">
          <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1 md:mb-2">
            {formatPercentage(engagementData.profileCompletionRate || 0)}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Profile Completion</div>
          <div className="text-xs text-gray-500 mt-1">Complete profiles</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Engagement Trend */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Weekly Engagement Trend</h3>
            <div className="flex gap-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
              <button
                onClick={fetchEngagementMetrics}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded hover:bg-blue-100 transition-colors"
              >
                ↻ Refresh
              </button>
            </div>
          </div>
          <SimpleLineChart data={engagementTrendData} color="blue" />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Feature Engagement */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Feature Engagement Rates</h3>
          <div className="space-y-3 md:space-y-4">
            <div>
              <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-1">
                <span>Interest Response Rate</span>
                <span>{formatPercentage(engagementData.interestResponseRate || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${engagementData.interestResponseRate || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-1">
                <span>Message Response Rate</span>
                <span>{formatPercentage(engagementData.messageResponseRate || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${engagementData.messageResponseRate || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-1">
                <span>Profile Completion</span>
                <span>{formatPercentage(engagementData.profileCompletionRate || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${engagementData.profileCompletionRate || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Retention Rates */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">User Retention Rates</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Day 1 Retention</span>
                <span>{formatPercentage(engagementData.day1Retention || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${engagementData.day1Retention || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Day 7 Retention</span>
                <span>{formatPercentage(engagementData.day7Retention || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${engagementData.day7Retention || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Day 30 Retention</span>
                <span>{formatPercentage(engagementData.day30Retention || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${engagementData.day30Retention || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Active User Metrics */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Active User Metrics</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {(engagementData.dailyActiveUsers || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Daily Active Users</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-lg font-bold text-green-600">
                  {engagementData.weeklyActiveUsers > 0 ? 
                    `${Math.round((engagementData.dailyActiveUsers / engagementData.weeklyActiveUsers) * 100)}%` : 
                    '0%'}
                </div>
                <div className="text-xs text-gray-600">of Weekly Users</div>
              </div>
              
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-purple-600">
                  {engagementData.monthlyActiveUsers > 0 ? 
                    `${Math.round((engagementData.dailyActiveUsers / engagementData.monthlyActiveUsers) * 100)}%` : 
                    '0%'}
                </div>
                <div className="text-xs text-gray-600">of Monthly Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Engagement Score */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Overall Engagement Score</h3>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
              {engagementScore}/100
            </div>
            <div className="text-sm text-gray-600 mb-3">
              {engagementScore >= 80 ? 'Excellent Engagement' : 
               engagementScore >= 60 ? 'Good Engagement' : 
               engagementScore >= 40 ? 'Moderate Engagement' : 'Needs Improvement'}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full" 
                style={{ width: `${engagementScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Engagement Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-blue-600 mr-2">📊</span>
              <span className="text-sm font-medium text-gray-800">Engagement Trend</span>
            </div>
            <p className="text-xs text-gray-700">
              {engagementTrendData.some(val => val > 0) ? 
                'Weekly engagement pattern shows user activity distribution.' : 
                'No trend data available for analysis.'}
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-green-600 mr-2">🎯</span>
              <span className="text-sm font-medium text-gray-800">Key Metric</span>
            </div>
            <p className="text-xs text-gray-700">
              Day 1 retention at {formatPercentage(engagementData.day1Retention || 0)} indicates initial user satisfaction.
            </p>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-purple-600 mr-2">💡</span>
              <span className="text-sm font-medium text-gray-800">Recommendation</span>
            </div>
            <p className="text-xs text-gray-700">
              Focus on improving {engagementData.messageResponseRate < engagementData.interestResponseRate ? 'message response rates' : 'interest response rates'} for better engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EngagementMetrics;