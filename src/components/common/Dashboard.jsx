// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UsersIcon,
  EnvelopeIcon,
  EyeIcon,
  HeartIcon,
  ChartBarIcon,
  UserPlusIcon,
  SparklesIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/solid';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockStats = {
      totalMatches: 47,
      unreadMessages: 12,
      profileViews: 1250,
      newMatchesToday: 8,
      likesReceived: 23,
      profileCompletion: 85,
      premiumMembers: 156,
      responseRate: 92
    };

    const mockActivity = [
      {
        id: 1,
        type: 'new_match',
        user: 'Priya Sharma',
        time: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        message: 'New match found based on your preferences',
        read: false
      },
      {
        id: 2,
        type: 'profile_view',
        user: 'Anjali Reddy',
        time: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        message: 'Viewed your profile',
        read: true
      },
      {
        id: 3,
        type: 'message',
        user: 'Divya Iyer',
        time: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        message: 'Sent you a message',
        read: false
      },
      {
        id: 4,
        type: 'like',
        user: 'Rajesh Kumar',
        time: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
        message: 'Liked your profile',
        read: true
      }
    ];

    setStats(mockStats);
    setRecentActivity(mockActivity);
    setLoading(false);
  }, []);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_match':
        return <HeartIcon className="w-5 h-5 text-red-500" />;
      case 'profile_view':
        return <EyeIcon className="w-5 h-5 text-blue-500" />;
      case 'message':
        return <EnvelopeIcon className="w-5 h-5 text-green-500" />;
      case 'like':
        return <SparklesIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <UserPlusIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'new_match':
        return 'bg-red-100 border-red-200';
      case 'profile_view':
        return 'bg-blue-100 border-blue-200';
      case 'message':
        return 'bg-green-100 border-green-200';
      case 'like':
        return 'bg-yellow-100 border-yellow-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-800 to-red-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <Link to="/dashboard" className="text-yellow-300 font-semibold border-b-2 border-yellow-300 pb-1">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/matches" className="hover:text-yellow-300 transition font-medium">
                    Matches
                  </Link>
                </li>
                <li>
                  <Link to="/my-profile" className="hover:text-yellow-300 transition font-medium">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/messages" className="hover:text-yellow-300 transition font-medium">
                    Messages
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome Back! 👋</h1>
              <p className="text-red-100 text-lg">Here's what's happening with your matches today</p>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <p className="text-sm">Profile Completion</p>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex-1 bg-white/30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.profileCompletion}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{stats.profileCompletion}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<UsersIcon className="w-8 h-8 text-red-600" />}
            value={stats.totalMatches}
            label="Total Matches"
            change="+12%"
            changeType="positive"
            color="red"
          />
          <StatCard
            icon={<EnvelopeIcon className="w-8 h-8 text-yellow-600" />}
            value={stats.unreadMessages}
            label="Unread Messages"
            change="+5 new"
            changeType="positive"
            color="yellow"
          />
          <StatCard
            icon={<EyeIcon className="w-8 h-8 text-green-600" />}
            value={stats.profileViews}
            label="Profile Views"
            change="+23%"
            changeType="positive"
            color="green"
          />
          <StatCard
            icon={<ChartBarIcon className="w-8 h-8 text-blue-600" />}
            value={`${stats.responseRate}%`}
            label="Response Rate"
            change="Excellent"
            changeType="positive"
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
              <Link to="/matches" className="text-red-600 hover:text-red-700 font-semibold text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div
                  key={activity.id}
                  className={`flex items-center space-x-4 p-4 rounded-xl border transition ${
                    activity.read ? 'bg-gray-50 border-gray-200' : getActivityColor(activity.type)
                  } ${!activity.read ? 'animate-pulse' : ''}`}
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{activity.message}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{getTimeAgo(activity.time)}</p>
                    {!activity.read && (
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-1 ml-auto"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/matches"
                className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-center"
              >
                <UsersIcon className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold">Browse Matches</p>
                <p className="text-red-100 text-sm mt-1">{stats.newMatchesToday} new today</p>
              </Link>
              <Link
                to="/messages"
                className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-center"
              >
                <EnvelopeIcon className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold">Messages</p>
                <p className="text-yellow-100 text-sm mt-1">{stats.unreadMessages} unread</p>
              </Link>
              <Link
                to="/my-profile"
                className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-center"
              >
                <CheckBadgeIcon className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold">My Profile</p>
                <p className="text-green-100 text-sm mt-1">{stats.profileCompletion}% complete</p>
              </Link>
              <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-center cursor-pointer">
                <SparklesIcon className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold">Upgrade</p>
                <p className="text-blue-100 text-sm mt-1">Go Premium</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.likesReceived}</h3>
            <p className="text-gray-600">Likes Received</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlusIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.premiumMembers}</h3>
            <p className="text-gray-600">Premium Members</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.newMatchesToday}</h3>
            <p className="text-gray-600">New Today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, value, label, change, changeType, color }) => {
  const colorClasses = {
    red: 'bg-red-50 border-red-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200'
  };

  const changeColor = changeType === 'positive' ? 'text-green-600' : 'text-red-600';

  return (
    <div className={`${colorClasses[color]} rounded-2xl p-6 border-2 transition hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white rounded-xl shadow-sm">
          {icon}
        </div>
        <span className={`text-sm font-semibold ${changeColor}`}>
          {change}
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
};

export default Dashboard;