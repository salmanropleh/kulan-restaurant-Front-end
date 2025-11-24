import React from "react";
import { Calendar, AlertCircle, Loader, User, Phone } from "lucide-react";
import { reservationsApi } from "../../../services/reservationsApi";

const ReservationsSection = ({
  reservations,
  loading,
  error,
  onReservationUpdate,
}) => {
  const handleCancelReservation = async (reservationId) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await reservationsApi.cancelReservation(reservationId);
        // Refresh reservations list
        onReservationUpdate();
      } catch (err) {
        console.error("Error cancelling reservation:", err);
        alert("Failed to cancel reservation. Please try again.");
      }
    }
  };

  const formatReservationDate = (dateString, timeString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: timeString,
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatReservationId = (reservationId) => {
    if (!reservationId) return "#N/A";

    // Handle UUID objects
    if (typeof reservationId === "object" && reservationId.hex) {
      return `#${reservationId.hex.slice(0, 8).toUpperCase()}`;
    }

    // Handle string UUIDs
    if (typeof reservationId === "string") {
      if (reservationId.length >= 8) {
        return `#${reservationId.slice(0, 8).toUpperCase()}`;
      }
      return `#${reservationId.toUpperCase()}`;
    }

    // Handle numeric IDs
    return `#${reservationId}`;
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reservations</h2>

      {error && (
        <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 text-orange-600 animate-spin" />
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No reservations yet
          </h3>
          <p className="text-gray-500 mb-4">
            Make your first reservation and it will appear here
          </p>
          <button
            onClick={() => (window.location.href = "/reservations")}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Book a Table
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => {
            const { date, time } = formatReservationDate(
              reservation.reservation_date,
              reservation.reservation_time
            );

            return (
              <div
                key={reservation.id}
                className="p-6 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {formatReservationId(reservation.id)}
                    </h3>
                    <p className="text-lg text-gray-900 mt-1">
                      {date} at {time}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusColor(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span>{reservation.number_of_guests} guests</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{reservation.customer_phone || "Not provided"}</span>
                  </div>
                </div>

                {reservation.special_requests && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Special requests:</strong>{" "}
                      {reservation.special_requests}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Created:{" "}
                    {new Date(reservation.created_at).toLocaleDateString()}
                  </div>
                  <div className="space-x-3">
                    {reservation.status === "pending" && (
                      <>
                        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                          Modify
                        </button>
                        <button
                          onClick={() =>
                            handleCancelReservation(reservation.id)
                          }
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {reservation.status === "confirmed" && (
                      <button
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReservationsSection;
