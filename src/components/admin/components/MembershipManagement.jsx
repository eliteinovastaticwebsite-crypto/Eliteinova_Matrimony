import { useState, useEffect, useMemo } from "react";
import Button from "../../ui/Button";
import adminService from "../../../services/adminService";
import {
  Medal,
  Star,
  Crown,
  CheckCircle2,
  Users,
  Zap,
  PackagePlus,
  Power,
  Pencil,
  Trash2,
  X,
  TrendingUp,
  UserCheck,
  CreditCard,
  Calendar,
  BarChart3,
} from "lucide-react";

function MembershipManagement() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [newFeature, setNewFeature] = useState("");
  const [statsFilter, setStatsFilter] = useState({
    type: "TOTAL",
    period: "MONTH",
    dateRange: {
      start: new Date(),
      end: new Date(),
    },
  });
  const [showStatsDetail, setShowStatsDetail] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch membership plans from backend
  useEffect(() => {
    fetchMembershipPlans();
  }, []);

  const fetchMembershipPlans = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("📋 Fetching membership plans from backend...");

      const response = await adminService.getMembershipPlans();
      console.log("📥 Backend membership plans response:", response);

      if (response.success && response.plans) {
        // Transform backend data to match frontend expectations
        const transformedPlans = response.plans.map((plan) => ({
          id: plan.id,
          name: plan.name,
          price: plan.price || 0,
          duration: plan.duration || "30",
          durationDays: plan.durationDays || 30,
          features: Array.isArray(plan.features) ? plan.features : [],
          description: plan.description || "",
          subscribers: plan.subscribers || 0,
          status: plan.active ? "ACTIVE" : "INACTIVE",
          popular: plan.popular || false,
          featured: plan.featured || false,
          trialPeriod: plan.trialPeriod || "0",
          maxConnections: plan.maxConnections || "50",
          color: plan.color || "gray",
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
          // Keep original backend data
          backendData: plan,
        }));

        setMemberships(transformedPlans);
        console.log(
          "✅ Successfully loaded",
          transformedPlans.length,
          "membership plans from backend"
        );
      } else {
        setError("No membership plans found in backend response");
      }
    } catch (error) {
      console.error("❌ Error fetching membership plans:", error);
      setError(
        `Failed to load membership plans: ${error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Tiers configuration
  const tierConfigs = {
    SILVER: {
      name: "SILVER",
      icon: Medal,
      color: "gray",
      gradient: "from-gray-400 to-gray-600",
      description: "Perfect for getting started with basic features",
      defaultFeatures: [
        "Basic Profile Visibility",
        "Limited Swipes per Day",
        "Standard Matching",
        "Basic Profile Creation",
        "Limited Message Access",
      ],
      defaultPrice: 299,
    },
    GOLD: {
      name: "GOLD",
      icon: Star,
      color: "yellow",
      gradient: "from-yellow-400 to-yellow-600",
      description: "Verified Matches. Unlimited Access. Premium Advantage",
      defaultFeatures: [
        "Enhanced Profile Visibility",
        "Unlimited Swipes",
        "Priority Matching",
        "Message Read Receipts",
        "Advanced Search Filters",
        "Profile Analytics",
      ],
      defaultPrice: 499,
      popular: true,
    },
    DIAMOND: {
      name: "DIAMOND",
      icon: Crown,
      color: "blue",
      gradient: "from-blue-400 to-blue-600",
      description: "Premium experience with exclusive features",
      defaultFeatures: [
        "Top Profile Visibility",
        "Unlimited Swipes",
        "VIP Priority Matching",
        "Advanced Analytics",
        "Dedicated Support",
        "Profile Highlighting",
        "Match Guarantee",
        "Personalized Matchmaking",
      ],
      defaultPrice: 749,
    },
  };

  const [planForm, setPlanForm] = useState({
    name: "SILVER",
    price: "",
    duration: "30",
    features: [],
    description: "",
    popular: false,
    status: "ACTIVE",
    color: "gray",
    trialPeriod: "0",
    maxConnections: "50",
  });

  const buildPlanStats = (planName, memberships) => {
  const plans = memberships.filter(
    (p) => p.name?.toUpperCase() === planName
  );

  const activeSubscribers = plans.reduce(
    (sum, plan) => sum + (Number(plan.subscribers) || 0),
    0
  );

  const revenue = plans.reduce(
    (sum, plan) =>
      sum +
      (Number(plan.price) || 0) * (Number(plan.subscribers) || 0),
    0
  );

  return {
    plans: plans.length,
    activeSubscribers,
    revenue,

    // analytics MUST come from backend later
    trend: 0,
    conversionRate: 0,
    churnRate: 0,

    history: [],
  };
};

const detailedStats = {
  TOTAL: (() => {
    const activeSubscribers = memberships.reduce(
      (sum, plan) => sum + (Number(plan.subscribers) || 0),
      0
    );

    const revenue = memberships.reduce(
      (sum, plan) =>
        sum +
        (Number(plan.price) || 0) * (Number(plan.subscribers) || 0),
      0
    );

    return {
      plans: memberships.length,
      activeSubscribers,
      revenue,

      trend: 0,
      conversionRate: 0,
      churnRate: 0,

      history: [],
    };
  })(),

  SILVER: buildPlanStats("SILVER", memberships),
  GOLD: buildPlanStats("GOLD", memberships),
  DIAMOND: buildPlanStats("DIAMOND", memberships),
};

  const handleTierChange = (tier) => {
    const config = tierConfigs[tier];
    setPlanForm({
      ...planForm,
      ...config,
      features: [...config.defaultFeatures],
      price: config.defaultPrice.toString(),
      popular: config.popular || false,
      description: config.description,
      duration: "30",
      trialPeriod: tier === "DIAMOND" ? "7" : "0",
      maxConnections:
        tier === "SILVER" ? "50" : tier === "GOLD" ? "200" : "Unlimited",
    });
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setPlanForm({
        ...planForm,
        features: [...planForm.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index) => {
    setPlanForm({
      ...planForm,
      features: planForm.features.filter((_, i) => i !== index),
    });
  };

  const handleSavePlan = async () => {
    // Validation
    if (!planForm.name.trim()) {
      alert("Please enter a plan name");
      return;
    }
    if (!planForm.price || parseFloat(planForm.price) <= 0) {
      alert("Please enter a valid price");
      return;
    }
    if (!planForm.duration || parseInt(planForm.duration) <= 0) {
      alert("Please enter a valid duration");
      return;
    }
    if (planForm.features.length === 0) {
      alert("Please add at least one feature");
      return;
    }

    try {
      // Prepare data for backend
      const planData = {
        name: planForm.name,
        description: planForm.description || "",
        price: parseInt(planForm.price) || 0,
        duration: planForm.duration + " days",
        features: planForm.features,
        featured: planForm.featured || false,
        popular: planForm.popular || false,
        color: planForm.color || "gray",
        active: planForm.status === "ACTIVE",
      };

      let response;
      if (editingPlan) {
        response = await adminService.updateMembershipPlan(
          editingPlan.id,
          planData
        );
      } else {
        response = await adminService.createMembershipPlan(planData);
      }

      if (response.success) {
        alert(
          response.message ||
            `Plan ${editingPlan ? "updated" : "created"} successfully`
        );
        setShowCreateForm(false);
        setEditingPlan(null);
        setPlanForm({
          name: "SILVER",
          price: "",
          duration: "30",
          features: [],
          description: "",
          popular: false,
          status: "ACTIVE",
          color: "gray",
          trialPeriod: "0",
          maxConnections: "50",
        });
        fetchMembershipPlans(); // Refresh the list
      } else {
        throw new Error(response.message || "Backend error");
      }
    } catch (error) {
      console.error("❌ Error saving plan:", error);
      alert(`Error saving plan: ${error.message || "Unknown error"}`);
    }
  };

  const handleEdit = (plan) => {
    setPlanForm({
      ...plan,
      price: plan.price?.toString() || "",
      duration:
        plan.durationDays?.toString() || plan.duration?.toString() || "30",
    });
    setEditingPlan(plan);
    setShowCreateForm(true);
  };

  const handleToggleStatus = async (plan) => {
    const newStatus = plan.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    if (
      !window.confirm(
        `Are you sure you want to ${newStatus.toLowerCase()} this plan?`
      )
    ) {
      return;
    }

    try {
      const planData = {
        ...plan.backendData,
        active: newStatus === "ACTIVE",
      };

      const response = await adminService.updateMembershipPlan(
        plan.id,
        planData
      );

      if (response.success) {
        alert(`${plan.name} plan ${newStatus.toLowerCase()}d`);
        fetchMembershipPlans(); // Refresh the list
      } else {
        throw new Error(response.message || "Backend error");
      }
    } catch (error) {
      console.error("❌ Error updating plan status:", error);
      alert(`Error updating plan status: ${error.message || "Unknown error"}`);
    }
  };

  const handleDeletePlan = async (plan) => {
    try {
      const response = await adminService.deleteMembershipPlan(plan.id);

      if (response.success) {
        alert(`${plan.name} plan deleted successfully`);
        setDeleteConfirm(null);
        fetchMembershipPlans(); // Refresh the list
      } else {
        throw new Error(response.message || "Backend error");
      }
    } catch (error) {
      console.error("❌ Error deleting plan:", error);
      alert(`Error deleting plan: ${error.message || "Unknown error"}`);
    }
  };

  const handleStatClick = (type) => {
    setStatsFilter((prev) => ({ ...prev, type }));
    setShowStatsDetail(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    switch (statsFilter.period) {
      case "DAY":
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "WEEK":
      case "MONTH":
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "YEAR":
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      default:
        return date.toLocaleDateString();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const currentStats = detailedStats[statsFilter.type];

  // Loading spinner
  if (loading && memberships.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading membership plans from backend...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && memberships.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Failed to Load Plans
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button
          variant="primary"
          onClick={fetchMembershipPlans}
          className="px-4 py-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:shadow-md transition border-l-4 border-blue-500"
          onClick={() => handleStatClick("TOTAL")}
        >
          <Users className="mx-auto text-blue-500 mb-2" size={24} />
          <div className="text-xl font-bold text-gray-800">
            {detailedStats.TOTAL.plans}
          </div>
          <p className="text-gray-600 text-sm">Total Plans</p>
          <div className="text-xs text-gray-500 mt-1">From Database</div>
        </div>
        <div
          className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:shadow-md transition border-l-4 border-green-500"
          onClick={() => handleStatClick("TOTAL")}
        >
          <UserCheck className="mx-auto text-green-500 mb-2" size={24} />
          <div className="text-xl font-bold text-gray-800">
            {detailedStats.TOTAL.activeSubscribers}
          </div>
          <p className="text-gray-600 text-sm">Active Subscribers</p>
          <div className="text-xs text-gray-500 mt-1">
            {detailedStats.TOTAL.conversionRate}% conversion
          </div>
        </div>
        <div
          className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:shadow-md transition border-l-4 border-gray-500"
          onClick={() => handleStatClick("SILVER")}
        >
          <Medal className="mx-auto text-gray-500 mb-2" size={24} />
          <div className="text-xl font-bold text-gray-800">
            {formatCurrency(detailedStats.SILVER.revenue)}
          </div>
          <p className="text-gray-600 text-sm">Silver Revenue</p>
          <div className="text-xs text-gray-500 mt-1">
            +{detailedStats.SILVER.trend}%
          </div>
        </div>
        <div
          className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:shadow-md transition border-l-4 border-yellow-500"
          onClick={() => handleStatClick("GOLD")}
        >
          <Star className="mx-auto text-yellow-500 mb-2" size={24} />
          <div className="text-xl font-bold text-gray-800">
            {formatCurrency(detailedStats.GOLD.revenue)}
          </div>
          <p className="text-gray-600 text-sm">Gold Revenue</p>
          <div className="text-xs text-gray-500 mt-1">
            +{detailedStats.GOLD.trend}%
          </div>
        </div>
        <div
          className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:shadow-md transition border-l-4 border-blue-500"
          onClick={() => handleStatClick("DIAMOND")}
        >
          <Crown className="mx-auto text-blue-500 mb-2" size={24} />
          <div className="text-xl font-bold text-gray-800">
            {formatCurrency(detailedStats.DIAMOND.revenue)}
          </div>
          <p className="text-gray-600 text-sm">Diamond Revenue</p>
          <div className="text-xs text-gray-500 mt-1">
            +{detailedStats.DIAMOND.trend}%
          </div>
        </div>
      </div>

      {/* Detailed Stats Modal */}
      {showStatsDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {statsFilter.type} Plan Analytics
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Detailed performance metrics and trends
                  </p>
                </div>
                <button
                  onClick={() => setShowStatsDetail(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-gray-500" />
                  <select
                    value={statsFilter.period}
                    onChange={(e) =>
                      setStatsFilter((prev) => ({
                        ...prev,
                        period: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="DAY">Last 24 Hours</option>
                    <option value="WEEK">Last 7 Days</option>
                    <option value="MONTH">Last 30 Days</option>
                    <option value="YEAR">Last 12 Months</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={
                        statsFilter.dateRange.start.toISOString().split("T")[0]
                      }
                      onChange={(e) =>
                        setStatsFilter((prev) => ({
                          ...prev,
                          dateRange: {
                            ...prev.dateRange,
                            start: new Date(e.target.value),
                          },
                        }))
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="date"
                      value={
                        statsFilter.dateRange.end.toISOString().split("T")[0]
                      }
                      onChange={(e) =>
                        setStatsFilter((prev) => ({
                          ...prev,
                          dateRange: {
                            ...prev.dateRange,
                            end: new Date(e.target.value),
                          },
                        }))
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Enhanced Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentStats.plans}
                  </div>
                  <p className="text-blue-700 text-sm font-medium">
                    Active Plans
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {currentStats.activeSubscribers}
                  </div>
                  <p className="text-green-700 text-sm font-medium">
                    Subscribers
                  </p>
                  <div className="text-xs text-green-600 mt-1">
                    {currentStats.conversionRate}% conversion rate
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(currentStats.revenue)}
                  </div>
                  <p className="text-purple-700 text-sm font-medium">
                    Total Revenue
                  </p>
                  <div className="text-xs text-purple-600 mt-1">
                    +{currentStats.trend}% growth
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">
                    {currentStats.churnRate}%
                  </div>
                  <p className="text-orange-700 text-sm font-medium">
                    Churn Rate
                  </p>
                  <div className="text-xs text-orange-600 mt-1">
                    Monthly subscriber loss
                  </div>
                </div>
              </div>

              {/* Enhanced History Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                        Subscribers
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                        New Subs
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                        Cancellations
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStats.history.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-6 text-gray-500 font-medium"
                        >
                          No analytics available yet — waiting for first
                          subscription
                        </td>
                      </tr>
                    ) : (
                      currentStats.history.map((record, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 even:bg-gray-50/50"
                        >
                          <td className="border border-gray-200 px-4 py-2 font-medium">
                            {formatDate(record.date)}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {record.subscribers.toLocaleString()}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-green-600 font-medium">
                            +{record.newSubscriptions}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-red-600 font-medium">
                            -{record.cancellations}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 font-semibold">
                            {formatCurrency(record.revenue)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Chart Placeholder */}
              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold mb-4 text-gray-800">
                  Revenue & Subscriber Trends
                </h4>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded border">
                  <div className="text-center text-gray-500">
                    <BarChart3
                      size={48}
                      className="mx-auto mb-3 text-gray-400"
                    />
                    <p className="font-medium">Interactive Analytics Chart</p>
                    <p className="text-sm">
                      Revenue and subscriber growth visualization
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Membership Plans
          </h2>
          <p className="text-sm text-gray-500">
            Manage Silver, Gold, and Diamond subscription tiers
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateForm(true)}>
          <PackagePlus className="h-4 w-4 mr-2" /> Create New Plan
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {editingPlan ? "Edit Membership Plan" : "Create New Plan"}
          </h3>

          {/* Tier selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(tierConfigs).map(([tier, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={tier}
                  onClick={() => handleTierChange(tier)}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    planForm.name === tier
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <Icon
                    className={`mx-auto mb-2 ${
                      planForm.name === tier ? "text-blue-600" : "text-gray-500"
                    }`}
                    size={28}
                  />
                  <div className="font-semibold text-gray-800">{tier}</div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(config.defaultPrice)}
                  </div>
                  {config.popular && (
                    <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Enhanced Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Name
              </label>
              <input
                type="text"
                value={planForm.name}
                onChange={(e) =>
                  setPlanForm({ ...planForm, name: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Plan Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={planForm.price}
                onChange={(e) =>
                  setPlanForm({ ...planForm, price: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Price"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                value={planForm.duration}
                onChange={(e) =>
                  setPlanForm({ ...planForm, duration: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Duration"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trial Period (days)
              </label>
              <input
                type="number"
                value={planForm.trialPeriod}
                onChange={(e) =>
                  setPlanForm({ ...planForm, trialPeriod: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Trial days"
                min="0"
                max="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Connections
              </label>
              <input
                type="text"
                value={planForm.maxConnections}
                onChange={(e) =>
                  setPlanForm({ ...planForm, maxConnections: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Max connections"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={planForm.status}
                onChange={(e) =>
                  setPlanForm({ ...planForm, status: e.target.value })
                }
                className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Plan description..."
              value={planForm.description}
              onChange={(e) =>
                setPlanForm({ ...planForm, description: e.target.value })
              }
            />
          </div>

          {/* Features */}
          <div className="mb-4">
            <h4 className="font-medium mb-2 text-gray-800">Features</h4>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add feature..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddFeature()}
              />
              <Button size="sm" onClick={handleAddFeature}>
                Add
              </Button>
            </div>
            <ul className="space-y-1 max-h-32 overflow-y-auto">
              {planForm.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border"
                >
                  <span className="text-gray-700 text-sm flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {f}
                  </span>
                  <button
                    className="text-red-500 hover:text-red-700 text-sm p-1 rounded hover:bg-red-50"
                    onClick={() => handleRemoveFeature(i)}
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="popular"
                checked={planForm.popular}
                onChange={(e) =>
                  setPlanForm({ ...planForm, popular: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="popular" className="text-sm text-gray-700">
                Mark as Popular Plan
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button variant="primary" onClick={handleSavePlan}>
              {editingPlan ? "Update Plan" : "Create Plan"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateForm(false);
                setEditingPlan(null);
                setPlanForm({
                  name: "SILVER",
                  price: "",
                  duration: "30",
                  features: [],
                  description: "",
                  popular: false,
                  status: "ACTIVE",
                  color: "gray",
                  trialPeriod: "0",
                  maxConnections: "50",
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Membership Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {memberships.map((plan) => {
          const config =
            tierConfigs[plan.name?.toUpperCase()] || tierConfigs.SILVER;
          const Icon = config.icon;
          const gradient = config.gradient;

          return (
            <div
              key={plan.id}
              className="bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col min-h-[480px] group"
            >
              {/* Header with gradient */}
              <div
                className={`p-6 bg-gradient-to-r ${gradient} text-white relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    POPULAR
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Icon size={24} className="text-white" />
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      plan.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>
                <div className="mt-3 text-2xl font-bold">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-normal opacity-90 ml-1">
                    /{plan.duration} days
                  </span>
                </div>
                {plan.trialPeriod > 0 && (
                  <div className="text-sm opacity-90 mt-1">
                    {plan.trialPeriod}-day free trial
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {plan.description}
                </p>

                {/* Features section */}
                <div className="flex-1">
                  <ul className="space-y-2 text-sm text-gray-600">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="break-words leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats and buttons */}
                <div className="mt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-semibold text-gray-800">
                        {plan.subscribers || 0}
                      </div>
                      <div>Subscribers</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-semibold text-gray-800">
                        {formatCurrency((plan.subscribers || 0) * plan.price)}
                      </div>
                      <div>Revenue</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleToggleStatus(plan)}
                    >
                      <Power className="h-4 w-4 mr-1" />
                      {plan.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(plan)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setDeleteConfirm(plan)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {memberships.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Crown className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="font-medium text-gray-700 text-lg mb-2">
            No membership plans created yet
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Start by creating your first membership plan to offer subscription
            tiers to your users.
          </p>
          <Button variant="primary" onClick={() => setShowCreateForm(true)}>
            <PackagePlus className="h-4 w-4 mr-2" /> Create Your First Plan
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Delete Plan
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the{" "}
              <strong>"{deleteConfirm.name}"</strong> plan? This will remove the
              plan and all associated data.
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDeletePlan(deleteConfirm)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Plan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MembershipManagement;
