import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, MapPin, Clock, User } from "lucide-react";
import Toast from "../components/ui/Toast";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [orderType, setOrderType] = useState("delivery");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    instructions: "",
  });
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("kulanCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlaceOrder = () => {
    // Basic validation
    if (!customerInfo.name || !customerInfo.phone) {
      setSuccessMessage("Please fill in at least your name and phone number");
      setShowSuccess(true);
      return;
    }

    if (orderType === "delivery" && !customerInfo.address) {
      setSuccessMessage("Please provide your delivery address");
      setShowSuccess(true);
      return;
    }

    if (cart.length === 0) {
      setSuccessMessage("Your cart is empty");
      setShowSuccess(true);
      return;
    }

    // Create order object
    const order = {
      id: `ORD-${Date.now()}`,
      customer: customerInfo,
      items: cart,
      orderType,
      total: getTotalPrice(),
      status: "confirmed",
      timestamp: new Date().toISOString(),
      estimatedTime:
        orderType === "delivery" ? "45-60 minutes" : "20-30 minutes",
    };

    // Save order to localStorage
    const existingOrders = JSON.parse(
      localStorage.getItem("kulanOrders") || "[]"
    );
    localStorage.setItem(
      "kulanOrders",
      JSON.stringify([...existingOrders, order])
    );

    // Clear cart
    localStorage.removeItem("kulanCart");

    // Show success message
    setSuccessMessage(
      `Order confirmed! Your ${orderType} order #${order.id} is being prepared.`
    );
    setShowSuccess(true);

    // Redirect to home after delay
    setTimeout(() => {
      navigate("/");
    }, 4000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container-custom section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Add some delicious items to your cart before checking out
            </p>
            <Link
              to="/order-online"
              className="bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto w-fit"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Menu</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      <Toast
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      {/* Header */}
      <section className="bg-white shadow-sm border-b border-gray-100 py-6">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <Link
              to="/order-online"
              className="bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Menu</span>
            </Link>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Complete Your Order
            </h1>
            <div className="w-32"></div> {/* Spacer for balance */}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Customer Info */}
            <div className="space-y-8">
              {/* Order Type Selection */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <span>Order Type</span>
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setOrderType("delivery")}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      orderType === "delivery"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-display font-semibold text-gray-900 text-lg">
                        Delivery
                      </div>
                      <div className="text-gray-600 mt-1">45-60 min</div>
                      <div className="text-sm text-primary font-medium mt-2">
                        $3.99 delivery fee
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setOrderType("pickup")}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      orderType === "pickup"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-display font-semibold text-gray-900 text-lg">
                        Pickup
                      </div>
                      <div className="text-gray-600 mt-1">20-30 min</div>
                      <div className="text-sm text-green-600 font-medium mt-2">
                        Free pickup
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <User className="h-6 w-6 text-primary" />
                  <span>Customer Information</span>
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {orderType === "delivery" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Address *
                      </label>
                      <textarea
                        value={customerInfo.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                        placeholder="Full delivery address including street, city, and zip code"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      value={customerInfo.instructions}
                      onChange={(e) =>
                        handleInputChange("instructions", e.target.value)
                      }
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                      placeholder="Any special requests, dietary restrictions, or delivery notes..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-8">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-8 flex items-center space-x-3">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  <span>Order Summary</span>
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-8">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {item.name}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-primary text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">
                      {orderType === "delivery" ? "$3.99" : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-semibold">
                      ${(getTotalPrice() * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        $
                        {(
                          getTotalPrice() +
                          (orderType === "delivery" ? 3.99 : 0) +
                          getTotalPrice() * 0.08
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-5 mb-8 border border-primary/20">
                  <div className="flex items-center space-x-3 text-primary">
                    <Clock className="h-5 w-5" />
                    <div>
                      <span className="font-semibold text-lg">
                        Estimated {orderType} time
                      </span>
                      <p className="text-primary/80 text-sm mt-1">
                        {orderType === "delivery"
                          ? "45-60 minutes"
                          : "20-30 minutes"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-secondary text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 text-lg shadow-lg hover:shadow-xl"
                >
                  Place Your Order
                </button>

                <p className="text-center text-gray-500 text-sm mt-6">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;
