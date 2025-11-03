import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../../components/ui/Toast/Toast";

const CartPage = () => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("kulanCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("kulanCart", JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setSuccessMessage("Cart cleared successfully!");
    setShowSuccess(true);
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      setSuccessMessage("Your cart is empty!");
      setShowSuccess(true);
      return;
    }
    navigate("/checkout");
  };

  const handleBackToMenu = () => {
    console.log("Back to Menu clicked"); // Debug log
    navigate("/order-online"); // Always go to menu page
  };

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
            {/* Left: Back to Menu button */}
            <Link
              to="/menu"
              className="flex items-center bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Menu</span>
            </Link>

            {/* Center: Your Order only */}
            <h1 className="text-2xl font-bold">Your Order</h1>

            {/* Right: Item count and Clear All close together */}
            {cart.length > 0 && (
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
          {cart.length === 0 ? (
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
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${index}-${item.extras?.join("-")}-${
                      item.spice
                    }`}
                    className="py-4 grid grid-cols-12 items-start"
                  >
                    {/* Item Info */}
                    <div className="col-span-5 flex items-start space-x-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 rounded-xl object-cover shadow-sm"
                          style={{
                            height:
                              item.extras?.length > 6
                                ? "170px"
                                : item.extras?.length > 3
                                ? "140px"
                                : item.ingredients?.length > 6
                                ? "170px"
                                : item.ingredients?.length > 3
                                ? "140px"
                                : "110px",
                            transition: "height 0.3s ease-in-out",
                          }}
                        />
                      </div>

                      <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-800 text-lg mb-1">
                          {item.name}
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
                        ) : item.ingredients?.length > 0 ? (
                          <div className="mb-2">
                            <span className="font-semibold text-gray-700 text-sm">
                              Ingredients:
                            </span>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                              {item.ingredients.map((ingredient, index) => (
                                <div
                                  key={index}
                                  className="flex items-center text-sm text-gray-600"
                                >
                                  <span className="mr-2">•</span>
                                  <span>{ingredient}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {/* Optional notes and spice */}
                        <ul className="text-sm text-gray-500 space-y-1">
                          {item.spice && <li>• Spice: {item.spice}</li>}
                          {item.note && <li>• "{item.note}"</li>}
                        </ul>
                      </div>
                    </div>

                    {/* Quantity Controls - Aligned to top */}
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

                    {/* Price - Aligned to top */}
                    <div className="col-span-3 text-center font-semibold text-gray-700 pt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                      <div className="text-sm text-gray-400">
                        (${item.price.toFixed(2)} each)
                      </div>
                    </div>

                    {/* Delete Action - Aligned to top */}
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
