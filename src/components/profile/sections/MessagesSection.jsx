import React, { useState, useEffect } from "react";
import {
  Mail,
  Eye,
  Clock,
  Loader,
  AlertCircle,
  RefreshCw,
  User,
  Phone,
  MessageCircle,
} from "lucide-react";
import { contactAPI } from "../../../services/contactAPI";
import { useAuth } from "../../../context/AuthContext";

const MessagesSection = ({ messages, loading, error, onMessagesUpdate }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total_messages: 0,
    unread_messages: 0,
    read_messages: 0,
    user_type: "user",
  });

  // Fetch message stats
  const fetchStats = async () => {
    try {
      const statsData = await contactAPI.getUserMessageStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching message stats:", err);
      setStats({
        total_messages: 0,
        unread_messages: 0,
        read_messages: 0,
        user_type: "user",
      });
    }
  };

  // Refresh messages
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onMessagesUpdate();
      await fetchStats();
    } catch (err) {
      console.error("Error refreshing messages:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Mark message as read
  const handleMarkAsRead = async (messageId) => {
    try {
      await contactAPI.markAsRead(messageId);
      // Update local state to reflect the change
      if (onMessagesUpdate) {
        await onMessagesUpdate();
      }
      await fetchStats();
    } catch (err) {
      console.error("Error marking message as read:", err);
      alert("Failed to mark message as read. Please try again.");
    }
  };

  // View message details
  const handleViewMessage = async (message) => {
    // Mark as read when viewing if it's unread
    if (!message.is_read) {
      await handleMarkAsRead(message.id);
    }

    alert(
      `Message Details\n\nFrom: ${message.name || "N/A"}\nEmail: ${
        message.email || "N/A"
      }\nPhone: ${message.phone || "N/A"}\nSubject: ${
        message.subject || "No Subject"
      }\n\nMessage:\n${message.message || "No message content"}`
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get status badge class
  const getStatusBadge = (isRead) => {
    return isRead
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-yellow-100 text-yellow-800 border border-yellow-200";
  };

  // Safe value getters
  const getMessageName = (message) => message?.name || "Unknown Sender";
  const getMessageEmail = (message) => message?.email || "No email provided";
  const getMessagePhone = (message) => message?.phone || "No phone provided";
  const getMessageSubject = (message) => message?.subject || "No Subject";
  const getMessageContent = (message) =>
    message?.message || "No message content available";

  // Fetch stats on component mount
  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Messages & Notifications
        </h2>
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 text-orange-600 animate-spin mr-3" />
          <span className="text-gray-600">Loading your messages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Messages & Notifications
        </h2>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm mx-auto"
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>{refreshing ? "Refreshing..." : "Try Again"}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Messages & Notifications
          </h2>
          <p className="text-gray-600 mt-1">
            {stats.user_type === "admin"
              ? "All contact messages from customers"
              : "Your messages from the restaurant"}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 text-sm font-medium disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Total Messages
              </p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {stats.total_messages}
              </p>
            </div>
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Unread</p>
              <p className="text-2xl font-bold text-yellow-700 mt-1">
                {stats.unread_messages}
              </p>
            </div>
            <Eye className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Read</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {stats.read_messages}
              </p>
            </div>
            <MessageCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No messages yet
            </h3>
            <p className="text-gray-500 mb-4">
              {stats.user_type === "admin"
                ? "Customer messages will appear here when they contact you."
                : "Your messages from the restaurant will appear here."}
            </p>
            <button
              onClick={() => (window.location.href = "/contact")}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Contact Us
            </button>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-6 rounded-lg border ${
                !message.is_read
                  ? "bg-orange-50 border-orange-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {getMessageSubject(message)}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                        message.is_read
                      )}`}
                    >
                      {message.is_read ? "Read" : "Unread"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{getMessageName(message)}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{getMessageEmail(message)}</span>
                    </div>
                    {message.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{getMessagePhone(message)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {getMessageContent(message)}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDate(message.created_at)}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewMessage(message)}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  {!message.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesSection;
