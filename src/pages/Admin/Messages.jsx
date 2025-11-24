import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Mail,
  User,
  Phone,
  Clock,
  RefreshCw,
  Loader,
  AlertCircle,
  LogIn,
  Shield,
  Search,
  X,
  MoreVertical,
} from "lucide-react";
import { contactAPI } from "../../services/contactAPI";
import { useAuth } from "../../context/AuthContext";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const { user, isLoading: authLoading } = useAuth();

  // Helper function to safely extract messages from API response
  const extractMessagesFromResponse = (data) => {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data;
    } else if (data.results && Array.isArray(data.results)) {
      return data.results;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (typeof data === "object") {
      return [data];
    }

    return [];
  };

  // Check authentication and admin status
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      setIsAdmin(user.is_staff || user.is_superuser || false);
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, [user]);

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        setError("Please log in to view messages.");
        setLoading(false);
        return;
      }

      if (!isAdmin) {
        setError("You need administrator privileges to view contact messages.");
        setLoading(false);
        return;
      }

      const response = await contactAPI.getMessages();
      const messagesList = extractMessagesFromResponse(response);

      setMessages(messagesList);
      setFilteredMessages(messagesList);
    } catch (error) {
      console.error("Error fetching messages:", error);

      if (
        error.message.includes("log in") ||
        error.message.includes("permission") ||
        error.message.includes("401") ||
        error.message.includes("403")
      ) {
        setError("Authentication failed. Please log in again.");
        setIsAuthenticated(false);
      } else {
        setError("Failed to load contact messages. Please try again.");
      }

      setMessages([]);
      setFilteredMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages when user becomes authenticated and is admin
  useEffect(() => {
    if (user && isAdmin && !authLoading) {
      fetchMessages();
    }
  }, [user, isAdmin, authLoading]);

  // Filter messages
  useEffect(() => {
    if (!Array.isArray(messages)) {
      setFilteredMessages([]);
      return;
    }

    let filtered = messages.filter((message) => {
      if (!message || typeof message !== "object") return false;

      const matchesSearch =
        (message.name &&
          message.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (message.email &&
          message.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (message.subject &&
          message.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (message.message &&
          message.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (message.phone && message.phone.includes(searchTerm));

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "read" && message.is_read) ||
        (statusFilter === "unread" && !message.is_read);

      return matchesSearch && matchesStatus;
    });
    setFilteredMessages(filtered);
  }, [searchTerm, statusFilter, messages]);

  // Handle message actions
  const handleViewMessage = (message) => {
    const fullMessage = `From: ${getMessageName(message)}
Email: ${getMessageEmail(message)}
Phone: ${getMessagePhone(message) || "Not provided"}
Subject: ${getMessageSubject(message)}
Date: ${formatDate(message.created_at)}
Status: ${getMessageStatus(message) ? "Read" : "Unread"}

Message:
${getMessageContent(message)}`;

    alert(fullMessage);

    if (!getMessageStatus(message)) {
      handleMarkAsRead(message.id);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await contactAPI.markAsRead(messageId);
      await fetchMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleEditMessage = async (message) => {
    const newStatus = !getMessageStatus(message);
    try {
      await contactAPI.updateMessage(message.id, { is_read: newStatus });
      await fetchMessages();
    } catch (error) {
      console.error("Error updating message:", error);
      alert("Error updating message. Please try again.");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this message? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await contactAPI.deleteMessage(messageId);
      await fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Error deleting message. Please try again.");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setShowFilters(false);
    setMobileMenuOpen(null);
  };

  const getStatusBadge = (isRead) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border";

    return isRead
      ? `${baseClasses} bg-green-100 text-green-800 border-green-200`
      : `${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`;
  };

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

  // Safe value getters for message properties
  const getMessageName = (message) => {
    return message?.name || "Unknown";
  };

  const getMessageEmail = (message) => {
    return message?.email || "";
  };

  const getMessagePhone = (message) => {
    return message?.phone || "";
  };

  const getMessageSubject = (message) => {
    return message?.subject || "other";
  };

  const getMessageContent = (message) => {
    return message?.message || "";
  };

  const getMessageStatus = (message) => {
    return message?.is_read || false;
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <Loader className="w-8 h-8 text-green-600 animate-spin mr-3" />
            <span className="text-gray-600">Checking authentication...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!user) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <LogIn className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view contact messages.
            </p>
            <button
              onClick={handleLoginRedirect}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 mx-auto"
            >
              <LogIn className="w-5 h-5" />
              <span>Log In</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not admin state
  if (!isAdmin) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Shield className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Admin Access Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need administrator privileges to view contact messages.
            </p>
            <p className="text-sm text-gray-500">
              Logged in as: {user.email || user.username}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <Loader className="w-8 h-8 text-green-600 animate-spin mr-3" />
            <span className="text-gray-600">Loading messages...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchMessages}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Contact Messages Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage customer inquiries and messages ({messages.length} total)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with Refresh - UPDATED */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full sm:text-sm">
                {filteredMessages.length} message
                {filteredMessages.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={fetchMessages}
                className="flex-1 sm:flex-none bg-primary hover:bg-accent text-white px-3 py-2 rounded text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-200">
          {/* Search Bar */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded pl-10 pr-4 py-2 text-sm w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>

            {/* Mobile Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded text-sm transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Filters - Collapsible on mobile */}
          <div className={`${showFilters ? "block" : "hidden"} sm:block`}>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
              >
                <option value="">All Status</option>
                <option value="read">Read</option>
                <option value="unread">Unread</option>
              </select>

              <button
                onClick={clearFilters}
                className="border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Content */}
        <div className="p-4">
          {filteredMessages.length > 0 ? (
            <>
              {/* Desktop Table - UPDATED with secondary background */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Contact Info</th>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Message</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3">Received</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMessages.map((message) => (
                      <tr
                        key={message.id}
                        className={`hover:bg-gray-50 transition-colors duration-150 ${
                          !getMessageStatus(message)
                            ? "bg-blue-50 hover:bg-blue-100"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        {/* ID */}
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          <div className="font-medium text-sm">
                            #{message.id}
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-600 break-words flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {getMessageName(message)}
                          </div>
                          <div className="text-gray-500 text-sm break-words mt-1 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {getMessageEmail(message)}
                          </div>
                          {getMessagePhone(message) && (
                            <div className="text-gray-500 text-xs break-words mt-1 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {getMessagePhone(message)}
                            </div>
                          )}
                        </td>

                        {/* Subject */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-600 break-words capitalize">
                            {getMessageSubject(message)?.replace("_", " ") ||
                              "Other"}
                          </div>
                        </td>

                        {/* Message */}
                        <td className="px-4 py-3 text-gray-500">
                          <div className="break-words line-clamp-2 text-sm">
                            {getMessageContent(message).length > 100
                              ? `${getMessageContent(message).substring(
                                  0,
                                  100
                                )}...`
                              : getMessageContent(message)}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span
                            className={getStatusBadge(
                              getMessageStatus(message)
                            )}
                          >
                            {getMessageStatus(message) ? "Read" : "Unread"}
                          </span>
                        </td>

                        {/* Received */}
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(message.created_at)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleViewMessage(message)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 rounded hover:bg-blue-50"
                              title="View Message"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleEditMessage(message)}
                              className="text-green-600 hover:text-green-800 transition-colors duration-200 p-1 rounded hover:bg-green-50"
                              title={
                                getMessageStatus(message)
                                  ? "Mark as Unread"
                                  : "Mark as Read"
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                              title="Delete Message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
                      !getMessageStatus(message)
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                  >
                    {/* Header with ID and Actions */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            #{message.id}
                          </span>
                          <span
                            className={getStatusBadge(
                              getMessageStatus(message)
                            )}
                          >
                            {getMessageStatus(message) ? "Read" : "Unread"}
                          </span>
                        </div>
                      </div>

                      {/* Mobile Menu */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setMobileMenuOpen(
                              mobileMenuOpen === message.id ? null : message.id
                            )
                          }
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {mobileMenuOpen === message.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button
                              onClick={() => handleViewMessage(message)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Message
                            </button>
                            <button
                              onClick={() => handleEditMessage(message)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              {getMessageStatus(message)
                                ? "Mark as Unread"
                                : "Mark as Read"}
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Message
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Message Info */}
                    <div className="space-y-3">
                      {/* Contact Info */}
                      <div>
                        <div className="font-semibold text-gray-900 text-sm mb-1">
                          {getMessageName(message)}
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-3 h-3" />
                            {getMessageEmail(message)}
                          </div>
                          {getMessagePhone(message) && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-3 h-3" />
                              {getMessagePhone(message)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Subject & Date */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Subject
                          </div>
                          <div className="text-gray-700 font-medium capitalize">
                            {getMessageSubject(message)?.replace("_", " ") ||
                              "Other"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Received
                          </div>
                          <div className="flex items-center gap-1 text-gray-700">
                            <Clock className="w-3 h-3" />
                            {formatDate(message.created_at)}
                          </div>
                        </div>
                      </div>

                      {/* Message Preview */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Message
                        </div>
                        <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {getMessageContent(message).length > 150
                            ? `${getMessageContent(message).substring(
                                0,
                                150
                              )}...`
                            : getMessageContent(message)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Mail className="mx-auto w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm mb-2">
                {messages.length === 0
                  ? "No contact messages found"
                  : "No messages match your filters"}
              </p>
              <p className="text-gray-400 text-xs">
                {messages.length === 0
                  ? "Customer messages will appear here when they contact you"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
