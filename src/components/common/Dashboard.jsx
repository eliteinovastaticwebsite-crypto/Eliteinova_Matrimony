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
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ProfileService from '../../services/profileService';
import ThemeDecorations from './ThemeDecorations';

const Dashboard = () => {
  const { user } = useAuth();
  const { membershipType, theme, colors, classes } = useTheme();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [membershipUsers, setMembershipUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Debug logging
  useEffect(() => {
    console.log('🎨 Dashboard - User data:', user);
    console.log('🎨 Dashboard - Membership type detected:', membershipType);
    console.log('🎨 Dashboard - Theme:', theme);
  }, [user, membershipType, theme]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch profiles from the same membership type
        const userMembershipType = membershipType || user?.membership || user?.membershipType || 'SILVER';
        console.log('🔍 Fetching profiles for membership type:', userMembershipType);
        
        const profilesData = await ProfileService.getAllProfiles(0, 12, userMembershipType);
        const profiles = profilesData.content || profilesData.profiles || [];
        
        console.log('✅ Fetched profiles:', profiles.length);
        console.log('📊 Profile data:', profiles);
        setMembershipUsers(profiles);

        // Mock stats (can be replaced with real API call later)
        const mockStats = {
          totalMatches: profiles.length || 47,
          unreadMessages: 12,
          profileViews: 1250,
          newMatchesToday: profiles.length || 8,
          likesReceived: 23,
          profileCompletion: 85,
          premiumMembers: 156,
          responseRate: 92
        };

        const mockActivity = [
          {
            id: 1,
            type: 'new_match',
            user: profiles[0]?.name || 'Priya Sharma',
            time: new Date(Date.now() - 1000 * 60 * 30),
            message: 'New match found based on your preferences',
            read: false
          },
          {
            id: 2,
            type: 'profile_view',
            user: profiles[1]?.name || 'Anjali Reddy',
            time: new Date(Date.now() - 1000 * 60 * 120),
            message: 'Viewed your profile',
            read: true
          },
          {
            id: 3,
            type: 'message',
            user: profiles[2]?.name || 'Divya Iyer',
            time: new Date(Date.now() - 1000 * 60 * 180),
            message: 'Sent you a message',
            read: false
          },
          {
            id: 4,
            type: 'like',
            user: profiles[3]?.name || 'Rajesh Kumar',
            time: new Date(Date.now() - 1000 * 60 * 240),
            message: 'Liked your profile',
            read: true
          }
        ];

        setStats(mockStats);
        setRecentActivity(mockActivity);
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
        // Fallback to mock data
        setStats({
          totalMatches: 47,
          unreadMessages: 12,
          profileViews: 1250,
          newMatchesToday: 8,
          likesReceived: 23,
          profileCompletion: 85,
          premiumMembers: 156,
          responseRate: 92
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.bgGradientStyle }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto"
            style={{ borderColor: colors.accent }}
          ></div>
          <p className={`mt-4 ${classes.textColor}`}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: colors.bgGradientStyle }}
    >
      {/* Animated Background Blobs - Membership-based colors */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div 
          className="absolute top-10 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob"
          style={{ backgroundColor: colors.blob1 }}
        ></div>
        <div 
          className="absolute top-10 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"
          style={{ backgroundColor: colors.blob2 }}
        ></div>
        <div 
          className="absolute bottom-10 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"
          style={{ backgroundColor: colors.blob3 }}
        ></div>
      </div>
      
      {/* Theme Decorations - Sparkles, Coins, Diamonds */}
      <ThemeDecorations membershipType={membershipType} colors={colors} />

      {/* Header - Membership-based styling */}
      <header 
        className="text-white shadow-xl relative z-10"
        style={{ background: colors.headerGradientStyle }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">
                {membershipType} MEMBER
              </span>
            </div>
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

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Welcome Section - Membership-based styling */}
        <div 
          className="rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden"
          style={{ background: colors.welcomeCardGradient }}
        >
          {/* Membership Badge */}
          <div className="absolute top-4 right-4">
            <span 
              className="px-4 py-2 rounded-full text-sm font-bold uppercase shadow-lg"
              style={{
                backgroundColor: colors.welcomeBadgeBg,
                color: colors.welcomeBadgeText
              }}
            >
              {membershipType} Member
            </span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome Back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
              <p className="text-white/90 text-lg">Here's what's happening with your {membershipType} matches today</p>
              <p className="text-white/70 text-sm mt-2">
                Showing {membershipUsers.length} {membershipType} members in your network
              </p>
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
            icon={<UsersIcon className="w-8 h-8" style={{ color: colors.accent }} />}
            value={stats.totalMatches}
            label="Total Matches"
            change="+12%"
            changeType="positive"
            color={classes.accent}
            theme={{ cardBg: classes.cardBg, textColor: classes.textColor, accentColor: colors.accent }}
          />
          <StatCard
            icon={<EnvelopeIcon className="w-8 h-8" style={{ color: colors.accent }} />}
            value={stats.unreadMessages}
            label="Unread Messages"
            change="+5 new"
            changeType="positive"
            color={classes.accent}
            theme={{ cardBg: classes.cardBg, textColor: classes.textColor, accentColor: colors.accent }}
          />
          <StatCard
            icon={<EyeIcon className="w-8 h-8" style={{ color: colors.accent }} />}
            value={stats.profileViews}
            label="Profile Views"
            change="+23%"
            changeType="positive"
            color={classes.accent}
            theme={{ cardBg: classes.cardBg, textColor: classes.textColor, accentColor: colors.accent }}
          />
          <StatCard
            icon={<ChartBarIcon className="w-8 h-8" style={{ color: colors.accent }} />}
            value={`${stats.responseRate}%`}
            label="Response Rate"
            change="Excellent"
            changeType="positive"
            color={classes.accent}
            theme={{ cardBg: classes.cardBg, textColor: classes.textColor, accentColor: colors.accent }}
          />
        </div>

        {/* Membership Users Section */}
        {membershipUsers.length > 0 && (
          <div 
            className={`${classes.cardBg} rounded-2xl shadow-lg p-6 border mb-8`}
            style={{ borderColor: `${colors.accent}40` }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${classes.textColor}`}>
                  {membershipType} Members ({membershipUsers.length})
                </h2>
                <p className={`${classes.textColor} opacity-70 text-sm mt-1`}>
                  Other {membershipType} members you can connect with
                </p>
              </div>
              <Link 
                to="/profiles" 
                className="font-semibold text-sm hover:underline"
                style={{ color: colors.accent }}
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {membershipUsers.slice(0, 6).map((profile) => (
                <Link
                  key={profile.id}
                  to={`/profiles/${profile.id}`}
                  className="text-center group"
                >
                  <div className={`w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br ${classes.secondary} flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                    {profile.name?.charAt(0) || 'U'}
                  </div>
                  <p className={`${classes.textColor} font-medium text-sm truncate`}>
                    {profile.name || 'Unknown'}
                  </p>
                  {profile.age && (
                    <p className={`${classes.textColor} opacity-60 text-xs`}>
                      {profile.age} years
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div 
            className={`${classes.cardBg} rounded-2xl shadow-lg p-6 border`}
            style={{ borderColor: `${colors.accent}40` }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${classes.textColor}`}>Recent Activity</h2>
              <Link 
                to="/matches" 
                className="font-semibold text-sm hover:underline"
                style={{ color: colors.accent }}
              >
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
          <div 
            className={`${classes.cardBg} rounded-2xl shadow-lg p-6 border`}
            style={{ borderColor: `${colors.accent}40` }}
          >
            <h2 className={`text-2xl font-bold ${classes.textColor} mb-6`}>Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/matches"
                className={`p-6 bg-gradient-to-br ${classes.primary} text-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-center`}
              >
                <UsersIcon className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold">Browse Matches</p>
                <p className="text-white/80 text-sm mt-1">{stats.newMatchesToday} new today</p>
              </Link>
              <Link
                to="/messages"
                className={`p-6 bg-gradient-to-br ${classes.secondary} text-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-center`}
              >
                <EnvelopeIcon className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold">Messages</p>
                <p className="text-white/80 text-sm mt-1">{stats.unreadMessages} unread</p>
              </Link>
              <Link
                to="/my-profile"
                className={`p-6 bg-gradient-to-br ${classes.primary} text-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-center`}
              >
                <CheckBadgeIcon className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold">My Profile</p>
                <p className="text-white/80 text-sm mt-1">{stats.profileCompletion}% complete</p>
              </Link>
              <Link
                to="/upgrade"
                className={`p-6 bg-gradient-to-br ${classes.secondary} text-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-center`}
              >
                <SparklesIcon className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold">Upgrade</p>
                <p className="text-white/80 text-sm mt-1">Go Premium</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div 
            className={`${classes.cardBg} rounded-2xl shadow-lg p-6 border text-center`}
            style={{ borderColor: `${colors.accent}40` }}
          >
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: colors.accentLight }}
            >
              <HeartIcon style={{ color: colors.accent }} className="w-8 h-8" />
            </div>
            <h3 className={`text-2xl font-bold ${classes.textColor}`}>{stats.likesReceived}</h3>
            <p className={`${classes.textColor} opacity-70`}>Likes Received</p>
          </div>
          <div 
            className={`${classes.cardBg} rounded-2xl shadow-lg p-6 border text-center`}
            style={{ borderColor: `${colors.accent}40` }}
          >
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: colors.accentLight }}
            >
              <UserPlusIcon style={{ color: colors.accent }} className="w-8 h-8" />
            </div>
            <h3 className={`text-2xl font-bold ${classes.textColor}`}>{membershipUsers.length}</h3>
            <p className={`${classes.textColor} opacity-70`}>{membershipType} Members</p>
          </div>
          <div 
            className={`${classes.cardBg} rounded-2xl shadow-lg p-6 border text-center`}
            style={{ borderColor: `${colors.accent}40` }}
          >
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: colors.accentLight }}
            >
              <ChartBarIcon style={{ color: colors.accent }} className="w-8 h-8" />
            </div>
            <h3 className={`text-2xl font-bold ${classes.textColor}`}>{stats.newMatchesToday}</h3>
            <p className={`${classes.textColor} opacity-70`}>New Today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, value, label, change, changeType, color, theme }) => {
  const colorClasses = {
    gray: 'bg-gray-50 border-gray-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
    blue: 'bg-blue-50 border-blue-200'
  };

  const changeColor = changeType === 'positive' ? 'text-green-600' : 'text-red-600';
  const cardClass = theme ? theme.cardBg : (colorClasses[color] || colorClasses.gray);
  const borderColor = theme ? `${theme.accentColor}40` : undefined;

  return (
    <div 
      className={`${cardClass} rounded-2xl p-6 border-2 transition hover:shadow-lg`}
      style={borderColor ? { borderColor } : {}}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white rounded-xl shadow-sm">
          {icon}
        </div>
        <span className={`text-sm font-semibold ${changeColor}`}>
          {change}
        </span>
      </div>
      <h3 className={`text-3xl font-bold ${theme?.textColor || 'text-gray-800'} mb-1`}>{value}</h3>
      <p className={`${theme?.textColor || 'text-gray-600'} opacity-70 font-medium`}>{label}</p>
    </div>
  );
};

export default Dashboard;