import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../../components/ui/Toast/Toast";
import { orderApi } from "../../services/orderApi";
import { useAuth } from "../../context/AuthContext";

const CartPage = () => {
  const [cart, setCart] = useState({
    items: [],
    total_items: 0,
    subtotal: 0,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      console.log("Loading cart...");
      const cartData = await orderApi.getCart();
      console.log("Cart data loaded:", cartData);

      if (cartData && cartData.items) {
        setCart(cartData);
      } else {
        console.warn("Cart data missing items:", cartData);
        setCart({
          items: [],
          total_items: 0,
          subtotal: 0,
        });
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart({
        items: [],
        total_items: 0,
        subtotal: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const result = await orderApi.updateCartItem(itemId, newQuantity);
      if (result.success) {
        setCart(result.cart);
        setSuccessMessage("Quantity updated");
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      setSuccessMessage("Error updating quantity");
      setShowSuccess(true);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const result = await orderApi.removeCartItem(itemId);
      if (result.success) {
        setCart(result.cart);
        setSuccessMessage("Item removed from cart");
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setSuccessMessage("Error removing item");
      setShowSuccess(true);
    }
  };

  const clearCart = async () => {
    try {
      const result = await orderApi.clearCart();
      if (result.success) {
        setCart({
          items: [],
          total_items: 0,
          subtotal: 0,
        });
        setSuccessMessage("Cart cleared successfully!");
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      setSuccessMessage("Error clearing cart");
      setShowSuccess(true);
    }
  };

  const getTotalPrice = () => cart.subtotal;
  const getTotalItems = () => cart.total_items;

  const handleProceedToCheckout = () => {
    if (cart.items.length === 0) {
      setSuccessMessage("Your cart is empty!");
      setShowSuccess(true);
      return;
    }

    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <Toast
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6 pb-4 border-b">
            <Link
              to="/menu"
              className="flex items-center justify-center bg-secondary text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm sm:text-base">Back to Menu</span>
            </Link>

            <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
              Your Order
            </h1>

            {cart.items.length > 0 && (
              <div className="flex items-center justify-center space-x-3 sm:space-x-2">
                <span className="text-gray-500 bg-gray-100 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                  {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs sm:text-sm text-red-500 hover:text-red-700 font-semibold"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-24 text-center">
              <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-3 sm:mb-4" />
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-700 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6 px-4">
                Looks like you haven't added anything yet.
              </p>
              <Link
                to="/menu"
                className="px-4 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded-lg font-semibold hover:bg-accent transition-all duration-200 text-sm sm:text-base"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200"
                  >
                    {/* Item Header - Mobile */}
                    <div className="flex justify-between items-start mb-3 sm:hidden">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-base mb-1">
                          {item.menu_item_details?.name}
                        </h3>
                        <div className="text-sm font-semibold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4">
                      {/* Item Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={
                            item.menu_item_details?.image ||
                            "/api/placeholder/300/200"
                          }
                          alt={item.menu_item_details?.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shadow-sm"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        {/* Item Name - Desktop */}
                        <h3 className="font-semibold text-gray-800 text-lg mb-1 hidden sm:block">
                          {item.menu_item_details?.name}
                        </h3>

                        {/* Extras or Ingredients */}
                        {item.extras?.length > 0 ? (
                          <div className="mb-2">
                            <span className="font-medium text-gray-700 text-xs sm:text-sm">
                              Extra Toppings:
                            </span>
                            <div className="mt-1 space-y-1">
                              {item.extras.map((topping, index) => (
                                <div
                                  key={index}
                                  className="flex items-center text-xs sm:text-sm text-gray-600"
                                >
                                  <span className="mr-1">•</span>
                                  <span className="truncate">{topping}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : item.menu_item_details?.ingredients?.length > 0 ? (
                          <div className="mb-2">
                            <span className="font-medium text-gray-700 text-xs sm:text-sm">
                              Ingredients:
                            </span>
                            <div className="mt-1 space-y-1">
                              {item.menu_item_details.ingredients
                                .slice(0, 3)
                                .map((ingredient, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center text-xs sm:text-sm text-gray-600"
                                  >
                                    <span className="mr-1">•</span>
                                    <span className="truncate">
                                      {ingredient}
                                    </span>
                                  </div>
                                ))}
                              {item.menu_item_details.ingredients.length >
                                3 && (
                                <div className="text-xs text-gray-500">
                                  +
                                  {item.menu_item_details.ingredients.length -
                                    3}{" "}
                                  more
                                </div>
                              )}
                            </div>
                          </div>
                        ) : null}

                        {/* Optional notes and spice */}
                        <div className="space-y-1">
                          {item.spice_level && (
                            <div className="text-xs sm:text-sm text-gray-500">
                              • Spice: {item.spice_level}
                            </div>
                          )}
                          {item.special_notes && (
                            <div className="text-xs sm:text-sm text-gray-500 truncate">
                              • "{item.special_notes}"
                            </div>
                          )}
                        </div>

                        {/* Price - Desktop */}
                        <div className="hidden sm:block mt-2">
                          <div className="font-semibold text-gray-700">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-400">
                            (${parseFloat(item.price).toFixed(2)} each)
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls and Delete - Desktop */}
                      <div className="hidden sm:flex flex-col items-center space-y-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center font-semibold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Quantity Controls - Mobile */}
                    <div className="flex items-center justify-between mt-3 sm:hidden">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-400">
                        ${parseFloat(item.price).toFixed(2)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t pt-4 sm:pt-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <span className="text-lg sm:text-xl font-semibold">
                    Total:
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-primary">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-secondary text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-200 text-base sm:text-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
