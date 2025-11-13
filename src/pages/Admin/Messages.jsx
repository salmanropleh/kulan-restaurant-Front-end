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
} from "lucide-react";
import { contactAPI } from "../../services/contactAPI";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to safely extract messages from API response
  const extractMessagesFromResponse = (data) => {
    if (!data) return [];

    // Handle different response formats
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

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contactAPI.getMessages();

      // Safely extract messages from response
      const messagesList = extractMessagesFromResponse(response);

      setMessages(messagesList);
      setFilteredMessages(messagesList);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load contact messages. Please try again.");
      setMessages([]);
      setFilteredMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter messages - with additional safety checks
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
    alert(
      `Viewing message from ${message.name}\n\nSubject: ${message.subject}\nMessage: ${message.message}`
    );
  };

  const handleEditMessage = (message) => {
    alert(`Edit functionality for message #${message.id} would open here`);
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

  // Loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
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
      <div className="p-4 sm:p-6 lg:p-8">
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
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Contact Messages Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Manage customer inquiries and messages (
          {Array.isArray(messages) ? messages.length : 0} total)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with Refresh Button */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              All Contact Messages
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchMessages}
                className="border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, email, subject, or message content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
            <button
              onClick={clearFilters}
              className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Contact Messages Table */}
        <div className="p-2 sm:p-3 md:p-4">
          {Array.isArray(filteredMessages) && filteredMessages.length > 0 ? (
            <div className="contact-messages-table overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 hidden sm:table-header-group">
                  <tr>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Received
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <tr
                      key={message.id}
                      className={`hover:bg-gray-50 transition-colors duration-150 sm:table-row block border-b sm:border-none p-3 sm:p-0 ${
                        !getMessageStatus(message) ? "bg-blue-50" : ""
                      }`}
                    >
                      {/* ID */}
                      <td className="px-2 sm:px-3 py-2 text-gray-600 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          ID
                        </div>
                        <div className="font-medium">#{message.id}</div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-2 sm:px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Contact Info
                        </div>
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
                      <td className="px-2 sm:px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Subject
                        </div>
                        <div className="font-medium text-gray-600 break-words capitalize">
                          {getMessageSubject(message)?.replace("_", " ") ||
                            "Other"}
                        </div>
                      </td>

                      {/* Message */}
                      <td className="px-2 sm:px-3 py-2 text-gray-500 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Message
                        </div>
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
                      <td className="px-2 sm:px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Status
                        </div>
                        <span
                          className={getStatusBadge(getMessageStatus(message))}
                        >
                          {getMessageStatus(message) ? "Read" : "Unread"}
                        </span>
                      </td>

                      {/* Received */}
                      <td className="px-2 sm:px-3 py-2 text-gray-500 text-xs sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Received
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(message.created_at)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-2 sm:px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Actions
                        </div>
                        <div className="flex space-x-2">
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
                            title="Edit Message"
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
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Mail className="mx-auto w-12 h-12 text-gray-300 mb-3 sm:mb-4" />
              <p className="text-gray-500 text-sm sm:text-base mb-2">
                {!Array.isArray(messages) || messages.length === 0
                  ? "No contact messages found."
                  : "No messages match your filters."}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                {!Array.isArray(messages) || messages.length === 0
                  ? "Customer messages will appear here when they contact you through the contact form."
                  : "Try adjusting your search or filters."}
              </p>
              {!Array.isArray(messages) || messages.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Check your contact form to ensure it's working properly.
                </p>
              ) : (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium transition-colors duration-200"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
