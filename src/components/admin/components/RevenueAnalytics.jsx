import { useState, useEffect } from 'react';
import adminService from "../../../services/adminService";

function RevenueAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [analyticsData, setAnalyticsData] = useState({
    monthlyRevenue: {},
    revenueByPlan: {},
    paymentMethodDistribution: {},
    dailyRevenueTrend: {}
  });
  const [stats, setStats] = useState({
    revenue: 0,
    monthlyRevenue: 0,
    premiumUsers: 0,
    conversionRate: 0,
    goldMembers: 0,
    silverMembers: 0,
    diamondMembers: 0,
    goldRevenue: 0,
    silverRevenue: 0,
    diamondRevenue: 0,
    upiPayments: 0,
    cardPayments: 0,
    netbankingPayments: 0,
    walletPayments: 0,
    upiAmount: 0,
    cardAmount: 0,
    netbankingAmount: 0,
    walletAmount: 0
  });

  // Fetch revenue analytics data
  const fetchRevenueAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.getRevenueAnalytics();
      
      if (response.success) {
        setAnalyticsData({
          monthlyRevenue: response.monthlyRevenue || {},
          revenueByPlan: response.revenueByPlan || {},
          paymentMethodDistribution: response.paymentMethodDistribution || {},
          dailyRevenueTrend: response.dailyRevenueTrend || {}
        });
        
        // Calculate derived stats from the analytics data
        calculateStats(response);
      } else {
        setError(response.message || "Failed to fetch revenue analytics");
      }
    } catch (err) {
      console.error("Error fetching revenue analytics:", err);
      setError(err.message || "Error fetching revenue analytics");
    } finally {
      setLoading(false);
    }
  };

  // Calculate derived stats from analytics data
  const calculateStats = (data) => {
    // Calculate total revenue from monthly data
    const monthlyRevenueValues = Object.values(data.monthlyRevenue || {});
    const totalRevenue = monthlyRevenueValues.reduce((sum, val) => sum + val, 0);
    
    // Calculate current month revenue (get last month's data)
    const monthKeys = Object.keys(data.monthlyRevenue || {});
    const currentMonthRevenue = monthKeys.length > 0 ? 
      data.monthlyRevenue[monthKeys[monthKeys.length - 1]] : 0;
    
    // Calculate premium users from revenue by plan
    const planRevenue = data.revenueByPlan || {};
    const premiumUsers = Object.values(planRevenue).reduce((sum, val) => sum + val, 0) / 1000; // Approximation
    
    // Calculate payment method stats
    const paymentMethods = data.paymentMethodDistribution || {};
    const totalTransactions = Object.values(paymentMethods).reduce((sum, val) => sum + val, 0);
    
    // Calculate plan-specific stats
    const silverRevenue = planRevenue.Silver || 0;
    const goldRevenue = planRevenue.Gold || 0;
    const diamondRevenue = planRevenue.Diamond || 0;
    
    // Calculate conversion rate (placeholder logic)
    const conversionRate = totalTransactions > 0 ? 
      Math.round((totalTransactions / (totalTransactions * 10)) * 100) : 0;
    
    // Set all calculated stats
    setStats({
      revenue: Math.round(totalRevenue),
      monthlyRevenue: Math.round(currentMonthRevenue),
      premiumUsers: Math.round(premiumUsers),
      conversionRate: conversionRate,
      goldMembers: Math.round(goldRevenue / 1000), // Approximation
      silverMembers: Math.round(silverRevenue / 1000), // Approximation
      diamondMembers: Math.round(diamondRevenue / 1000), // Approximation
      goldRevenue: Math.round(goldRevenue),
      silverRevenue: Math.round(silverRevenue),
      diamondRevenue: Math.round(diamondRevenue),
      upiPayments: paymentMethods.UPI || 0,
      cardPayments: (paymentMethods["Credit Card"] || 0) + (paymentMethods["Debit Card"] || 0),
      netbankingPayments: paymentMethods["Net Banking"] || 0,
      walletPayments: 0, // Not in current data
      upiAmount: (paymentMethods.UPI || 0) * 1000, // Approximation
      cardAmount: ((paymentMethods["Credit Card"] || 0) + (paymentMethods["Debit Card"] || 0)) * 1200,
      netbankingAmount: (paymentMethods["Net Banking"] || 0) * 800,
      walletAmount: 0 // Not in current data
    });
  };

  // Format chart data based on timeRange
  const getChartData = () => {
    const monthlyData = analyticsData.monthlyRevenue || {};
    const monthlyValues = Object.values(monthlyData);
    
    switch(timeRange) {
      case 'monthly':
        return monthlyValues;
      case 'quarterly':
        // Group months into quarters
        const quarterly = [];
        for (let i = 0; i < monthlyValues.length; i += 3) {
          const quarterSum = monthlyValues.slice(i, i + 3).reduce((sum, val) => sum + val, 0);
          quarterly.push(Math.round(quarterSum));
        }
        return quarterly;
      case 'yearly':
        // Sum all months for yearly total
        const yearlyTotal = monthlyValues.reduce((sum, val) => sum + val, 0);
        return [Math.round(yearlyTotal)];
      default:
        return monthlyValues;
    }
  };

  // Get labels for the chart
  const getChartLabels = () => {
    const monthlyKeys = Object.keys(analyticsData.monthlyRevenue || {});
    
    switch(timeRange) {
      case 'monthly':
        return monthlyKeys;
      case 'quarterly':
        return monthlyKeys.filter((_, i) => i % 3 === 0).map((month, i) => `Q${i + 1}`);
      case 'yearly':
        return ['Current Year'];
      default:
        return monthlyKeys;
    }
  };

  // Get membership data from backend response
  const getMembershipData = () => {
    const planRevenue = analyticsData.revenueByPlan || {};
    
    return {
      gold: { 
        count: stats.goldMembers, 
        revenue: planRevenue.Gold || stats.goldRevenue 
      },
      silver: { 
        count: stats.silverMembers, 
        revenue: planRevenue.Silver || stats.silverRevenue 
      },
      diamond: { 
        count: stats.diamondMembers, 
        revenue: planRevenue.Diamond || stats.diamondRevenue 
      }
    };
  };

  // Get payment methods data from backend response
  const getPaymentMethodsData = () => {
    const paymentMethods = analyticsData.paymentMethodDistribution || {};
    
    return {
      upi: { 
        count: paymentMethods.UPI || 0, 
        amount: stats.upiAmount 
      },
      card: { 
        count: stats.cardPayments, 
        amount: stats.cardAmount 
      },
      netbanking: { 
        count: paymentMethods["Net Banking"] || 0, 
        amount: stats.netbankingAmount 
      },
      wallet: { 
        count: stats.walletPayments, 
        amount: stats.walletAmount 
      }
    };
  };

  // Calculate pie chart percentages
  const calculatePieChartPercentages = () => {
    const membershipData = getMembershipData();
    const total = membershipData.gold.count + membershipData.silver.count + membershipData.diamond.count;
    
    if (total === 0) return { diamond: 0, gold: 0, silver: 0 };
    
    return {
      diamond: (membershipData.diamond.count / total) * 100,
      gold: (membershipData.gold.count / total) * 100,
      silver: (membershipData.silver.count / total) * 100
    };
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format large numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  // Initialize data
  useEffect(() => {
    fetchRevenueAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading revenue analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="mb-4">{error}</p>
        <button
          onClick={fetchRevenueAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const revenueTrend = getChartData();
  const chartLabels = getChartLabels();
  const membershipData = getMembershipData();
  const paymentMethods = getPaymentMethodsData();
  const piePercentages = calculatePieChartPercentages();
  const maxChartValue = Math.max(...revenueTrend, 1);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="bg-white rounded-lg shadow-sm p-1">
          {['monthly', 'quarterly', 'yearly'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
          <div className="text-xl md:text-3xl font-bold text-green-600 mb-1 md:mb-2">
            {formatCurrency(stats.revenue)}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
          <div className="text-xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">
            {formatCurrency(stats.monthlyRevenue)}
          </div>
          <div className="text-xs md:text-sm text-gray-600">This Month</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
          <div className="text-xl md:text-3xl font-bold text-purple-600 mb-1 md:mb-2">
            {formatNumber(stats.premiumUsers)}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Premium Users</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
          <div className="text-xl md:text-3xl font-bold text-yellow-600 mb-1 md:mb-2">
            {stats.conversionRate}%
          </div>
          <div className="text-xs md:text-sm text-gray-600">Conversion Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Revenue Trend ({timeRange})
          </h3>
          {revenueTrend.length > 0 ? (
            <div className="h-64 flex items-end justify-between space-x-1">
              {revenueTrend.map((value, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t hover:from-blue-600 hover:to-blue-400 transition-all cursor-pointer"
                    style={{ height: `${(value / maxChartValue) * 80}%` }}
                    title={`${formatCurrency(value)}`}
                  />
                  <span className="text-xs text-gray-500 mt-1">
                    {chartLabels[index] || `Period ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No revenue data available
            </div>
          )}
        </div>

        {/* Membership Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Membership Analysis
          </h3>
          <div className="space-y-4">
            {Object.entries(membershipData).map(([tier, data]) => (
              <div key={tier} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    tier === 'diamond' ? 'bg-purple-500' :
                    tier === 'gold' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                  <div>
                    <div className="font-medium capitalize">{tier} Members</div>
                    <div className="text-sm text-gray-600">{formatNumber(data.count)} users</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(data.revenue)}</div>
                  <div className="text-sm text-gray-600">
                    {((data.revenue / (stats.revenue || 1)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Payment Methods
          </h3>
          <div className="space-y-3">
            {Object.entries(paymentMethods).map(([method, data]) => (
              <div key={method} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-sm font-medium capitalize">
                      {method === 'upi' ? 'UPI' : 
                       method === 'card' ? '💳' : 
                       method === 'netbanking' ? '🏦' : '📱'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium capitalize">
                      {method === 'upi' ? 'UPI' : 
                       method === 'netbanking' ? 'Net Banking' : method}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatNumber(data.count)} transactions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(data.amount)}</div>
                  <div className="text-sm text-gray-600">
                    {((data.amount / (stats.revenue || 1)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Membership Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Membership Distribution
          </h3>
          <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-8">
            <div className="relative w-48 h-48">
              {/* Pie chart segments using conic-gradient */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    #a855f7 0% ${piePercentages.diamond}%,
                    #f59e0b ${piePercentages.diamond}% ${piePercentages.diamond + piePercentages.gold}%,
                    #9ca3af ${piePercentages.diamond + piePercentages.gold}% 100%
                  )`
                }}
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-gray-700">
                  {formatNumber(membershipData.gold.count + membershipData.silver.count + membershipData.diamond.count)}
                </div>
                <div className="text-sm text-gray-500">Total Members</div>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0 space-y-3">
              {Object.entries(membershipData).map(([tier, data]) => (
                <div key={tier} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    tier === 'diamond' ? 'bg-purple-500' :
                    tier === 'gold' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium capitalize">{tier}</div>
                    <div className="text-sm text-gray-600">
                      {formatNumber(data.count)} users ({((data.count / (membershipData.gold.count + membershipData.silver.count + membershipData.diamond.count)) * 100).toFixed(1)}%)
                    </div>
                  </div>
                  <div className="text-right font-semibold">
                    {formatCurrency(data.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Revenue Trend */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Daily Revenue Trend (Last 7 Days)
        </h3>
        {Object.keys(analyticsData.dailyRevenueTrend || {}).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 text-left text-gray-700">Date</th>
                  <th className="py-2 px-4 text-left text-gray-700">Revenue</th>
                  <th className="py-2 px-4 text-left text-gray-700">Change</th>
                  <th className="py-2 px-4 text-left text-gray-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analyticsData.dailyRevenueTrend || {}).map(([date, revenue], index, array) => {
                  const prevRevenue = index > 0 ? array[index - 1][1] : revenue;
                  const change = ((revenue - prevRevenue) / prevRevenue) * 100;
                  
                  return (
                    <tr key={date} className="border-t border-gray-100">
                      <td className="py-2 px-4">{date}</td>
                      <td className="py-2 px-4 font-medium">{formatCurrency(revenue)}</td>
                      <td className={`py-2 px-4 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                      </td>
                      <td className="py-2 px-4">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(Math.abs(change), 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No daily revenue data available
          </div>
        )}
      </div>

      {/* Download Report Button */}
      <div className="flex justify-end">
        <button
          onClick={() => alert("Export feature coming soon!")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Revenue Report
        </button>
      </div>
    </div>
  );
}

export default RevenueAnalytics;