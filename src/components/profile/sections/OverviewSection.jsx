import React from "react";
import { Package, Calendar, Star, AlertCircle, Loader } from "lucide-react";
import OrderCard from "../cards/OrderCard"; // Change to default import
import ReservationCard from "../cards/ReservationCard"; // Change to default import

const OverviewSection = ({
  user,
  orders,
  reservations,
  loading,
  reservationsLoading,
  error,
  reservationsError,
  activeOrders,
  totalSpent,
}) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>

      {error && (
        <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {reservationsError && (
        <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5" />
          <span>{reservationsError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Stats */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">
                Active Orders
              </p>
              <p className="text-2xl font-bold text-orange-700 mt-1">
                {activeOrders}
              </p>
            </div>
            <Package className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {orders.length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Spent</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
            <Star className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Orders
          </h3>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="h-6 w-6 text-orange-600 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No orders yet</p>
              <button
                onClick={() => (window.location.href = "/menu")}
                className="text-orange-600 hover:text-orange-700 mt-2"
              >
                Start your first order
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Reservations */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Reservations
          </h3>
          {reservationsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="h-6 w-6 text-orange-600 animate-spin" />
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No upcoming reservations</p>
              <button
                onClick={() => (window.location.href = "/reservations")}
                className="text-orange-600 hover:text-orange-700 mt-2"
              >
                Book a Table
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations
                .filter(
                  (res) =>
                    res.status === "confirmed" || res.status === "pending"
                )
                .slice(0, 2)
                .map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
