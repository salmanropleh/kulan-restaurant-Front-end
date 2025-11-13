import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Phone,
  Users,
  CheckCircle,
  XCircle,
  Mail,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

const RecentReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecentReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:8000/api/reservations/reservations/?ordering=-created_at&limit=5"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch reservations: ${response.status}`);
      }

      const data = await response.json();
      const reservationsList = Array.isArray(data)
        ? data
        : data.results || data;

      setReservations(reservationsList.slice(0, 5)); // only recent 5
    } catch (error) {
      console.error("Error fetching recent reservations:", error);
      setError("Failed to load recent reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentReservations();
  }, []);

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border";
    switch (status?.toLowerCase()) {
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Unknown";
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  const formatCreated = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Reservations
        </h3>
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
        <p className="text-gray-600 mb-2">{error}</p>
        <button
          onClick={fetchRecentReservations}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-1 mx-auto"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Recent Reservations
        </h3>
        <button
          onClick={fetchRecentReservations}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {reservations.length > 0 ? (
        <div className="space-y-3">
          {reservations.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-gray-900 truncate">
                      {r.customer_name || "Unknown"}
                    </span>
                    <span className={getStatusBadge(r.status)}>
                      {getStatusIcon(r.status)}
                      {r.status?.charAt(0).toUpperCase() + r.status?.slice(1) ||
                        "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{r.number_of_guests} guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(r.reservation_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(r.reservation_time)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                    {r.customer_email && (
                      <div className="flex items-center gap-1 truncate max-w-[120px]">
                        <Mail className="w-3 h-3" />
                        <span>{r.customer_email}</span>
                      </div>
                    )}
                    {r.customer_phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{r.customer_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                  Created:
                </p>
                <p className="text-xs text-gray-600 font-medium whitespace-nowrap">
                  {formatCreated(r.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No recent reservations</p>
        </div>
      )}

      {reservations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            to="/admin/reservations"
            className="block text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All Reservations
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentReservations;
