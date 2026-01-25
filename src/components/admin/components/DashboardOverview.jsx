import { useState, useEffect } from "react"; // ✅ Added useEffect
import Button from "../../ui/Button";
import {
  UsersIcon,
  UserGroupIcon,
  SparklesIcon,
  ChartBarIcon,
  EnvelopeIcon,
  HeartIcon,
  BanknotesIcon,
  FireIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import adminService from "../../../services/adminService"; // ✅ Added adminService

function DashboardOverview() {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalMatches: 0,
    successfulMatches: 0,
    pendingMatches: 0,
    revenue: 0,
    monthlyRevenue: 0,
    engagementRate: 0,
    premiumUsers: 0,
    conversionRate: 0,
    pendingVerifications: 0,
    verifiedProfiles: 0,
    totalProfiles: 0,
    todayPayments: 0,
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    monthlyActiveUsers: 0,
    matchRate: 0,
    verificationRate: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch stats
      const statsResponse = await adminService.getDashboardStats();
      if (statsResponse.success) {
        // Ensure all numeric fields have default values
        setStats({
          totalUsers: statsResponse.totalUsers || 0,
          activeUsers: statsResponse.activeUsers || 0,
          newUsersToday: statsResponse.newUsersToday || 0,
          totalMatches: statsResponse.totalMatches || 0,
          successfulMatches: statsResponse.successfulMatches || 0,
          pendingMatches: statsResponse.pendingMatches || 0,
          revenue: statsResponse.revenue || 0,
          monthlyRevenue: statsResponse.monthlyRevenue || 0,
          engagementRate: statsResponse.engagementRate || 0,
          premiumUsers: statsResponse.premiumUsers || 0,
          conversionRate: statsResponse.conversionRate || 0,
          pendingVerifications: statsResponse.pendingVerifications || 0,
          verifiedProfiles: statsResponse.verifiedProfiles || 0,
          totalProfiles: statsResponse.totalProfiles || 0,
          todayPayments: statsResponse.todayPayments || 0,
          dailyActiveUsers: statsResponse.dailyActiveUsers || 0,
          weeklyActiveUsers: statsResponse.weeklyActiveUsers || 0,
          monthlyActiveUsers: statsResponse.monthlyActiveUsers || 0,
          matchRate: statsResponse.matchRate || 0,
          verificationRate: statsResponse.verificationRate || 0
        });
      }
      
      // Fetch recent users
      const usersResponse = await adminService.getUsers({ 
        page: 0, 
        size: 5, 
        sortBy: 'createdAt', 
        sortDir: 'desc' 
      });
      if (usersResponse.success) {
        setUsers(usersResponse.users || []);
      }
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchDashboardData();
    
    const interval = setInterval(() => {
      setRefreshCounter(prev => prev + 1);
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [refreshCounter]);

  // Refresh manually
  const handleRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  const userGrowthData = {
    '7d': [65, 78, 90, 81, 86, 95, 100],
    '30d': [50, 60, 75, 80, 85, 90, 95, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320],
    '90d': Array.from({length: 90}, (_, i) => 100 + i * 3)
  };

  const matchSuccessData = {
    '7d': [12, 19, 15, 25, 22, 30, 28],
    '30d': Array.from({length: 30}, () => Math.floor(Math.random() * 50) + 10),
    '90d': Array.from({length: 90}, () => Math.floor(Math.random() * 50) + 10)
  };

  const revenueData = {
    '7d': [1200, 1900, 1500, 2500, 2200, 3000, 2800],
    '30d': Array.from({length: 30}, () => Math.floor(Math.random() * 5000) + 1000),
    '90d': Array.from({length: 90}, () => Math.floor(Math.random() * 5000) + 1000)
  };

  const SimpleBarChart = ({ data, color = 'red' }) => {
    const maxValue = Math.max(...data);
    const colorClasses = {
      'red': 'bg-red-500',
      'green': 'bg-green-500',
      'blue': 'bg-blue-500',
      'purple': 'bg-purple-500',
      'yellow': 'bg-yellow-500'
    };
    
    return (
      <div className="flex items-end justify-between h-20 md:h-32 gap-0.5 md:gap-1 mt-3 md:mt-4 px-1">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={`w-full ${colorClasses[color] || 'bg-red-500'} rounded-t transition-all duration-500 min-h-1`}
              style={{ height: `${(value / maxValue) * 100}%` }}
            />
            <span className="text-xs text-gray-500 mt-1 hidden md:block">{index + 1}</span>
          </div>
        ))}
      </div>
    );
  };

  const SimpleLineChart = ({ data, color = 'blue' }) => {
    const maxValue = Math.max(...data);
    const colorClasses = {
      'blue': 'text-blue-500',
      'green': 'text-green-500',
      'purple': 'text-purple-500',
      'red': 'text-red-500'
    };
    
    return (
      <div className="relative h-20 md:h-32 mt-3 md:mt-4">
        <svg viewBox={`0 0 ${data.length * 10} 100`} className="w-full h-full">
          <path
            d={`M 0,${100 - (data[0] / maxValue) * 100} ${data.map((value, index) => `L ${index * 10},${100 - (value / maxValue) * 100}`).join(' ')}`}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className={colorClasses[color] || 'text-blue-500'}
          />
        </svg>
      </div>
    );
  };

  // Loading state
  if (loading && !stats.totalUsers) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationCircleIcon className="w-6 h-6 text-red-500 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-red-700">Failed to Load Data</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Real-time statistics and analytics</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm md:text-base font-semibold text-gray-600 mb-1 md:mb-2">Total Users</h3>
              <p className="text-xl md:text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
            </div>
            <UsersIcon className="w-7 h-7 text-blue-500" />
          </div>
          <div className="flex items-center mt-1 md:mt-2">
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <p className="text-xs md:text-sm text-green-600">+{stats.newUsersToday} today</p>
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm md:text-base font-semibold text-gray-600 mb-1 md:mb-2">Successful Matches</h3>
              <p className="text-xl md:text-3xl font-bold text-gray-800">{stats.successfulMatches}</p>
            </div>
            <HeartIcon className="w-7 h-7 text-green-500" />
          </div>
          <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">
            {stats.matchRate}% match rate
          </p>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm md:text-base font-semibold text-gray-600 mb-1 md:mb-2">Revenue</h3>
              <p className="text-xl md:text-3xl font-bold text-gray-800">₹{(stats.revenue || 0).toLocaleString()}</p>
            </div>
            <BanknotesIcon className="w-7 h-7 text-purple-500" />
          </div>
          <div className="flex items-center mt-1 md:mt-2">
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <p className="text-xs md:text-sm text-green-600">₹{stats.todayPayments || 0} today</p>
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm md:text-base font-semibold text-gray-600 mb-1 md:mb-2">Active Users</h3>
              <p className="text-xl md:text-3xl font-bold text-gray-800">{stats.dailyActiveUsers}</p>
            </div>
            <FireIcon className="w-7 h-7 text-yellow-500" />
          </div>
          <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">
            {stats.engagementRate}% engagement
          </p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Premium Users</p>
            <p className="text-lg font-bold text-gray-800">{stats.premiumUsers}</p>
            <p className="text-xs text-blue-600">{stats.conversionRate}% conversion</p>
          </div>
        </div>
        
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Verified Profiles</p>
            <p className="text-lg font-bold text-gray-800">{stats.verifiedProfiles}</p>
            <p className="text-xs text-green-600">{stats.verificationRate}% verified</p>
          </div>
        </div>
        
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Pending Verifications</p>
            <p className="text-lg font-bold text-gray-800">{stats.pendingVerifications}</p>
            <p className="text-xs text-yellow-600">Awaiting approval</p>
          </div>
        </div>
        
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
            <p className="text-lg font-bold text-gray-800">₹{(stats.monthlyRevenue || 0).toLocaleString()}</p>
            <p className="text-xs text-purple-600">This month</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">User Growth</h3>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
          </div>
          <SimpleLineChart data={userGrowthData[timeRange]} color="blue" />
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Daily Matches</h3>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
          </div>
          <SimpleBarChart data={matchSuccessData[timeRange]} color="green" />
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Revenue Trend</h3>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
          </div>
          <SimpleLineChart data={revenueData[timeRange]} color="purple" />
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">User Demographics</h3>
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Male</span>
              <span className="font-semibold text-sm md:text-base">58%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '58%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Female</span>
              <span className="font-semibold text-sm md:text-base">42%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-pink-600 h-2 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Recent Registrations</h3>
            <span className="text-xs text-gray-500">{users.length} users</span>
          </div>
          <div className="space-y-2 md:space-y-3">
            {users.length > 0 ? (
              users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 font-semibold text-sm">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm md:text-base truncate">{user.name || 'Unknown User'}</p>
                      <p className="text-xs md:text-sm text-gray-600 truncate">{user.email || 'No email'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ml-2 ${
                    user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                    user.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status || 'UNKNOWN'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No recent users found
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <Button 
              variant="primary" 
              className="py-2 md:py-3 flex items-center justify-center text-xs md:text-sm"
              onClick={() => window.location.href = '/admin/messages'}
            >
              <EnvelopeIcon className="w-5 h-5 mr-2" /> Send Broadcast
            </Button>
            <Button 
              variant="secondary" 
              className="py-2 md:py-3 flex items-center justify-center text-xs md:text-sm"
              onClick={() => window.location.href = '/admin/users'}
            >
              <UserGroupIcon className="w-5 h-5 mr-2" /> Manage Users
            </Button>
            <Button 
              variant="secondary" 
              className="py-2 md:py-3 flex items-center justify-center text-xs md:text-sm"
              onClick={() => window.location.href = '/admin/membership'}
            >
              <SparklesIcon className="w-5 h-5 mr-2" /> Membership
            </Button>
            <Button 
              variant="secondary" 
              className="py-2 md:py-3 flex items-center justify-center text-xs md:text-sm"
              onClick={() => window.location.href = '/admin/analytics'}
            >
              <ChartBarIcon className="w-5 h-5 mr-2" /> View Reports
            </Button>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-xs text-gray-500 pt-4 border-t">
        <p>Last updated: {new Date().toLocaleTimeString()} • Auto-refreshes every 30 seconds</p>
      </div>
    </div>
  );
}

export default DashboardOverview;