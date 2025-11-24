import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Clock, Truck } from "lucide-react";
import { orderApi } from "../../services/orderApi";

const OrderConfirmation = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { orderId, orderNumber, orderTotal, estimatedDelivery, deliveryType } =
    location.state || {};

  const TAX_RATE = 0.08;
  const DELIVERY_FEE = 2.99;

  useEffect(() => {
    console.log("Location state:", location.state);
    if (orderId) {
      loadOrderConfirmation();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const loadOrderConfirmation = async () => {
    try {
      const orderData = await orderApi.getOrderConfirmation(orderId);
      console.log("Order confirmation data:", orderData);
      setOrder(orderData);
    } catch (error) {
      console.error("Error loading order confirmation:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely get order data
  const getOrderNumber = () => {
    if (order) {
      return (
        order.id?.hex?.slice(0, 8)?.toUpperCase() ||
        order.order_number ||
        `#${order.id?.slice(0, 8)?.toUpperCase()}` ||
        "N/A"
      );
    }
    return orderNumber || `#${orderId?.slice(0, 8)?.toUpperCase()}` || "N/A";
  };

  // Convert to number safely
  const getSubtotal = () => {
    let subtotal = 0;

    if (order) {
      subtotal = order.total_amount || order.subtotal || order.grand_total || 0;
    } else {
      subtotal = orderTotal || 0;
    }

    return parseFloat(subtotal) || 0;
  };

  const getDeliveryFee = () => {
    const isDelivery =
      order?.order_type === "delivery" || deliveryType === "delivery";
    return isDelivery ? DELIVERY_FEE : 0;
  };

  const getTaxAmount = () => {
    const subtotal = getSubtotal();
    return subtotal * TAX_RATE;
  };

  const getGrandTotal = () => {
    const subtotal = getSubtotal();
    const tax = getTaxAmount();
    const deliveryFee = getDeliveryFee();
    const total = subtotal + tax + deliveryFee;
    return parseFloat(total) || 0;
  };

  const getEstimatedDelivery = () => {
    if (order) {
      return order.estimated_delivery || "25-35 minutes";
    }
    return estimatedDelivery || "25-35 minutes";
  };

  const getOrderType = () => {
    if (order) {
      return order.order_type || deliveryType || "delivery";
    }
    return deliveryType || "delivery";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-primary"></div>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order && !orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            Order Not Found
          </h2>
          <Link
            to="/"
            className="text-primary hover:underline text-sm sm:text-base"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isDelivery = getOrderType() === "delivery";
  const subtotal = getSubtotal();
  const taxAmount = getTaxAmount();
  const deliveryFee = getDeliveryFee();
  const grandTotal = getGrandTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-500 mx-auto mb-4 sm:mb-6" />

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Order Confirmed!
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">
            Thank you for your order. We're preparing it now.
          </p>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold">{getOrderNumber()}</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Order Type:</span>
                <span className="font-semibold capitalize">
                  {getOrderType()}
                </span>
              </div>

              {/* Order Breakdown */}
              <div className="border-t pt-3 sm:pt-4 space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {isDelivery && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">
                    Tax ({TAX_RATE * 100}%):
                  </span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base sm:text-lg font-bold border-t pt-2 mt-2">
                  <span>Total Amount:</span>
                  <span className="text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between border-t pt-3 sm:pt-4 text-sm sm:text-base">
                <span className="text-gray-600">
                  Estimated {isDelivery ? "Delivery" : "Pickup"}:
                </span>
                <span className="font-semibold">{getEstimatedDelivery()}</span>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-gray-600 mb-6 sm:mb-8">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">Order Received</span>
            </div>
            <div className="w-4 sm:w-6 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">On the Way</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/menu"
              className="bg-primary text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-accent transition-colors text-sm sm:text-base text-center"
            >
              Order Again
            </Link>
            <Link
              to="/"
              className="bg-gray-200 text-gray-700 px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
