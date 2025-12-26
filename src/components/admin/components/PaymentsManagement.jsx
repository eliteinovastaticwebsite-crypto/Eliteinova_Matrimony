import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import adminService from "../../../services/adminService";

function PaymentsManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundData, setRefundData] = useState({ amount: 0, reason: "" });
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 1,
    totalItems: 0,
    pageSize: 20
  });
  const [filters, setFilters] = useState({
    status: "ALL",
    startDate: "",
    endDate: ""
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    successfulTransactions: 0,
    pendingPayments: 0,
    failedTransactions: 0,
    refundedAmount: 0,
    conversionRate: 0,
    totalTransactions: 0
  });

  // Fetch payments data from backend
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        size: pagination.pageSize,
        ...(filters.status !== "ALL" && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      };

      const response = await adminService.getPayments(params);
      
      if (response.success) {
        setPayments(response.payments || []);
        setPagination({
          ...pagination,
          currentPage: response.currentPage || 0,
          totalPages: response.totalPages || 1,
          totalItems: response.totalItems || 0
        });
        
        // Calculate stats from fetched data
        calculateStats(response.payments || []);
      } else {
        setError(response.message || "Failed to fetch payments");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.message || "Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from payments data
  const calculateStats = (paymentsData) => {
    const completedPayments = paymentsData.filter(p => p.status === "COMPLETED");
    const pendingPayments = paymentsData.filter(p => p.status === "PENDING");
    const failedPayments = paymentsData.filter(p => p.status === "FAILED");
    const refundedPayments = paymentsData.filter(p => p.status === "REFUNDED");
    
    const totalRevenue = completedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const refundedAmount = refundedPayments.reduce((sum, payment) => sum + (payment.refundAmount || 0), 0);
    const conversionRate = paymentsData.length > 0 
      ? Math.round((completedPayments.length / paymentsData.length) * 100) 
      : 0;

    setStats({
      totalRevenue,
      successfulTransactions: completedPayments.length,
      pendingPayments: pendingPayments.length,
      failedTransactions: failedPayments.length,
      refundedAmount,
      conversionRate,
      totalTransactions: paymentsData.length
    });
  };

  // Handle refund action
  const handleRefund = async (paymentId) => {
    try {
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) {
        alert("Payment not found");
        return;
      }

      const response = await adminService.processRefund(
        paymentId,
        refundData.amount || payment.amount,
        refundData.reason
      );

      if (response.success) {
        alert(response.message || "Refund processed successfully!");
        setShowRefundModal(false);
        fetchPayments(); // Refresh data
      } else {
        alert(response.message || "Failed to process refund");
      }
    } catch (err) {
      console.error("Error processing refund:", err);
      alert(err.message || "Error processing refund");
    }
  };

  // Handle export payments
  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await adminService.exportPayments({
        ...(filters.status !== "ALL" && { status: filters.status }),
        startDate: filters.startDate,
        endDate: filters.endDate
      });

      // Create a blob URL for the file
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      alert("Payments exported successfully!");
    } catch (err) {
      console.error("Error exporting payments:", err);
      alert(err.message || "Failed to export payments");
    } finally {
      setExporting(false);
    }
  };

  // Fetch payment details by ID
  const fetchPaymentDetails = async (paymentId) => {
    try {
      const response = await adminService.getPaymentById(paymentId);
      if (response.success) {
        setSelectedPayment(response.payment);
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error("Error fetching payment details:", err);
      alert("Failed to load payment details");
    }
  };

  // Initialize data
  useEffect(() => {
    fetchPayments();
  }, [filters.status, pagination.currentPage]);

  const handleViewDetails = (payment) => {
    fetchPaymentDetails(payment.id);
  };

  const handleRefundClick = (payment) => {
    setSelectedPayment(payment);
    setRefundData({
      amount: payment.amount || 0,
      reason: "Refund requested by admin"
    });
    setShowRefundModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      FAILED: "bg-red-100 text-red-800 border-red-200",
      REFUNDED: "bg-blue-100 text-blue-800 border-blue-200",
      CANCELLED: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPaymentMethodIcon = (method) => {
    if (!method) return "💰";
    
    const icons = {
      'CREDIT_CARD': '💳',
      'CREDIT': '💳',
      'DEBIT_CARD': '💳',
      'DEBIT': '💳',
      'UPI': '📱',
      'NET_BANKING': '🏦',
      'BANK_TRANSFER': '🏦',
      'WALLET': '👛',
      'CASH': '💵'
    };
    
    // Try exact match first
    if (icons[method]) return icons[method];
    
    // Try case-insensitive match
    const upperMethod = method.toUpperCase();
    if (icons[upperMethod]) return icons[upperMethod];
    
    // Try partial match
    for (const [key, icon] of Object.entries(icons)) {
      if (upperMethod.includes(key) || key.includes(upperMethod)) {
        return icon;
      }
    }
    
    return "💰";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Calculate payment methods distribution
  const getPaymentMethodsDistribution = () => {
    if (payments.length === 0) return [];
    
    const distribution = {};
    payments.forEach(payment => {
      const method = payment.paymentMethod || 'UNKNOWN';
      distribution[method] = (distribution[method] || 0) + 1;
    });
    
    return Object.entries(distribution).map(([method, count]) => {
      const percentage = Math.round((count / payments.length) * 100);
      const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-red-500", "bg-indigo-500"];
      return {
        method,
        count,
        percentage,
        color: colors[Object.keys(distribution).indexOf(method) % colors.length]
      };
    });
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 0 })); // Reset to first page
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchPayments();
  };

  // Apply date filters
  const handleApplyDateFilter = () => {
    fetchPayments();
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      status: "ALL",
      startDate: "",
      endDate: ""
    });
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  // Calculate date for 30 days ago
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  };

  // Calculate today's date
  const getDefaultEndDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Initialize date filters
  useEffect(() => {
    if (!filters.startDate) {
      setFilters(prev => ({ ...prev, startDate: getDefaultStartDate() }));
    }
    if (!filters.endDate) {
      setFilters(prev => ({ ...prev, endDate: getDefaultEndDate() }));
    }
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Payment Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-green-500">
          <div className="text-xl md:text-2xl font-bold text-green-600 mb-1 md:mb-2">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Total Revenue</div>
          <div className="text-xs text-green-600 mt-1">Live Data</div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-blue-500">
          <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-2">
            {stats.successfulTransactions}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Successful TXNs</div>
          <div className="text-xs text-blue-600 mt-1">Live Data</div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-yellow-500">
          <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1 md:mb-2">
            {stats.pendingPayments}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Pending Payments</div>
          <div className="text-xs text-gray-600 mt-1">Awaiting processing</div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center border-l-4 border-purple-500">
          <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1 md:mb-2">
            {stats.conversionRate}%
          </div>
          <div className="text-xs md:text-sm text-gray-600">Conversion Rate</div>
          <div className="text-xs text-purple-600 mt-1">Live Data</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-lg font-bold text-red-600 mb-1">
            {stats.failedTransactions}
          </div>
          <div className="text-xs text-gray-600">Failed Transactions</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-lg font-bold text-blue-600 mb-1">
            {formatCurrency(stats.refundedAmount)}
          </div>
          <div className="text-xs text-gray-600">Refunded Amount</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-lg font-bold text-gray-600 mb-1">
            {stats.totalTransactions}
          </div>
          <div className="text-xs text-gray-600">Total Transactions</div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                Payment Transactions {pagination.totalItems > 0 && `(${pagination.totalItems})`}
              </h2>
              <p className="text-sm text-gray-600">Manage and monitor all payment activities</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              />
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleApplyDateFilter}
              >
                Apply
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleExport}
                disabled={exporting || payments.length === 0}
              >
                {exporting ? "Exporting..." : "Export"}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="mt-4 text-gray-600">Loading payments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <p className="mb-4">{error}</p>
              <Button variant="primary" size="sm" onClick={handleRefresh}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">
                        Transaction ID
                      </th>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell">
                        User
                      </th>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">
                        Plan
                      </th>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700 hidden md:table-cell">
                        Method
                      </th>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700 hidden sm:table-cell">
                        Date
                      </th>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="py-2 md:py-3 px-2 md:px-4">
                          <div className="min-w-0">
                            <code className="text-xs font-mono text-gray-600">
                              {payment.transactionId || payment.id || `PAY-${payment.id}`}
                            </code>
                            <p className="text-xs text-gray-500 lg:hidden mt-1">
                              {payment.user?.name || payment.user?.fullName || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4 hidden lg:table-cell">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {payment.user?.name || payment.user?.fullName || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {payment.user?.email || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4">
                          <span className="text-sm font-medium text-gray-900">
                            {payment.plan?.name || payment.membershipPlan || "N/A"}
                          </span>
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(payment.amount)}
                          </span>
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {getPaymentMethodIcon(payment.paymentMethod)}
                            </span>
                            <span className="text-sm text-gray-600">
                              {payment.paymentMethod ? 
                                payment.paymentMethod.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) 
                                : "N/A"
                              }
                            </span>
                          </div>
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4 hidden sm:table-cell">
                          <span className="text-xs text-gray-500">
                            {formatDate(payment.createdAt)}
                          </span>
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4">
                          <div className="flex space-x-1 md:space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleViewDetails(payment)}
                            >
                              View
                            </Button>
                            {payment.status === "COMPLETED" && (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleRefundClick(payment)}
                              >
                                Refund
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {payments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl md:text-5xl mb-4">💰</div>
                  <p className="text-lg md:text-xl font-medium text-gray-600 mb-2">
                    No payments found
                  </p>
                  <p className="text-sm md:text-base">
                    {filters.status === "ALL"
                      ? "No payment transactions available for the selected date range"
                      : `No ${filters.status.toLowerCase()} payments found`}
                  </p>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="mt-4"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.currentPage + 1} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment Methods Distribution */}
      {payments.length > 0 && getPaymentMethodsDistribution().length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
            Payment Methods Distribution
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getPaymentMethodsDistribution().slice(0, 4).map((item, index) => (
              <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl mb-2">{getPaymentMethodIcon(item.method)}</div>
                <div className="text-sm font-semibold text-gray-800">
                  {item.method.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <div className="text-lg font-bold text-gray-900">{item.count}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Payment Details - {selectedPayment.transactionId || selectedPayment.id}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">User Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{selectedPayment.user?.name || selectedPayment.user?.fullName || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{selectedPayment.user?.email || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Membership:</span>
                      <span className="text-yellow-600 font-medium">
                        {selectedPayment.user?.membership || selectedPayment.plan?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Transaction Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Plan:</span>
                      <span>{selectedPayment.plan?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Invoice ID:</span>
                      <span>{selectedPayment.invoiceId || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Gateway:</span>
                      <span>{selectedPayment.paymentGateway || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Payment Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">{formatCurrency(selectedPayment.amount)}</span>
                  </div>
                  {selectedPayment.tax > 0 && (
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span className="font-medium">{formatCurrency(selectedPayment.tax)}</span>
                    </div>
                  )}
                  {selectedPayment.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span className="font-medium text-green-600">-{formatCurrency(selectedPayment.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-semibold text-lg">{formatCurrency(selectedPayment.amount)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Payment Method</h4>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-2xl">{getPaymentMethodIcon(selectedPayment.paymentMethod)}</span>
                  <div>
                    <p className="font-medium text-gray-800">
                      {selectedPayment.paymentMethod ? selectedPayment.paymentMethod.replace(/_/g, " ") : "N/A"}
                    </p>
                    {selectedPayment.cardLast4 && (
                      <p className="text-sm text-gray-600">Card ending with {selectedPayment.cardLast4}</p>
                    )}
                    {selectedPayment.upiId && (
                      <p className="text-sm text-gray-600">UPI ID: {selectedPayment.upiId}</p>
                    )}
                    {selectedPayment.bankName && (
                      <p className="text-sm text-gray-600">Bank: {selectedPayment.bankName}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedPayment.status)}`}>
                        {selectedPayment.status}
                      </span>
                    </div>
                    {selectedPayment.failureReason && (
                      <div className="flex justify-between">
                        <span>Failure Reason:</span>
                        <span className="text-red-600">{selectedPayment.failureReason}</span>
                      </div>
                    )}
                    {selectedPayment.refundReason && (
                      <div className="flex justify-between">
                        <span>Refund Reason:</span>
                        <span className="text-blue-600">{selectedPayment.refundReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{formatDate(selectedPayment.createdAt)}</span>
                    </div>
                    {selectedPayment.completedAt && (
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <span>{formatDate(selectedPayment.completedAt)}</span>
                      </div>
                    )}
                    {selectedPayment.refundedAt && (
                      <div className="flex justify-between">
                        <span>Refunded:</span>
                        <span>{formatDate(selectedPayment.refundedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedPayment.status === 'REFUNDED' && selectedPayment.refundAmount && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Refund Information</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex justify-between">
                      <span>Refund Amount:</span>
                      <span className="font-semibold">{formatCurrency(selectedPayment.refundAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Refund Date:</span>
                      <span>{formatDate(selectedPayment.refundedAt)}</span>
                    </div>
                    {selectedPayment.refundReason && (
                      <div className="flex justify-between">
                        <span>Reason:</span>
                        <span>{selectedPayment.refundReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
              {selectedPayment.status === 'COMPLETED' && (
                <Button
                  variant="primary"
                  onClick={() => handleRefundClick(selectedPayment)}
                >
                  Process Refund
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Process Refund - {selectedPayment.transactionId || selectedPayment.id}
                </h3>
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-medium text-blue-800">Transaction Details</p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>User:</span>
                    <span className="font-medium">{selectedPayment.user?.name || selectedPayment.user?.fullName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">{formatCurrency(selectedPayment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium">{selectedPayment.plan?.name || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refund Amount
                  </label>
                  <input
                    type="number"
                    value={refundData.amount}
                    onChange={(e) =>
                      setRefundData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    max={selectedPayment.amount}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum refundable amount: {formatCurrency(selectedPayment.amount)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refund Reason
                  </label>
                  <textarea
                    value={refundData.reason}
                    onChange={(e) =>
                      setRefundData(prev => ({ ...prev, reason: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter reason for refund..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={() => setShowRefundModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleRefund(selectedPayment.id)}
                  disabled={refundData.amount <= 0 || refundData.amount > selectedPayment.amount}
                >
                  Process Refund
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsManagement;