import { useState, useEffect } from "react";
import adminService from "../../../services/adminService";

function GeographicAnalytics() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [loading, setLoading] = useState(true);
  const [geographicData, setGeographicData] = useState({
    cityDistribution: {},
    stateDistribution: {},
    countryDistribution: {},
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

  // Fetch geographic analytics
  const fetchGeographicAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getGeographicAnalytics();
      
      if (response.success) {
        setGeographicData({
          cityDistribution: response.cityDistribution || {},
          stateDistribution: response.stateDistribution || {},
          countryDistribution: response.countryDistribution || {},
          success: true
        });
      }
    } catch (error) {
      console.error('Error fetching geographic analytics:', error);
      showNotification(error.message || 'Failed to load geographic analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchGeographicAnalytics();
  }, []);

  // Calculate total users from all distributions
  const totalUsers = Object.values(geographicData.stateDistribution || {}).reduce((sum, count) => sum + count, 0);
  
  // Get top cities (convert cityDistribution object to array and sort)
  const topCities = Object.entries(geographicData.cityDistribution || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Get region distribution (using stateDistribution as regions)
  const regionDistribution = geographicData.stateDistribution || {};
  const topRegions = Object.entries(regionDistribution)
    .sort(([, a], [, b]) => b - a);

  // Get country distribution
  const countryDistribution = geographicData.countryDistribution || {};

  const getRegionColor = (region, index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ];
    return colors[index % colors.length] || 'bg-gray-500';
  };

  // Format region name for display
  const formatRegionName = (region) => {
    if (!region || region === 'Unknown') return 'Other';
    return region;
  };

  // Get region positions for map visualization
  const getRegionPosition = (index, total) => {
    const positions = [
      'top-1/4 left-1/4',
      'top-1/4 right-1/4',
      'top-1/2 left-1/4',
      'top-1/2 right-1/4',
      'bottom-1/4 left-1/3',
      'bottom-1/4 right-1/3',
      'top-1/3 left-1/2',
      'top-2/3 right-1/3',
      'bottom-1/3 left-2/3',
      'top-1/4 left-1/2'
    ];
    return positions[index % positions.length] || 'top-1/2 left-1/2';
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading geographic analytics...</p>
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
            {Object.keys(geographicData.cityDistribution || {}).length}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Cities</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-green-500">
          <div className="text-xl md:text-2xl font-bold text-green-600 mb-1 md:mb-2">
            {Object.keys(regionDistribution).length}
          </div>
          <div className="text-xs md:text-sm text-gray-600">States/Regions</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-purple-500">
          <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1 md:mb-2">
            {Object.keys(countryDistribution).length}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Countries</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-yellow-500">
          <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1 md:mb-2">
            {totalUsers}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Total Users</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* City Distribution */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">User Distribution by City</h3>
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All States</option>
              {Object.keys(regionDistribution).map(region => (
                <option key={region} value={region}>{formatRegionName(region)}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:space-y-3 max-h-96 overflow-y-auto">
            {topCities.length > 0 ? (
              topCities.map(([city, count], index) => (
                <div key={city} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="text-sm text-gray-600 truncate flex-1 mr-2">{city || 'Unknown City'}</span>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <div className="w-20 md:w-32 bg-gray-200 rounded-full h-2 mr-2 md:mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(count / totalUsers) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs md:text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-3xl mb-3">🏙️</div>
                <p className="text-sm">No city data available</p>
              </div>
            )}
          </div>
        </div>

        {/* State/Region Distribution */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">State/Regional Distribution</h3>
          <div className="space-y-3 md:space-y-4">
            {topRegions.length > 0 ? (
              topRegions.slice(0, 8).map(([region, count], index) => (
                <div key={region} className="space-y-1">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${getRegionColor(region, index)}`}></span>
                      {formatRegionName(region)}
                    </span>
                    <span>{count} users ({totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : 0}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getRegionColor(region, index)}`}
                      style={{ width: `${totalUsers > 0 ? (count / totalUsers) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-3xl mb-3">🗺️</div>
                <p className="text-sm">No regional data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Visualization and Country Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Geographic Coverage Map</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* India map background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3 opacity-20">🇮🇳</div>
                <p className="text-sm text-gray-400">India - User Distribution</p>
              </div>
            </div>
            
            {/* Regional indicators */}
            {topRegions.length > 0 ? (
              topRegions.slice(0, 6).map(([region, count], index) => (
                <div 
                  key={region}
                  className={`absolute ${getRegionPosition(index, topRegions.length)} transform -translate-x-1/2 -translate-y-1/2`}
                >
                  <div 
                    className={`${getRegionColor(region, index)} text-white text-xs px-2 py-1 rounded-full shadow-lg flex flex-col items-center justify-center min-w-[70px]`}
                  >
                    <span className="font-semibold">{formatRegionName(region)}</span>
                    <span className="text-xs opacity-90">{count}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-3">🗺️</div>
                <p className="text-sm text-gray-500">No geographic data to display</p>
              </div>
            )}
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            Showing user distribution across states
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Country Distribution</h3>
          <div className="space-y-3">
            {Object.entries(countryDistribution).length > 0 ? (
              Object.entries(countryDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([country, count], index) => (
                  <div key={country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">
                        {country === 'India' ? '🇮🇳' : country === 'USA' ? '🇺🇸' : country === 'UK' ? '🇬🇧' : '🌍'}
                      </span>
                      <div>
                        <span className="text-sm font-medium text-gray-800 block">{country}</span>
                        <span className="text-xs text-gray-500">
                          {totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : 0}% of users
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${totalUsers > 0 ? (count / totalUsers) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-3xl mb-3">🌍</div>
                <p className="text-sm">No country data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Regional Growth Metrics</h3>
          <button
            onClick={fetchGeographicAnalytics}
            className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded hover:bg-blue-100 transition-colors"
          >
            ↻ Refresh Data
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topRegions.length > 0 ? (
            topRegions.slice(0, 6).map(([region, count], index) => {
              // Calculate mock growth rate (in real app, this would come from backend)
              const growthRate = 5 + (index * 2) + Math.floor(Math.random() * 5);
              const isPositiveGrowth = growthRate > 0;
              
              return (
                <div key={region} className="text-center p-3 bg-gray-50 rounded-lg hover:shadow-sm transition-shadow">
                  <div className={`w-12 h-12 rounded-full ${getRegionColor(region, index)} flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-white text-lg">
                      {isPositiveGrowth ? '↑' : '↓'}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">{count}</div>
                  <div className="text-sm text-gray-600 truncate" title={formatRegionName(region)}>
                    {formatRegionName(region)}
                  </div>
                  <div className={`text-xs mt-1 ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositiveGrowth ? '+' : ''}{growthRate}% growth
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-6 text-center py-8 text-gray-500">
              <div className="text-3xl mb-3">📊</div>
              <p className="text-sm">No regional growth data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Geographic Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-blue-600 mr-2">🏆</span>
              <span className="text-sm font-medium text-gray-800">Top City</span>
            </div>
            <div className="text-lg font-bold text-gray-800">
              {topCities.length > 0 ? topCities[0][0] || 'N/A' : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">
              {topCities.length > 0 ? `${topCities[0][1]} users` : 'No data'}
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-green-600 mr-2">📍</span>
              <span className="text-sm font-medium text-gray-800">Top State</span>
            </div>
            <div className="text-lg font-bold text-gray-800">
              {topRegions.length > 0 ? formatRegionName(topRegions[0][0]) : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">
              {topRegions.length > 0 ? `${topRegions[0][1]} users` : 'No data'}
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-purple-600 mr-2">🌐</span>
              <span className="text-sm font-medium text-gray-800">Diversity Score</span>
            </div>
            <div className="text-lg font-bold text-gray-800">
              {Object.keys(regionDistribution).length > 0 ? 
                Math.min(100, Math.floor(Object.keys(regionDistribution).length * 10)) : 0}%
            </div>
            <div className="text-sm text-gray-600">
              Based on {Object.keys(regionDistribution).length} regions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeographicAnalytics;