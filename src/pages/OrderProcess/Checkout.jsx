import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  User,
  Phone,
  Truck,
  Store,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Add this import

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    deliveryType: "delivery", // "delivery" or "pickup"
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    specialInstructions: "",
  });

  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("kulanCart") || "[]");
  const { user } = useAuth(); // Get user from auth context

  // Fixed fees
  const DELIVERY_FEE = 2.99;
  const TAX_RATE = 0.08; // 8%

  // Auto-fill form from auth context user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        // Address fields remain empty as they're not in user profile
      }));
    }
  }, [user]); // Add user as dependency

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const getDeliveryFee = () => {
    return formData.deliveryType === "delivery" ? DELIVERY_FEE : 0;
  };

  const getTaxAmount = () => {
    return getTotalPrice() * TAX_RATE;
  };

  const getGrandTotal = () => {
    return getTotalPrice() + getDeliveryFee() + getTaxAmount();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic form validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone
    ) {
      alert("Please fill in all required contact information");
      return;
    }

    if (
      formData.deliveryType === "delivery" &&
      (!formData.address || !formData.city || !formData.zipCode)
    ) {
      alert("Please fill in all required address fields for delivery");
      return;
    }

    if (
      formData.paymentMethod === "card" &&
      (!formData.cardNumber || !formData.expiryDate || !formData.cvv)
    ) {
      alert("Please fill in all required payment information");
      return;
    }

    // Create order object
    const order = {
      id: Date.now().toString(),
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address:
          formData.deliveryType === "delivery"
            ? {
                street: formData.address,
                city: formData.city,
                zipCode: formData.zipCode,
              }
            : null,
      },
      items: cart,
      deliveryType: formData.deliveryType,
      paymentMethod: formData.paymentMethod,
      specialInstructions: formData.specialInstructions,
      subtotal: getTotalPrice(),
      deliveryFee: getDeliveryFee(),
      tax: getTaxAmount(),
      total: getGrandTotal(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Save order to localStorage (or send to your backend)
    const existingOrders = JSON.parse(
      localStorage.getItem("kulanOrders") || "[]"
    );
    const updatedOrders = [...existingOrders, order];
    localStorage.setItem("kulanOrders", JSON.stringify(updatedOrders));

    // Clear the cart
    localStorage.removeItem("kulanCart");

    // Show success message and redirect
    alert(`🎉 Order placed successfully! Order #${order.id}`);

    // Redirect to order confirmation or home page
    navigate("/order-confirmation", {
      state: {
        orderId: order.id,
        orderTotal: order.total,
      },
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/cart"
              className="flex items-center bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Cart</span>
            </Link>

            <h1 className="text-3xl font-bold">Checkout</h1>

            <div className="flex items-center space-x-2">
              <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Details & Forms */}
            <div className="space-y-6">
              {/* Delivery Type */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Truck className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Delivery Type</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="delivery"
                      checked={formData.deliveryType === "delivery"}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <Truck className="h-8 w-8 text-primary mb-2" />
                    <span className="font-semibold">Delivery</span>
                    <span className="text-sm text-gray-500 mt-1">
                      $2.99 delivery fee
                    </span>
                    <span className="text-xs text-gray-400">25-35 min</span>
                  </label>

                  <label className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="pickup"
                      checked={formData.deliveryType === "pickup"}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <Store className="h-8 w-8 text-primary mb-2" />
                    <span className="font-semibold">Pickup</span>
                    <span className="text-sm text-gray-500 mt-1">
                      No delivery fee
                    </span>
                    <span className="text-xs text-gray-400">15-25 min</span>
                  </label>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address - Only show for delivery */}
              {formData.deliveryType === "delivery" && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <MapPin className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold">Delivery Address</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      Credit/Debit Card
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === "cash"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      Cash on Delivery
                    </label>
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Special Instructions</h2>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Any special delivery instructions or notes for the kitchen..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                            {item.extras?.length > 0 && (
                              <p className="text-xs text-gray-400">
                                Extra: {item.extras.join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>

                  {formData.deliveryType === "delivery" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>${DELIVERY_FEE.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Tax ({TAX_RATE * 100}%)
                    </span>
                    <span>${getTaxAmount().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Total</span>
                    <span className="text-primary">
                      ${getGrandTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Delivery/Pickup Time */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-semibold">
                      Estimated{" "}
                      {formData.deliveryType === "delivery"
                        ? "Delivery"
                        : "Pickup"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.deliveryType === "delivery"
                      ? "25-35 minutes"
                      : "15-25 minutes"}
                  </p>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-secondary text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 text-lg mt-6"
                >
                  Place Order - ${getGrandTotal().toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
