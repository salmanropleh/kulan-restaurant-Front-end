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
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { orderApi } from "../../services/orderApi";
import Toast from "../../components/ui/Toast/Toast";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip_code: "",
    delivery_type: "",
    payment_method: "",
    special_instructions: "",
  });

  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const { user } = useAuth();

  const DELIVERY_FEE = 2.99;
  const TAX_RATE = 0.08;

  useEffect(() => {
    loadCart();
    if (user) {
      setFormData((prev) => ({
        ...prev,
        first_name: user.first_name || user.firstName || "",
        last_name: user.last_name || user.lastName || "",
        email: user.email || "",
        phone: user.phone_number || user.phone || "",
        address: user.address || "",
        city: user.city || "",
        zip_code: user.zip_code || user.postal_code || "",
      }));
    }
  }, [user]);

  const loadCart = async () => {
    try {
      const cartData = await orderApi.getCart();
      setCart(cartData);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const getTotalPrice = () => cart.subtotal || 0;
  const getTotalItems = () => cart.items?.length || 0;

  const getDeliveryFee = () => {
    return formData.delivery_type === "delivery" ? DELIVERY_FEE : 0;
  };

  const getTaxAmount = () => {
    return getTotalPrice() * TAX_RATE;
  };

  const getGrandTotal = () => {
    return getTotalPrice() + getDeliveryFee() + getTaxAmount();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.first_name.trim())
      errors.first_name = "First name is required";
    if (!formData.last_name.trim()) errors.last_name = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.delivery_type) {
      errors.delivery_type = "Please select delivery type";
    }

    if (!formData.payment_method) {
      errors.payment_method = "Please select payment method";
    }

    if (formData.delivery_type === "delivery") {
      if (!formData.address.trim())
        errors.address = "Address is required for delivery";
      if (!formData.city.trim()) errors.city = "City is required for delivery";
      if (!formData.zip_code.trim())
        errors.zip_code = "ZIP code is required for delivery";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToastMessage("Please fix the errors in the form");
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      await orderApi.createCheckoutSession(formData);
      const result = await orderApi.processOrder(formData);

      if (result.success) {
        setToastMessage(
          `🎉 Order placed successfully! Order ${result.order_number}`
        );
        setShowToast(true);

        navigate("/order-confirmation", {
          state: {
            orderId: result.order_id,
            orderNumber: result.order_number,
            orderTotal: result.grand_total,
            estimatedDelivery: result.estimated_delivery,
          },
        });
      }
    } catch (error) {
      console.error("Error processing order:", error);
      setToastMessage("Error processing order. Please try again.");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  const handleDeliveryTypeChange = (type) => {
    setFormData({
      ...formData,
      delivery_type: type,
    });

    if (validationErrors.delivery_type) {
      setValidationErrors({
        ...validationErrors,
        delivery_type: "",
      });
    }
  };

  const handlePaymentMethodChange = (method) => {
    setFormData({
      ...formData,
      payment_method: method,
    });

    if (validationErrors.payment_method) {
      setValidationErrors({
        ...validationErrors,
        payment_method: "",
      });
    }
  };

  const canSubmit = () => {
    const basicFieldsFilled =
      formData.first_name.trim() &&
      formData.last_name.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.delivery_type &&
      formData.payment_method;

    if (formData.delivery_type === "delivery") {
      return (
        basicFieldsFilled &&
        formData.address.trim() &&
        formData.city.trim() &&
        formData.zip_code.trim()
      );
    }

    return basicFieldsFilled;
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
          <Link to="/menu" className="text-primary hover:underline">
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col space-y-4 mb-6">
          <Link
            to="/cart"
            className="flex items-center justify-center bg-secondary text-white px-4 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 w-full sm:w-auto sm:inline-flex"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Cart</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <h1 className="text-2xl font-bold text-center sm:text-left">
              Checkout
            </h1>

            <div className="flex justify-center sm:justify-start">
              <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            {/* Left Column - Form Sections */}
            <div className="space-y-6">
              {/* Delivery Type Section */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Truck className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold">Delivery Type *</h2>
                </div>

                {validationErrors.delivery_type && (
                  <div className="flex items-center space-x-2 text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">
                      {validationErrors.delivery_type}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  <label
                    className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.delivery_type === "delivery"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery_type"
                      value="delivery"
                      checked={formData.delivery_type === "delivery"}
                      onChange={() => handleDeliveryTypeChange("delivery")}
                      className="sr-only"
                    />
                    <Truck className="h-6 w-6 text-primary mb-2" />
                    <span className="font-semibold text-sm sm:text-base">
                      Delivery
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 mt-1">
                      $2.99 delivery fee
                    </span>
                    <span className="text-xs text-gray-400">25-35 min</span>
                  </label>

                  <label
                    className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.delivery_type === "pickup"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery_type"
                      value="pickup"
                      checked={formData.delivery_type === "pickup"}
                      onChange={() => handleDeliveryTypeChange("pickup")}
                      className="sr-only"
                    />
                    <Store className="h-6 w-6 text-primary mb-2" />
                    <span className="font-semibold text-sm sm:text-base">
                      Pickup
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 mt-1">
                      No delivery fee
                    </span>
                    <span className="text-xs text-gray-400">15-25 min</span>
                  </label>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold">Contact Information</h2>
                  {user && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded hidden sm:inline">
                      Auto-filled
                    </span>
                  )}
                </div>

                {user && (
                  <div className="sm:hidden mb-4">
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      Auto-filled from your profile
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          validationErrors.first_name
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        required
                      />
                      {validationErrors.first_name && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.first_name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          validationErrors.last_name
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        required
                      />
                      {validationErrors.last_name && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.last_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          validationErrors.email
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        required
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.email}
                        </p>
                      )}
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          validationErrors.phone
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        required
                      />
                      {validationErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address Section */}
              {formData.delivery_type === "delivery" && (
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold">Delivery Address *</h2>
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          validationErrors.address
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        required
                      />
                      {validationErrors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                            validationErrors.city
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          required
                        />
                        {validationErrors.city && (
                          <p className="text-red-500 text-xs mt-1">
                            {validationErrors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zip_code"
                          value={formData.zip_code}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                            validationErrors.zip_code
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          required
                        />
                        {validationErrors.zip_code && (
                          <p className="text-red-500 text-xs mt-1">
                            {validationErrors.zip_code}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method Section */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold">Payment Method *</h2>
                </div>

                {validationErrors.payment_method && (
                  <div className="flex items-center space-x-2 text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">
                      {validationErrors.payment_method}
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  <label
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.payment_method === "card"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={formData.payment_method === "card"}
                      onChange={() => handlePaymentMethodChange("card")}
                      className="mr-3"
                    />
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-base">
                      Credit/Debit Card
                    </span>
                  </label>

                  <label
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.payment_method === "cash"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={formData.payment_method === "cash"}
                      onChange={() => handlePaymentMethodChange("cash")}
                      className="mr-3"
                    />
                    <span className="mr-2">💰</span>
                    <span className="text-sm sm:text-base">
                      Cash on Delivery
                    </span>
                  </label>
                </div>
              </div>

              {/* Special Instructions Section */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-bold mb-4">Special Instructions</h2>
                <textarea
                  name="special_instructions"
                  value={formData.special_instructions}
                  onChange={handleInputChange}
                  placeholder="Any special delivery instructions or notes for the kitchen..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:sticky lg:top-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-start space-x-2">
                          <img
                            src={
                              item.menu_item_details?.image ||
                              "/api/placeholder/300/200"
                            }
                            alt={item.menu_item_details?.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                              {item.menu_item_details?.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                            {item.extras?.length > 0 && (
                              <p className="text-xs text-gray-400 truncate">
                                Extra: {item.extras.join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold text-sm sm:text-base ml-2 flex-shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>

                  {formData.delivery_type === "delivery" && (
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>${DELIVERY_FEE.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm sm:text-base">
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

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm sm:text-base">
                      Estimated{" "}
                      {formData.delivery_type === "delivery"
                        ? "Delivery"
                        : "Pickup"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {formData.delivery_type === "delivery"
                      ? "25-35 minutes"
                      : "15-25 minutes"}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !canSubmit()}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 mt-4 text-base ${
                    loading || !canSubmit()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-secondary text-white hover:bg-orange-600"
                  }`}
                >
                  {loading
                    ? "Processing..."
                    : `Place Order - $${getGrandTotal().toFixed(2)}`}
                </button>

                {!canSubmit() && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Please complete all required fields to place your order
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
