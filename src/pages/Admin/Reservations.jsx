import React, { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Calendar,
  Phone,
  Mail,
  Users,
  Clock,
} from "lucide-react";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockReservations = [
      {
        id: 1,
        customer_name: "John Smith",
        customer_email: "john.smith@example.com",
        customer_phone: "+1234567890",
        reservation_date: "2024-01-20",
        reservation_time: "19:30:00",
        number_of_guests: 4,
        status: "confirmed",
        special_requests: "Window seat preferred",
        created_at: "2024-01-15T14:30:00Z",
      },
      {
        id: 2,
        customer_name: "Sarah Johnson",
        customer_email: "sarah.j@example.com",
        customer_phone: "+0987654321",
        reservation_date: "2024-01-18",
        reservation_time: "18:00:00",
        number_of_guests: 2,
        status: "pending",
        special_requests: "Anniversary celebration",
        created_at: "2024-01-15T16:20:00Z",
      },
      {
        id: 3,
        customer_name: "Mike Davis",
        customer_email: "mike.davis@example.com",
        customer_phone: "+1122334455",
        reservation_date: "2024-01-22",
        reservation_time: "20:15:00",
        number_of_guests: 6,
        status: "completed",
        special_requests: "",
        created_at: "2024-01-14T10:15:00Z",
      },
      {
        id: 4,
        customer_name: "Emily Wilson",
        customer_email: "emily.w@example.com",
        customer_phone: "+5566778899",
        reservation_date: "2024-01-19",
        reservation_time: "19:00:00",
        number_of_guests: 3,
        status: "cancelled",
        special_requests: "Vegetarian options needed",
        created_at: "2024-01-16T09:45:00Z",
      },
    ];
    setReservations(mockReservations);
    setFilteredReservations(mockReservations);
  }, []);

  // Filter reservations
  useEffect(() => {
    let filtered = reservations.filter((reservation) => {
      const matchesSearch =
        reservation.customer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        reservation.customer_email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (reservation.customer_phone &&
          reservation.customer_phone.includes(searchTerm)) ||
        (reservation.special_requests &&
          reservation.special_requests
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesStatus =
        !statusFilter || reservation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
    setFilteredReservations(filtered);
  }, [searchTerm, statusFilter, reservations]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border";

    switch (status) {
      case "confirmed":
        return `${baseClasses} bg-green-100 text-green-800 border-green-200`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800 border-red-200`;
      case "completed":
        return `${baseClasses} bg-blue-100 text-blue-800 border-blue-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border-gray-200`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatReservationDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Reservations Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Manage customer reservations
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with Add Button */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              All Reservations
            </h2>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm shadow-sm hover:shadow transition-colors duration-200">
              <Plus className="w-4 h-4" />
              <span>Add New Reservation</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by customer name, email, or special requests..."
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
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <button
              onClick={clearFilters}
              className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="p-2 sm:p-3 md:p-4">
          {filteredReservations.length > 0 ? (
            <div className="reservations-table overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 hidden sm:table-header-group">
                  <tr>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guests
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="hover:bg-gray-50 transition-colors duration-150 sm:table-row block border-b sm:border-none p-3 sm:p-0"
                    >
                      {/* ID */}
                      <td className="px-2 sm:px-3 py-2 text-gray-700 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          ID
                        </div>
                        <div className="font-medium">#{reservation.id}</div>
                      </td>

                      {/* Customer */}
                      <td className="px-2 sm:px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Customer
                        </div>
                        <div className="font-medium text-gray-900 break-words">
                          {reservation.customer_name}
                        </div>
                        {reservation.special_requests && (
                          <div className="text-gray-500 text-xs break-words mt-1">
                            {reservation.special_requests}
                          </div>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="px-2 sm:px-3 py-2 text-gray-700 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Contact
                        </div>
                        <div className="text-sm break-words flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {reservation.customer_email}
                        </div>
                        {reservation.customer_phone && (
                          <div className="text-xs text-gray-500 mt-1 break-words flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {reservation.customer_phone}
                          </div>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="px-2 sm:px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Date & Time
                        </div>
                        <div className="font-medium text-gray-900 text-sm break-words flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatReservationDate(reservation.reservation_date)}
                        </div>
                        <div className="text-gray-500 text-xs break-words mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(reservation.reservation_time)}
                        </div>
                      </td>

                      {/* Guests */}
                      <td className="px-2 sm:px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Guests
                        </div>
                        <span className="text-gray-900 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {reservation.number_of_guests} guests
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-2 sm:px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Status
                        </div>
                        <span className={getStatusBadge(reservation.status)}>
                          {reservation.status.charAt(0).toUpperCase() +
                            reservation.status.slice(1)}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-2 sm:px-3 py-2 text-gray-600 text-xs sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Created
                        </div>
                        {formatDate(reservation.created_at)}
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
                          <button className="text-purple-600 hover:text-purple-800 transition-colors duration-200">
                            <RefreshCw className="w-4 h-4" />
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
              <Calendar className="mx-auto w-12 h-12 text-gray-300 mb-3 sm:mb-4" />
              <p className="text-gray-500 text-sm sm:text-base mb-2">
                No reservations found.
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                Create your first reservation to get started.
              </p>
              <button className="inline-flex items-center text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium transition-colors duration-200">
                <Plus className="w-3 h-3 mr-2" />
                Create your first reservation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservations;
