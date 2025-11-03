import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Clock, Truck } from "lucide-react";

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, orderTotal } = location.state || {};

  if (!orderId) {
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
                <span className="font-semibold">#{orderId}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-primary">
                  ${orderTotal?.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-semibold">25-35 minutes</span>
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
