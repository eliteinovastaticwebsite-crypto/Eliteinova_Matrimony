import { useState, useEffect } from "react";
import adminService from "../../../services/adminService";
import { 
  UserPlusIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

function AdminOfficeUserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    gender: "MALE",
    profileFor: "Self",
    role: "OFFICE" // Default to OFFICE
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setFetching(true);
      const response = await adminService.getAllAdminAndOfficeUsers();
      if (response.success) {
        setUsers(response.users || []);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    // Password required only for new users
    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      setError("Password must be at least 6 characters");
      return false;
    }
    // If editing and password provided, validate it
    if (editingUser && formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!formData.mobile.trim()) {
      setError("Mobile number is required");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      setError("Please enter a valid Indian mobile number (10 digits starting with 6-9)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let response;
      
      if (editingUser) {
        // Update existing user
        response = await adminService.updateAdminOrOfficeUser(editingUser.id, formData);
        if (response.success) {
          setSuccess(`${formData.role} user "${response[formData.role.toLowerCase()].name}" updated successfully!`);
        }
      } else {
        // Create new user
        response = await adminService.createAdminOrOfficeUser(formData, formData.role);
        if (response.success) {
          setSuccess(`${formData.role} user "${response[formData.role.toLowerCase()].name}" created successfully!`);
        }
      }
      
      if (response.success) {
        // Reset form and refresh list
        resetForm();
        await fetchUsers();
        // Close modal after 2 seconds
        setTimeout(() => {
          setShowModal(false);
          setSuccess("");
        }, 2000);
      } else {
        setError(response.error || `Failed to ${editingUser ? 'update' : 'create'} user`);
      }
    } catch (err) {
      console.error(`Error ${editingUser ? 'updating' : 'creating'} user:`, err);
      setError(err.error || err.message || `Failed to ${editingUser ? 'update' : 'create'} user. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "", // Don't pre-fill password
      mobile: user.mobile || "",
      gender: user.gender || "MALE",
      profileFor: user.profileFor || "Self",
      role: user.role || "OFFICE"
    });
    setShowModal(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.role} user "${user.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await adminService.deleteAdminOrOfficeUser(user.id);
      if (response.success) {
        setSuccess(`User "${user.name}" deleted successfully!`);
        await fetchUsers();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.error || err.message || "Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      mobile: "",
      gender: "MALE",
      profileFor: "Self",
      role: "OFFICE"
    });
    setError("");
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleCreateNew = () => {
    resetForm();
    setShowModal(true);
  };

  // Separate users by role
  const adminUsers = users.filter(u => u.role === "ADMIN");
  const officeUsers = users.filter(u => u.role === "OFFICE");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin & Office User Management</h2>
          <p className="text-gray-600 mt-1">Create and manage admin and office user accounts</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <UserPlusIcon className="w-5 h-5" />
          <span>Create User</span>
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {error && !showModal && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <ExclamationCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* About Admin Users */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-purple-900">About Admin Users</h3>
              <p className="text-sm text-purple-700 mt-1">
                Admin users have full access to the admin dashboard. They can manage all settings, 
                create and manage users, handle payments, view all analytics, and modify critical system configurations.
              </p>
            </div>
          </div>
        </div>

        {/* About Office Users */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900">About Office Users</h3>
              <p className="text-sm text-blue-700 mt-1">
                Office users have limited access to the admin dashboard. They can view data but cannot modify critical settings, 
                manage payments, or create other users. Only admins can create office user accounts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      {fetching ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Admin Users Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
              <span>Admin Users ({adminUsers.length})</span>
            </h3>
            {adminUsers.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500">No admin users found</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adminUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-purple-600 font-semibold text-sm">
                                {user.name?.charAt(0) || "A"}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.mobile || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Edit user"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete user"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Office Users Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
              <span>Office Users ({officeUsers.length})</span>
            </h3>
            {officeUsers.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500">No office users found</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {officeUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold text-sm">
                                {user.name?.charAt(0) || "O"}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.mobile || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Edit user"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete user"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingUser ? `Edit ${editingUser.role} User` : "Create User"}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Role Selection (only when creating) */}
              {!editingUser && (
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    User Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="OFFICE">Office User</option>
                    <option value="ADMIN">Admin User</option>
                  </select>
                </div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="user@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password {!editingUser && <span className="text-red-500">*</span>}
                  {editingUser && <span className="text-gray-500 text-xs">(Leave blank to keep current password)</span>}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder={editingUser ? "Enter new password (optional)" : "Minimum 6 characters"}
                  minLength={editingUser ? 0 : 6}
                />
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="9876543210"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                />
                <p className="text-xs text-gray-500 mt-1">10-digit Indian mobile number</p>
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              {/* Profile For */}
              <div>
                <label htmlFor="profileFor" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile For
                </label>
                <select
                  id="profileFor"
                  name="profileFor"
                  value={formData.profileFor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Self">Self</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{editingUser ? "Updating..." : "Creating..."}</span>
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="w-4 h-4" />
                      <span>{editingUser ? "Update User" : "Create User"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOfficeUserManagement;

