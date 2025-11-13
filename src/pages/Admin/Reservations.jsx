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
  Loader,
  AlertCircle,
} from "lucide-react";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reservations from API
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:8000/api/reservations/reservations/"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch reservations: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response formats (array or object with results)
      const reservationsList = Array.isArray(data)
        ? data
        : data.results || data;
      setReservations(reservationsList || []);
      setFilteredReservations(reservationsList || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setError("Failed to load reservations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch reservations on component mount
  useEffect(() => {
    fetchReservations();
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

  // Handle reservation actions
  const handleConfirmReservation = async (reservationId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/reservations/reservations/${reservationId}/confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to confirm reservation");
      }

      // Refresh the reservations list
      await fetchReservations();
    } catch (error) {
      console.error("Error confirming reservation:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/reservations/reservations/${reservationId}/cancel/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel reservation");
      }

      // Refresh the reservations list
      await fetchReservations();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this reservation? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/reservations/reservations/${reservationId}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete reservation");
      }

      // Refresh the reservations list
      await fetchReservations();
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Error deleting reservation. Please try again.");
    }
  };

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

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return timeString;
    }
  };

  const formatReservationDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Truncate long text with ellipsis
  const truncateText = (text, maxLength = 50) => {
    if (!text || text.trim() === "") return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <Loader className="w-8 h-8 text-green-600 animate-spin mr-3" />
            <span className="text-gray-600">Loading reservations...</span>
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
              onClick={fetchReservations}
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
          Reservations Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Manage customer reservations ({reservations.length} total)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with Add Button and Refresh */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              All Reservations
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchReservations}
                className="border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm shadow-sm hover:shadow transition-colors duration-200">
                <Plus className="w-4 h-4" />
                <span>Add New Reservation</span>
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
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      ID
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                      Customer
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                      Contact
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Date & Time
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Guests
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Created
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {/* ID */}
                      <td className="px-3 py-4 text-gray-700 whitespace-nowrap">
                        <div className="font-medium text-sm">
                          #{reservation.id}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-3 py-4">
                        <div className="font-medium text-gray-900 text-sm break-words max-w-[200px]">
                          {reservation.customer_name}
                        </div>
                        {reservation.special_requests &&
                          reservation.special_requests.trim() !== "" && (
                            <div className="text-gray-500 text-xs mt-1 break-words max-w-[200px] line-clamp-2">
                              {truncateText(reservation.special_requests, 80)}
                            </div>
                          )}
                      </td>

                      {/* Contact */}
                      <td className="px-3 py-4">
                        <div className="text-sm break-words max-w-[180px]">
                          <div className="flex items-start gap-2 mb-1">
                            <Mail className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
                            <span className="break-all">
                              {truncateText(reservation.customer_email, 30)}
                            </span>
                          </div>
                          {reservation.customer_phone && (
                            <div className="flex items-start gap-2">
                              <Phone className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
                              <span className="text-xs text-gray-500 break-all">
                                {reservation.customer_phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {formatReservationDate(
                              reservation.reservation_date
                            )}
                          </div>
                          <div className="text-gray-500 text-xs mt-1 flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {formatTime(reservation.reservation_time)}
                          </div>
                        </div>
                      </td>

                      {/* Guests */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="text-gray-900 text-sm flex items-center gap-2">
                          <Users className="w-3 h-3 text-gray-400" />
                          {reservation.number_of_guests} guests
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(reservation.status)}>
                          {reservation.status?.charAt(0).toUpperCase() +
                            reservation.status?.slice(1) || "Unknown"}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-3 py-4 text-gray-600 text-xs whitespace-nowrap">
                        {formatDate(reservation.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 rounded hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            className="text-green-600 hover:text-green-800 transition-colors duration-200 p-1 rounded hover:bg-green-50"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteReservation(reservation.id)
                            }
                            className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                            title="Delete Reservation"
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
              <Calendar className="mx-auto w-12 h-12 text-gray-300 mb-3 sm:mb-4" />
              <p className="text-gray-500 text-sm sm:text-base mb-2">
                {reservations.length === 0
                  ? "No reservations found."
                  : "No reservations match your filters."}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                {reservations.length === 0
                  ? "Create your first reservation to get started."
                  : "Try adjusting your search or filters."}
              </p>
              {reservations.length === 0 ? (
                <button className="inline-flex items-center text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium transition-colors duration-200">
                  <Plus className="w-3 h-3 mr-2" />
                  Create your first reservation
                </button>
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

export default Reservations;
