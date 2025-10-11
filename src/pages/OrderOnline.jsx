import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Search, Heart, Loader } from "lucide-react";
import { menuItems, menuCategories } from "../data/menuData";
import Toast from "../components/ui/Toast";

const OrderOnline = () => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem("kulanCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("kulanFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("kulanFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("kulanCart", JSON.stringify(cart));
  }, [cart]);

  const toggleFavorite = (itemId) => {
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const addToCart = async (item) => {
    setIsAddingToCart(item.id);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      let newCart;

      if (existingItem) {
        newCart = prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        newCart = [...prevCart, { ...item, quantity: 1 }];
      }

      return newCart;
    });

    setIsAddingToCart(null);
    setSuccessMessage(`${item.name} added to cart successfully!`);
    setShowSuccess(true);
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
    setSuccessMessage("Cart cleared successfully!");
    setShowSuccess(true);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      setSuccessMessage("Your cart is empty! Add some items first.");
      setShowSuccess(true);
      return;
    }

    // Navigate to checkout page
    navigate("/checkout");
  };

  const allItems = Object.values(menuItems).flat();
  const filteredItems =
    activeCategory === "all" ? allItems : menuItems[activeCategory] || [];

  const searchedItems = searchTerm
    ? allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      <Toast
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary to-orange-500 text-white py-20">
        <div className="container-custom section-padding text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Order Online
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Enjoy KULAN's authentic flavors delivered to your door
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Menu Section - Left */}
            <div className="lg:col-span-3 pl-3">
              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search for dishes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors hover:border-primary/50"
                  />
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex overflow-x-auto pb-4 mb-6 gap-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`flex-shrink-0 px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 ${
                    activeCategory === "all"
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-lg hover:shadow-xl"
                  }`}
                >
                  All Items
                </button>
                {menuCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex-shrink-0 px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 ${
                      activeCategory === category.id
                        ? "bg-primary text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden h-48 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    <div className="flex h-full">
                      <div className="relative w-32 h-full flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors duration-200 transform hover:scale-110"
                        >
                          <Heart
                            className={`h-4 w-4 transition-colors duration-200 ${
                              favorites.includes(item.id)
                                ? "text-red-500 fill-current"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                        {item.popular && (
                          <div className="absolute top-2 left-2 bg-secondary text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Popular
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                            <span className="text-xl font-bold text-primary">
                              ${item.price}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          disabled={isAddingToCart === item.id}
                          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent disabled:bg-gray-400 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 disabled:scale-100"
                        >
                          {isAddingToCart === item.id ? (
                            <>
                              <Loader className="h-4 w-4 animate-spin" />
                              <span>Adding...</span>
                            </>
                          ) : (
                            <span>Add to Cart</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Section - Right */}
            <div className="lg:col-span-1 pr-3">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sticky top-8 h-fit min-h-[500px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-7 w-7 text-primary" />
                    <h2 className="text-2xl font-display font-bold">
                      Your Order
                    </h2>
                  </div>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Cart Items Count */}
                {cart.length > 0 && (
                  <div className="mb-4 text-sm text-gray-600">
                    {getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""} in
                    cart
                  </div>
                )}

                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-lg mb-2">
                      Your cart is empty
                    </p>
                    <p className="text-gray-400 text-sm">
                      Add some delicious items to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b pb-4 hover:bg-gray-50 transition-colors duration-200 p-2 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-base mb-1">
                            {item.name}
                          </h4>
                          <p className="text-primary font-bold text-lg">
                            ${item.price}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-200 transform hover:scale-110"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center text-lg font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-200 transform hover:scale-110"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="border-t pt-5">
                      <div className="flex justify-between items-center mb-5">
                        <span className="font-semibold text-lg">Total:</span>
                        <span className="text-2xl font-bold text-primary">
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderOnline;
