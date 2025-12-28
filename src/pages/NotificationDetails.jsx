// src/pages/NotificationDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  BellIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationCircleIcon,  
  PhoneIcon,               
  EnvelopeIcon,          
  UserIcon,
  CheckCircleIcon,  
  XCircleIcon 
} from "@heroicons/react/24/outline";
import notificationService from "../services/notificationService";
import profileService from "../services/profileService";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosUser";

const NotificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ NEW: Contact request state
  const [contactRequestStatus, setContactRequestStatus] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [checkingContact, setCheckingContact] = useState(false);
  const [relatedNotifications, setRelatedNotifications] = useState([]);
  const [processingAction, setProcessingAction] = useState(false);
  const [actionResult, setActionResult] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchNotificationDetails();
  }, [id, isAuthenticated]);

  const fetchNotificationDetails = async () => {
    try {
      setLoading(true);
      setError("");

      // Get all notifications to find this one
      const response = await notificationService.getNotifications();
      const allNotifications = response.notifications || [];

      // Find the specific notification by ID
      const foundNotification = allNotifications.find(
        (n) => n.id.toString() === id
      );

      if (!foundNotification) {
        setError("Notification not found");
        setNotification(null);
        return;
      }

      setNotification(foundNotification);

      // ✅ NEW: Check if this is a contact request notification
      if (
        foundNotification.type === "CONTACT_REQUEST_RESPONSE" ||
        foundNotification.type === "INTEREST"
      ) {
        // Try to extract profile ID from the message or title
        extractProfileIdFromNotification(foundNotification);

        // Check contact request status
        checkContactRequestStatus();
      }

      // Mark as read automatically when viewing details
      if (!foundNotification.isRead) {
        try {
          await notificationService.markAsRead(id);
        } catch (markError) {
          console.warn("Could not mark as read:", markError);
        }
      }
    } catch (err) {
      console.error("Error fetching notification details:", err);
      setError("Failed to load notification details");
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    try {
      const response = await api.get('/api/notifications/debug-auth');
      console.log("✅ Auth debug working:", response.data);
    } catch (error) {
      console.error("❌ Auth debug failed:", error.response?.data || error.message);
    }
  };

  const handleAcceptContactRequest = async () => {
    if (!profileId) {
      alert("Could not find profile information");
      return;
    }

    setProcessingAction(true);
    try {
      // Call your backend API to accept contact request
      const response = await profileService.acceptContactRequest(profileId);
      
      if (response.success) {
        setActionResult({
          type: 'success',
          message: response.message || 'Contact request accepted successfully!'
        });
        setContactRequestStatus('ACCEPTED');
        
        // If contact info is provided in response
        if (response.contact) {
          setContactInfo(response.contact);
        }
        
        alert('Contact request accepted! The user can now see your contact information.');
      } else {
        throw new Error(response.message || 'Failed to accept contact request');
      }
    } catch (err) {
      console.error('Error accepting contact request:', err);
      setActionResult({
        type: 'error',
        message: err.message || 'Failed to accept contact request'
      });
      alert(`Failed to accept contact request: ${err.message}`);
    } finally {
      setProcessingAction(false);
    }
  };

  // ✅ NEW: Handle contact request rejection
  const handleRejectContactRequest = async () => {
    if (!profileId) {
      alert("Could not find profile information");
      return;
    }

    if (!window.confirm('Are you sure you want to reject this contact request?')) {
      return;
    }

    setProcessingAction(true);
    try {
      // Call your backend API to reject contact request
      const response = await profileService.rejectContactRequest(profileId);
      
      if (response.success) {
        setActionResult({
          type: 'success',
          message: response.message || 'Contact request rejected successfully!'
        });
        setContactRequestStatus('REJECTED');
        
        alert('Contact request rejected.');
      } else {
        throw new Error(response.message || 'Failed to reject contact request');
      }
    } catch (err) {
      console.error('Error rejecting contact request:', err);
      setActionResult({
        type: 'error',
        message: err.message || 'Failed to reject contact request'
      });
      alert(`Failed to reject contact request: ${err.message}`);
    } finally {
      setProcessingAction(false);
    }
  };

  // ✅ NEW: Function to extract profile ID from notification
  const extractProfileIdFromNotification = (notification) => {
    try {
      // Check if there's an actionUrl that might contain profile ID
      if (
        notification.actionUrl &&
        notification.actionUrl.includes("/profiles/")
      ) {
        const matches = notification.actionUrl.match(/\/profiles\/(\d+)/);
        if (matches && matches[1]) {
          setProfileId(parseInt(matches[1]));
          return;
        }
      }

      // Check message for profile ID
      if (notification.message) {
        const idMatch =
          notification.message.match(/profile\s*ID[:\s]*(\d+)/i) ||
          notification.message.match(/profile\s*#(\d+)/i);
        if (idMatch && idMatch[1]) {
          setProfileId(parseInt(idMatch[1]));
          return;
        }
      }

      // Check title for profile ID
      if (notification.title) {
        const idMatch =
          notification.title.match(/profile\s*ID[:\s]*(\d+)/i) ||
          notification.title.match(/profile\s*#(\d+)/i);
        if (idMatch && idMatch[1]) {
          setProfileId(parseInt(idMatch[1]));
          return;
        }
      }
    } catch (err) {
      console.error("Error extracting profile ID:", err);
    }
  };

  // ✅ NEW: Check contact request status
  const checkContactRequestStatus = async () => {
    if (!profileId) return;

    try {
      setCheckingContact(true);

      // Call your backend API to check contact request status
      const response = await profileService.getContactRequestStatus(profileId);

      if (response && response.success) {
        setContactRequestStatus(response.status || null);

        if (response.status === "ACCEPTED" && response.contact) {
          setContactInfo(response.contact);
        }
      }
    } catch (err) {
      console.error("Error checking contact status:", err);
    } finally {
      setCheckingContact(false);
    }
  };

  // ✅ NEW: Function to handle "Take Action" button
  const handleTakeAction = async () => {
    if (!profileId) {
      alert("Could not find profile information");
      return;
    }

    try {
      // Navigate to the profile page
      navigate(`/profiles/${profileId}`);
    } catch (err) {
      console.error("Error navigating to profile:", err);
      alert("Failed to navigate to profile");
    }
  };

  // ✅ NEW: Function to view contact details
  const handleViewContactDetails = () => {
    if (contactInfo) {
      // Show contact info in a modal or alert
      const contactMessage = `
Contact Details:
📞 Phone: ${contactInfo.phone || "Not provided"}
📧 Email: ${contactInfo.email || "Not provided"}
      `;

      alert(contactMessage);
    }
  };

  const getNotificationAction = () => {
    if (!notification) return null;

    const { type, message } = notification;

    if (type === "CONTACT_REQUEST_RESPONSE" || type === "INTEREST") {
      // Check if this is a request FROM you or TO you
      const isRequestToYou = message?.includes('requested your contact') || 
                            message?.includes('wants to connect') ||
                            message?.includes('contact request');
      
      const isRequestFromYou = message?.includes('accepted') || 
                              message?.includes('rejected') ||
                              message?.includes('your request');

      if (isRequestToYou) {
        // Someone wants YOUR contact info
        return {
          type: "CONTACT_REQUEST_TO_YOU",
          title: "Contact Request Received",
          description: message || "Someone wants to connect with you.",
          buttonText: "Accept & Share Contact",
          action: handleAcceptContactRequest,
          showActions: true, // Show accept/reject buttons
          showContactInfo: false,
        };
      } else if (isRequestFromYou && message?.includes('accepted')) {
        // Your request was accepted
        return {
          type: "CONTACT_ACCEPTED",
          title: "Contact Request Accepted",
          description: "Your contact request has been accepted!",
          buttonText: contactInfo ? "View Contact Details" : "View Profile",
          action: contactInfo ? handleViewContactDetails : () => navigate(`/profiles/${profileId}`),
          showActions: false,
          showContactInfo: !!contactInfo,
        };
      } else if (isRequestFromYou && message?.includes('rejected')) {
        // Your request was rejected
        return {
          type: "CONTACT_REJECTED",
          title: "Contact Request Rejected",
          description: "Your contact request has been rejected.",
          buttonText: "View Other Profiles",
          action: () => navigate("/discover"),
          showActions: false,
          showContactInfo: false,
        };
      } else {
        // Generic interest notification
        return {
          type: "CONTACT_GENERIC",
          title: "Interest Received",
          description: message || "Someone showed interest in your profile.",
          buttonText: "View Profile",
          action: () => navigate(`/profiles/${profileId}`),
          showActions: false,
          showContactInfo: false,
        };
      }
    }

    // Default action for other notification types
    return {
      type: "DEFAULT",
      title: "Notification",
      description: message || "You have a new notification.",
      buttonText: "Take Action",
      action: () =>
        notification.actionUrl
          ? (window.location.href = notification.actionUrl)
          : null,
      showActions: false,
      showContactInfo: false,
    };
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "INTEREST":
      case "MATCH":
        return "💕";
      case "MESSAGE":
        return "💬";
      case "PAYMENT":
        return "💰";
      case "SYSTEM":
        return "⚙️";
      case "REMINDER":
        return "⏰";
      default:
        return "🔔";
    }
  };

  const getNotificationTypeLabel = (type) => {
    const typeLabels = {
      INTEREST: "Interest Received",
      MATCH: "New Match",
      MESSAGE: "New Message",
      SYSTEM: "System Notification",
      PAYMENT: "Payment Update",
      REMINDER: "Reminder",
    };
    return typeLabels[type] || type;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Unknown date";

    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await notificationService.deleteNotification(id);
        navigate("/notifications");
      } catch (err) {
        console.error("Error deleting notification:", err);
        alert("Failed to delete notification");
      }
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await notificationService.markAsRead(id);
      setNotification((prev) => ({ ...prev, isRead: true }));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notification details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Notification Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              {error || "The notification you are looking for does not exist."}
            </p>
            <button
              onClick={() => navigate("/notifications")}
              className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Notifications
            </button>
          </div>
        </div>
      </div>
    );
  }

  const notificationAction = getNotificationAction();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/notifications')}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-800 font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Notifications
        </button>

        {/* Contact Request Status Card */}
        {notificationAction && (notification.type === 'CONTACT_REQUEST_RESPONSE' || notification.type === 'INTEREST') && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-l-4 border-yellow-500">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${
                  notificationAction.type === 'CONTACT_ACCEPTED' ? 'bg-green-100' :
                  notificationAction.type === 'CONTACT_REJECTED' ? 'bg-red-100' :
                  notificationAction.type === 'CONTACT_REQUEST_TO_YOU' ? 'bg-blue-100' :
                  'bg-yellow-100'
                }`}>
                  {notificationAction.type === 'CONTACT_ACCEPTED' ? (
                    <CheckIcon className="w-8 h-8 text-green-600" />
                  ) : notificationAction.type === 'CONTACT_REJECTED' ? (
                    <XMarkIcon className="w-8 h-8 text-red-600" />
                  ) : notificationAction.type === 'CONTACT_REQUEST_TO_YOU' ? (
                    <BellIcon className="w-8 h-8 text-blue-600" />
                  ) : (
                    <BellIcon className="w-8 h-8 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{notificationAction.title}</h3>
                  <p className="text-gray-600 mt-1">{notificationAction.description}</p>
                  
                  {/* Show action result if any */}
                  {actionResult && (
                    <div className={`mt-4 p-3 rounded-lg ${actionResult.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                      {actionResult.message}
                    </div>
                  )}
                  
                  {/* Show contact info if available */}
                  {notificationAction.showContactInfo && contactInfo && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Contact Information:</h4>
                      <div className="space-y-2">
                        {contactInfo.phone && (
                          <div className="flex items-center text-gray-700">
                            <PhoneIcon className="w-4 h-4 mr-2 text-green-600" />
                            <span>{contactInfo.phone}</span>
                          </div>
                        )}
                        {contactInfo.email && (
                          <div className="flex items-center text-gray-700">
                            <EnvelopeIcon className="w-4 h-4 mr-2 text-blue-600" />
                            <span>{contactInfo.email}</span>
                          </div>
                        )}
                        {contactInfo.name && (
                          <div className="flex items-center text-gray-700">
                            <UserIcon className="w-4 h-4 mr-2 text-purple-600" />
                            <span>{contactInfo.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              {/* Main action button */}
              <button
                onClick={notificationAction.action}
                disabled={processingAction}
                className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  notificationAction.type === 'CONTACT_ACCEPTED'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : notificationAction.type === 'CONTACT_REJECTED'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : notificationAction.type === 'CONTACT_REQUEST_TO_YOU'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                } ${processingAction ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {processingAction ? 'Processing...' : notificationAction.buttonText}
              </button>
              
              {/* Accept/Reject buttons for incoming requests */}
              {notificationAction.showActions && (
                <>
                  <button
                    onClick={handleAcceptContactRequest}
                    disabled={processingAction}
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                  >
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Accept Request
                  </button>
                  
                  <button
                    onClick={handleRejectContactRequest}
                    disabled={processingAction}
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                  >
                    <XCircleIcon className="w-5 h-5 mr-2" />
                    Reject Request
                  </button>
                </>
              )}
            </div>
            
            {/* Processing indicator */}
            {processingAction && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600 mt-2">Processing your request...</p>
              </div>
            )}
          </div>
        )}

        {/* Main Notification Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-yellow-100 rounded-xl text-2xl">
                {getNotificationIcon(notification.type)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      notification.isRead
                        ? "bg-gray-100 text-gray-600"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {notification.isRead ? "READ" : "UNREAD"}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {getNotificationTypeLabel(notification.type)}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">
                  {notification.title}
                </h1>
                <p className="text-gray-500 mt-1">
                  {formatDateTime(notification.createdAt)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {!notification.isRead && (
                <button
                  onClick={handleMarkAsRead}
                  className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                  title="Mark as read"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete notification"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Message Content */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Message
            </h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 whitespace-pre-line">
                {notification.message}
              </p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {notification.user && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">From User</h4>
                <div className="flex items-center space-x-3">
                  {notification.user.profilePhotoUrl ? (
                    <img
                      src={notification.user.profilePhotoUrl}
                      alt={notification.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-semibold">
                        {notification.user.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {notification.user.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {notification.user.email}
                    </p>
                    {notification.user.age && (
                      <p className="text-sm text-gray-600">
                        {notification.user.age} years old
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Notification Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{notification.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      notification.isRead ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {notification.isRead ? "Read" : "Unread"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {notification.actionUrl && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Action URL:</span>
                    <a
                      href={notification.actionUrl}
                      className="text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      Go to page
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {notification.actionUrl && (
              <a
                href={notification.actionUrl}
                className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
              >
                Take Action
              </a>
            )}
            <button
              onClick={() => navigate("/notifications")}
              className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Back to List
            </button>
          </div>
        </div>

        {/* Related Notifications */}
        {relatedNotifications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Related Notifications
            </h3>
            <div className="space-y-4">
              {relatedNotifications.map((related) => (
                <div
                  key={related.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/notifications/${related.id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getNotificationIcon(related.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {related.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(related.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!related.isRead && (
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    )}
                    <span className="text-gray-400">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDetails;