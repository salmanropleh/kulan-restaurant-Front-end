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
    delivery_type: "delivery",
    payment_method: "card",
    special_instructions: "",
  });

  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  const DELIVERY_FEE = 2.99;
  const TAX_RATE = 0.08;

  useEffect(() => {
    loadCart();
    if (user) {
      setFormData((prev) => ({
        ...prev,
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone
    ) {
      setToastMessage("Please fill in all required contact information");
      setShowToast(true);
      setLoading(false);
      return;
    }

    if (
      formData.delivery_type === "delivery" &&
      (!formData.address || !formData.city || !formData.zip_code)
    ) {
      setToastMessage(
        "Please fill in all required address fields for delivery"
      );
      setShowToast(true);
      setLoading(false);
      return;
    }

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link to="/menu" className="text-primary hover:underline">
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />

      <div className="container-custom section-padding">
        <div className="max-w-6xl mx-auto">
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

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Truck className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold">Delivery Type</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        name="delivery_type"
                        value="delivery"
                        checked={formData.delivery_type === "delivery"}
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
                        name="delivery_type"
                        value="pickup"
                        checked={formData.delivery_type === "pickup"}
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
                        name="first_name"
                        value={formData.first_name}
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
                        name="last_name"
                        value={formData.last_name}
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

                {formData.delivery_type === "delivery" && (
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
                            name="zip_code"
                            value={formData.zip_code}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                          name="payment_method"
                          value="card"
                          checked={formData.payment_method === "card"}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        Credit/Debit Card
                      </label>

                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="payment_method"
                          value="cash"
                          checked={formData.payment_method === "cash"}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Special Instructions
                  </h2>
                  <textarea
                    name="special_instructions"
                    value={formData.special_instructions}
                    onChange={handleInputChange}
                    placeholder="Any special delivery instructions or notes for the kitchen..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <div className="flex items-start space-x-3">
                            <img
                              src={
                                item.menu_item_details?.image ||
                                "/api/placeholder/300/200"
                              }
                              alt={item.menu_item_details?.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {item.menu_item_details?.name}
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

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>

                    {formData.delivery_type === "delivery" && (
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

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-semibold">
                        Estimated{" "}
                        {formData.delivery_type === "delivery"
                          ? "Delivery"
                          : "Pickup"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.delivery_type === "delivery"
                        ? "25-35 minutes"
                        : "15-25 minutes"}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-secondary text-white py-4 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-400 transition-all duration-200 transform hover:scale-105 text-lg mt-6"
                  >
                    {loading
                      ? "Processing..."
                      : `Place Order - $${getGrandTotal().toFixed(2)}`}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
