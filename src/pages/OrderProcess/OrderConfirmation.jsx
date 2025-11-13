import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Clock, Truck } from "lucide-react";
import { orderApi } from "../../services/orderApi";

const OrderConfirmation = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { orderId, orderNumber, orderTotal, estimatedDelivery } =
    location.state || {};

  useEffect(() => {
    if (orderId) {
      loadOrderConfirmation();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const loadOrderConfirmation = async () => {
    try {
      const orderData = await orderApi.getOrderConfirmation(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error("Error loading order confirmation:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order && !orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <Link to="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const displayOrder = order || {
    order_number: orderNumber || `#${orderId?.toUpperCase()}`,
    grand_total: orderTotal,
    estimated_delivery: estimatedDelivery || "25-35 minutes",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom section-padding">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Thank you for your order. We're preparing it now.
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold">
                  {displayOrder.order_number}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-primary">
                  ${parseFloat(displayOrder.grand_total).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-semibold">
                  {displayOrder.estimated_delivery}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 text-gray-600 mb-8">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Order Received</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>On the Way</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-accent transition-colors"
            >
              Order Again
            </Link>
            <Link
              to="/"
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors"
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
