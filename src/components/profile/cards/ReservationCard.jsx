import React from "react";
import { User, Phone } from "lucide-react";

const ReservationCard = ({ reservation }) => {
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

  const { date, time } = formatReservationDate(
    reservation.reservation_date,
    reservation.reservation_time
  );

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-900">
            {date} at {time}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {reservation.number_of_guests} guests
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(
            reservation.status
          )}`}
        >
          {reservation.status}
        </span>
      </div>
    </div>
  );
};

export default ReservationCard;
