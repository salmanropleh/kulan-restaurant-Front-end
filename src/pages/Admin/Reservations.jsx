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
  Search,
  X,
  MoreVertical,
} from "lucide-react";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

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
    setShowFilters(false);
    setMobileMenuOpen(null);
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
      <div className="p-4">
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
      <div className="p-4">
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
    <div className="p-4">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Reservations Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage customer reservations ({reservations.length} total)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with Add Button and Refresh */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full sm:text-sm">
                {filteredReservations.length} reservation
                {filteredReservations.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={fetchReservations}
                className="flex-1 sm:flex-none border border-gray-300  bg-primary hover:bg-accent text-white px-3 py-2 rounded text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>

              <button className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors inline-flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">Add New Reservation</span>
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
                placeholder="Search reservations..."
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
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
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

        {/* Reservations Content */}
        <div className="p-4">
          {filteredReservations.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Date & Time</th>
                      <th className="px-4 py-3 text-center">Guests</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredReservations.map((reservation) => (
                      <tr
                        key={reservation.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        {/* ID */}
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          <div className="font-medium text-sm">
                            #{reservation.id}
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900 text-sm">
                            {reservation.customer_name}
                          </div>
                          {reservation.special_requests &&
                            reservation.special_requests.trim() !== "" && (
                              <div className="text-gray-500 text-xs mt-1">
                                {truncateText(reservation.special_requests, 80)}
                              </div>
                            )}
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <div className="flex items-start gap-2 mb-1">
                              <Mail className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
                              <span>
                                {truncateText(reservation.customer_email, 30)}
                              </span>
                            </div>
                            {reservation.customer_phone && (
                              <div className="flex items-start gap-2">
                                <Phone className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {reservation.customer_phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="px-4 py-3 whitespace-nowrap">
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
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className="text-gray-900 text-sm flex items-center gap-2 justify-center">
                            <Users className="w-3 h-3 text-gray-400" />
                            {reservation.number_of_guests} guests
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className={getStatusBadge(reservation.status)}>
                            {reservation.status?.charAt(0).toUpperCase() +
                              reservation.status?.slice(1) || "Unknown"}
                          </span>
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                          {formatDate(reservation.created_at)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex justify-center space-x-2">
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

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {filteredReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Header with ID and Actions */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            #{reservation.id}
                          </span>
                          <span className={getStatusBadge(reservation.status)}>
                            {reservation.status?.charAt(0).toUpperCase() +
                              reservation.status?.slice(1) || "Unknown"}
                          </span>
                        </div>
                      </div>

                      {/* Mobile Menu */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setMobileMenuOpen(
                              mobileMenuOpen === reservation.id
                                ? null
                                : reservation.id
                            )
                          }
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {mobileMenuOpen === reservation.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Reservation
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Reservation
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-3">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm mb-1">
                          {reservation.customer_name}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-3 h-3" />
                            {reservation.customer_email}
                          </div>
                          {reservation.customer_phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-3 h-3" />
                              {reservation.customer_phone}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Date</div>
                          <div className="flex items-center gap-1 text-gray-700">
                            <Calendar className="w-3 h-3" />
                            {formatReservationDate(
                              reservation.reservation_date
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Time</div>
                          <div className="flex items-center gap-1 text-gray-700">
                            <Clock className="w-3 h-3" />
                            {formatTime(reservation.reservation_time)}
                          </div>
                        </div>
                      </div>

                      {/* Guests & Created */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Guests
                          </div>
                          <div className="flex items-center gap-1 text-gray-700">
                            <Users className="w-3 h-3" />
                            {reservation.number_of_guests} guests
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Created
                          </div>
                          <div className="text-gray-700">
                            {formatDate(reservation.created_at)}
                          </div>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {reservation.special_requests &&
                        reservation.special_requests.trim() !== "" && (
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Special Requests
                            </div>
                            <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                              {reservation.special_requests}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm mb-2">
                {reservations.length === 0
                  ? "No reservations found"
                  : "No reservations match your filters"}
              </p>
              <p className="text-gray-400 text-xs">
                {reservations.length === 0
                  ? "Create your first reservation to get started"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservations;
