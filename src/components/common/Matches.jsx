// src/components/Matches.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  UserIcon, 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  SparklesIcon,
  CheckBadgeIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon
} from '@heroicons/react/24/solid';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced mock data with more details
  useEffect(() => {
    const mockMatches = [
      {
        id: 1,
        name: 'Priya Sharma',
        age: 28,
        location: 'Chennai, Tamil Nadu',
        occupation: 'Doctor',
        education: 'MBBS, AIIMS Delhi',
        photos: [],
        matchScore: 92,
        isPremium: true,
        isVerified: true,
        isOnline: true,
        lastActive: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
        religion: 'Hindu',
        caste: 'Iyer',
        height: '5.4 ft',
        maritalStatus: 'Never Married',
        about: 'Caring and family-oriented doctor looking for a meaningful connection. Love traveling and classical music.',
        interests: ['Travel', 'Music', 'Reading', 'Yoga']
      },
      {
        id: 2,
        name: 'Anjali Reddy',
        age: 26,
        location: 'Bangalore, Karnataka',
        occupation: 'Software Engineer',
        education: 'B.Tech Computer Science',
        photos: [],
        matchScore: 87,
        isPremium: true,
        isVerified: false,
        isOnline: false,
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        religion: 'Hindu',
        caste: 'Reddy',
        height: '5.3 ft',
        maritalStatus: 'Never Married',
        about: 'Tech enthusiast who loves coding and exploring new technologies. Enjoy hiking and photography.',
        interests: ['Technology', 'Hiking', 'Photography', 'Cooking']
      },
      {
        id: 3,
        name: 'Divya Iyer',
        age: 27,
        location: 'Coimbatore, Tamil Nadu',
        occupation: 'Architect',
        education: 'B.Arch, IIT Kharagpur',
        photos: [],
        matchScore: 95,
        isPremium: false,
        isVerified: true,
        isOnline: true,
        lastActive: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
        religion: 'Hindu',
        caste: 'Iyer',
        height: '5.5 ft',
        maritalStatus: 'Never Married',
        about: 'Creative architect passionate about sustainable design. Love classical dance and painting.',
        interests: ['Architecture', 'Dance', 'Painting', 'Sustainability']
      }
    ];

    setMatches(mockMatches);
    setFilteredMatches(mockMatches);
    setLoading(false);
  }, []);

  // Filter matches based on active filter and search
  useEffect(() => {
    let filtered = matches;

    // Apply active filter
    switch (activeFilter) {
      case 'premium':
        filtered = filtered.filter(match => match.isPremium);
        break;
      case 'verified':
        filtered = filtered.filter(match => match.isVerified);
        break;
      case 'online':
        filtered = filtered.filter(match => match.isOnline);
        break;
      case 'high-match':
        filtered = filtered.filter(match => match.matchScore >= 90);
        break;
      default:
        filtered = matches;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(match =>
        match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.occupation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMatches(filtered);
  }, [activeFilter, searchTerm, matches]);

  const filters = [
    { id: 'all', label: 'All Matches', count: matches.length },
    { id: 'premium', label: 'Premium', count: matches.filter(m => m.isPremium).length },
    { id: 'verified', label: 'Verified', count: matches.filter(m => m.isVerified).length },
    { id: 'online', label: 'Online Now', count: matches.filter(m => m.isOnline).length },
    { id: 'high-match', label: 'High Match', count: matches.filter(m => m.matchScore >= 90).length }
  ];

  const handleConnect = (matchId) => {
    // Implement connect logic
    console.log('Connecting with match:', matchId);
    alert('Connection request sent!');
  };

  const handleLike = (matchId) => {
    // Implement like logic
    console.log('Liked match:', matchId);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
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
                  {/* ❌ OLD: Dashboard link - commented out, dashboard removed */}
                  {/* <Link to="/dashboard" className="hover:text-yellow-300 transition font-medium">
                    Dashboard
                  </Link> */}
                  <Link to="/profiles" className="hover:text-yellow-300 transition font-medium">
                    View All Profiles
                  </Link>
                </li>
                <li>
                  <Link to="/matches" className="text-yellow-300 font-semibold border-b-2 border-yellow-300 pb-1">
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
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="p-3 bg-red-100 rounded-xl">
                <HeartIcon className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Your Matches</h1>
                <p className="text-gray-600">Discover compatible partners</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                <span className="text-red-600 font-bold">{filteredMatches.length}</span>
                <span className="text-gray-600 ml-1">matches found</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SparklesIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search matches by name, location, or profession..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center px-4 py-2 rounded-xl font-semibold transition ${
                  activeFilter === filter.id
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{filter.label}</span>
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  activeFilter === filter.id
                    ? 'bg-white text-red-600'
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No matches found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No matches found for "${searchTerm}". Try adjusting your search criteria.`
                : "Complete your profile and preferences to get better matches tailored for you."
              }
            </p>
            <Link 
              to="/my-profile" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition inline-block"
            >
              Complete My Profile
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map(match => (
              <div key={match.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Match Header */}
                <div className="relative p-6">
                  {/* Match Score Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                    {match.matchScore}% Match
                  </div>
                  
                  {/* Profile Photo */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-semibold text-2xl shadow-lg">
                        {match.photos.length > 0 ? (
                          <img 
                            src={match.photos[0]} 
                            alt={match.name}
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        ) : (
                          <UserIcon className="w-10 h-10" />
                        )}
                      </div>
                      
                      {/* Online Indicator */}
                      {match.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg"></div>
                      )}
                      
                      {/* Premium Badge */}
                      {match.isPremium && (
                        <div className="absolute -top-2 -left-2 bg-yellow-500 text-white p-1 rounded-full shadow-lg">
                          <SparklesIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-800">{match.name}, {match.age}</h3>
                        {match.isVerified && (
                          <CheckBadgeIcon className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <BriefcaseIcon className="w-4 h-4" />
                          <span>{match.occupation}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{match.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AcademicCapIcon className="w-4 h-4" />
                          <span>{match.education}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Details */}
                <div className="px-6 pb-4">
                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-red-50 text-red-700 px-2 py-1 rounded-lg text-xs font-medium">
                      {match.religion}
                    </span>
                    <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-medium">
                      {match.caste}
                    </span>
                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
                      {match.height}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                      {match.maritalStatus}
                    </span>
                  </div>

                  {/* About Preview */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {match.about}
                  </p>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {match.interests.slice(0, 3).map((interest, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {interest}
                      </span>
                    ))}
                    {match.interests.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        +{match.interests.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLike(match.id)}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-semibold transition flex items-center justify-center space-x-2"
                    >
                      <HeartIcon className="w-4 h-4" />
                      <span>Like</span>
                    </button>
                    <button
                      onClick={() => handleConnect(match.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition flex items-center justify-center space-x-2"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      <span>Connect</span>
                    </button>
                  </div>
                </div>

                {/* Last Active */}
                <div className="px-6 py-3 bg-gray-50 rounded-b-2xl border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    {match.isOnline ? 'Online now' : `Active ${getTimeAgo(match.lastActive)}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;