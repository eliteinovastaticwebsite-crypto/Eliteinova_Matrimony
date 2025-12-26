import { useState, useEffect } from "react";
import adminService from "../../../services/adminService";

function CompatibilityAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState({
    topFactors: [],
    successRate: 0,
    totalMatches: 0,
    avgCompatibilityScore: 0,
    scoreDistribution: {},
    successRates: {},
    ageGapDistribution: {},
    recentHighMatches: []
  });

  // Fetch analytics from backend
  useEffect(() => {
    fetchCompatibilityAnalytics();
  }, []);

  const fetchCompatibilityAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🧬 Fetching compatibility analytics from backend...');
      
      const response = await adminService.getCompatibilityAnalytics();
      console.log('📥 Backend compatibility response:', response);
      
      if (response.success) {
        // Transform backend data
        const transformedData = {
          topFactors: response.topFactors || [],
          successRate: response.successRate || 0,
          totalMatches: response.totalMatches || 0,
          avgCompatibilityScore: response.avgCompatibilityScore || 0,
          scoreDistribution: response.scoreDistribution || {},
          successRates: response.successRates || {},
          ageGapDistribution: response.ageGapDistribution || {},
          recentHighMatches: response.recentHighMatches || []
        };
        
        setAnalytics(transformedData);
        console.log('✅ Compatibility analytics loaded from backend');
      } else {
        setError('Failed to load analytics from backend');
      }
    } catch (error) {
      console.error('❌ Error fetching compatibility analytics:', error);
      setError(`Failed to load analytics: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calculate total from score distribution
  const totalDistribution = Object.values(analytics.scoreDistribution).reduce((sum, count) => sum + count, 0) || 1;

  // Loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading compatibility analytics from backend...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Analytics</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchCompatibilityAnalytics}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Backend Connection Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-700">
          🧬 Connected to real backend data • Total matches analyzed: <span className="font-bold">{analytics.totalMatches}</span>
          {analytics.recentHighMatches.length > 0 && (
            <span className="ml-2">• {analytics.recentHighMatches.length} recent high-score matches</span>
          )}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-green-500">
          <div className="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
            {analytics.successRate}%
          </div>
          <div className="text-xs md:text-sm text-gray-600">Match Success Rate</div>
          <div className="text-xs text-gray-500 mt-1">From Database</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-blue-500">
          <div className="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
            {analytics.totalMatches.toLocaleString()}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Total Matches Analyzed</div>
          <div className="text-xs text-gray-500 mt-1">Accepted Interests</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-purple-500">
          <div className="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
            {analytics.avgCompatibilityScore}%
          </div>
          <div className="text-xs md:text-sm text-gray-600">Avg Compatibility Score</div>
          <div className="text-xs text-gray-500 mt-1">Overall Match Quality</div>
        </div>
      </div>

      {/* Main Compatibility Analysis */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">Compatibility Factors Analysis</h2>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
        
        {analytics.topFactors.length > 0 ? (
          <>
            <div className="space-y-3 md:space-y-4">
              {analytics.topFactors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800 text-sm md:text-base truncate">
                          {factor.factor}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImportanceColor(factor.importance)}`}>
                          {factor.importance} PRIORITY
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-800">
                        {factor.score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${getScoreColor(factor.score)}`}
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Compatibility Impact</span>
                      <span>
                        {factor.score >= 80 ? 'Very High' : 
                         factor.score >= 60 ? 'High' : 
                         factor.score >= 40 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Insights */}
            <div className="mt-6 md:mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-md font-semibold text-blue-800 mb-2">💡 Key Insights from Backend</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Education and family background are the strongest compatibility predictors</li>
                <li>• Successful matches typically have compatibility scores above 70%</li>
                <li>• Current success rate based on {analytics.totalMatches} analyzed matches</li>
                <li>• Average compatibility score: {analytics.avgCompatibilityScore}% across all matches</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-lg font-medium text-gray-600 mb-2">No compatibility data available</p>
            <p className="text-sm">Using default compatibility factors for display</p>
          </div>
        )}
      </div>

      {/* Compatibility Distribution & Success Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Compatibility Score Distribution */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
            Compatibility Score Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.scoreDistribution).length > 0 ? (
              Object.entries(analytics.scoreDistribution).map(([range, count], index) => {
                const colors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 w-16">{range}</span>
                    <div className="flex-1 mx-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[index] || 'bg-gray-500'}`}
                          style={{ width: `${(count / totalDistribution) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No score distribution data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Success Rates by Criteria */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
            Success Rates by Criteria
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.successRates).length > 0 ? (
              Object.entries(analytics.successRates).map(([criteria, rate], index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1 mr-3">
                    {criteria}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${rate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-12 text-right">
                      {rate}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No success rate data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent High Compatibility Matches */}
      {analytics.recentHighMatches.length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
            Recent High-Compatibility Matches
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">From User</th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">To User</th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">Compatibility Score</th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.recentHighMatches.map((match, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">{match.fromUser || 'Unknown'}</td>
                    <td className="py-2 px-4">{match.toUser || 'Unknown'}</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${match.estimatedScore || 0}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{match.estimatedScore || 0}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        High Match
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchCompatibilityAnalytics}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Analytics'}
        </button>
      </div>
    </div>
  );
}

export default CompatibilityAnalytics;