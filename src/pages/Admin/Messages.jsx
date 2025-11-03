import React, { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Mail,
  User,
  Phone,
  Clock,
} from "lucide-react";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockMessages = [
      {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1234567890",
        subject: "Reservation Inquiry",
        message:
          "Hello, I would like to make a reservation for 4 people this Friday evening. Do you have any availability around 7 PM?",
        is_read: false,
        created_at: "2024-01-15T14:30:00Z",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "+0987654321",
        subject: "Special Dietary Requirements",
        message:
          "I have some food allergies and would like to know if you can accommodate gluten-free and dairy-free options for your menu.",
        is_read: true,
        created_at: "2024-01-15T10:15:00Z",
      },
      {
        id: 3,
        name: "Mike Davis",
        email: "mike.davis@example.com",
        phone: "+1122334455",
        subject: "Private Event Booking",
        message:
          "We're interested in booking your restaurant for a private corporate event for about 30 people next month. Could you please share your group dining options and pricing?",
        is_read: false,
        created_at: "2024-01-14T16:45:00Z",
      },
      {
        id: 4,
        name: "Emily Wilson",
        email: "emily.w@example.com",
        phone: null,
        subject: "Compliment",
        message:
          "Just wanted to say we had an amazing experience at your restaurant last night! The food was exceptional and the service was outstanding. We'll definitely be back!",
        is_read: true,
        created_at: "2024-01-14T09:20:00Z",
      },
    ];
    setMessages(mockMessages);
    setFilteredMessages(mockMessages);
  }, []);

  // Filter messages
  useEffect(() => {
    let filtered = messages.filter((message) => {
      const matchesSearch =
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (message.phone && message.phone.includes(searchTerm));

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "read" && message.is_read) ||
        (statusFilter === "unread" && !message.is_read);

      return matchesSearch && matchesStatus;
    });
    setFilteredMessages(filtered);
  }, [searchTerm, statusFilter, messages]);

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
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Contact Messages Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Manage customer inquiries and messages
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with Add Button */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              All Contact Messages
            </h2>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm shadow-sm hover:shadow transition-colors duration-200">
              <Plus className="w-4 h-4" />
              <span>Add New Message</span>
            </button>
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
          {filteredMessages.length > 0 ? (
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
                        !message.is_read ? "bg-blue-50" : ""
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
                          {message.name}
                        </div>
                        <div className="text-gray-500 text-sm break-words mt-1 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {message.email}
                        </div>
                        {message.phone && (
                          <div className="text-gray-500 text-xs break-words mt-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {message.phone}
                          </div>
                        )}
                      </td>

                      {/* Subject */}
                      <td className="px-2 sm:px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Subject
                        </div>
                        <div className="font-medium text-gray-600 break-words">
                          {message.subject}
                        </div>
                      </td>

                      {/* Message */}
                      <td className="px-2 sm:px-3 py-2 text-gray-500 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Message
                        </div>
                        <div className="break-words line-clamp-2 text-sm">
                          {message.message.length > 100
                            ? `${message.message.substring(0, 100)}...`
                            : message.message}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-2 sm:px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Status
                        </div>
                        <span className={getStatusBadge(message.is_read)}>
                          {message.is_read ? "Read" : "Unread"}
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
                        <div className="flex space-x-3">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800 transition-colors duration-200">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 transition-colors duration-200">
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
                No contact messages found.
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                Create your first message to get started.
              </p>
              <button className="inline-flex items-center text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium transition-colors duration-200">
                <Plus className="w-3 h-3 mr-2" />
                Add your first message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
