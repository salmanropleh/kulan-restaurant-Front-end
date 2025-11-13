import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../../components/ui/Toast/Toast";
import { orderApi } from "../../services/orderApi";

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

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      console.log("Loading cart...");
      const cartData = await orderApi.getCart();
      console.log("Cart data loaded:", cartData);

      // Ensure cart data has the expected structure
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
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Toast
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      <div className="container-custom section-padding">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b pb-4">
            <Link
              to="/menu"
              className="flex items-center bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Menu</span>
            </Link>

            <h1 className="text-2xl font-bold">Your Order</h1>

            {cart.items.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                  {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
                </span>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700 font-semibold"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added anything yet.
              </p>
              <Link
                to="/menu"
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-accent transition-all duration-200"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-12 font-semibold text-gray-700 border-b pb-2 mb-4">
                <div className="col-span-5">ITEM</div>
                <div className="col-span-3 text-center">QUANTITY</div>
                <div className="col-span-3 text-center">PRICE</div>
                <div className="col-span-1 text-center">ACTION</div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-200 mb-8">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 grid grid-cols-12 items-start"
                  >
                    {/* Item Info */}
                    <div className="col-span-5 flex items-start space-x-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={
                            item.menu_item_details?.image ||
                            "/api/placeholder/300/200"
                          }
                          alt={item.menu_item_details?.name}
                          className="w-24 rounded-xl object-cover shadow-sm"
                          style={{
                            height:
                              item.extras?.length > 6
                                ? "170px"
                                : item.extras?.length > 3
                                ? "140px"
                                : item.menu_item_details?.ingredients?.length >
                                  6
                                ? "170px"
                                : item.menu_item_details?.ingredients?.length >
                                  3
                                ? "140px"
                                : "110px",
                            transition: "height 0.3s ease-in-out",
                          }}
                        />
                      </div>

                      <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-800 text-lg mb-1">
                          {item.menu_item_details?.name}
                        </h3>

                        {/* Show extra toppings if they exist, otherwise show ingredients */}
                        {item.extras?.length > 0 ? (
                          <div className="mb-2">
                            <span className="font-semibold text-gray-700 text-sm">
                              Extra Toppings:
                            </span>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                              {item.extras.map((topping, index) => (
                                <div
                                  key={index}
                                  className="flex items-center text-sm text-gray-600"
                                >
                                  <span className="mr-2">•</span>
                                  <span>{topping}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : item.menu_item_details?.ingredients?.length > 0 ? (
                          <div className="mb-2">
                            <span className="font-semibold text-gray-700 text-sm">
                              Ingredients:
                            </span>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                              {item.menu_item_details.ingredients.map(
                                (ingredient, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center text-sm text-gray-600"
                                  >
                                    <span className="mr-2">•</span>
                                    <span>{ingredient}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ) : null}

                        {/* Optional notes and spice */}
                        <ul className="text-sm text-gray-500 space-y-1">
                          {item.spice_level && (
                            <li>• Spice: {item.spice_level}</li>
                          )}
                          {item.special_notes && (
                            <li>• "{item.special_notes}"</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-span-3 flex justify-center items-start space-x-2 pt-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="col-span-3 text-center font-semibold text-gray-700 pt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                      <div className="text-sm text-gray-400">
                        (${parseFloat(item.price).toFixed(2)} each)
                      </div>
                    </div>

                    {/* Delete Action */}
                    <div className="col-span-1 flex justify-center items-start pt-1">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-semibold">Total:</span>
                  <span className="text-3xl font-bold text-primary">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-secondary text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 text-lg"
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
