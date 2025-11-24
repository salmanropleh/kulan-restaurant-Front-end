import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { favoritesApi } from "../../../services/favoritesApi";
import Toast from "../../../components/ui/Toast/Toast";

const FavoritesSection = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Load favorites from API
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoritesData = await favoritesApi.getFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setSuccessMessage("Failed to load favorites");
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (itemId) => {
    try {
      await favoritesApi.toggleFavorite(itemId);
      setFavorites(favorites.filter((item) => item.id !== itemId));
      setSuccessMessage("Item removed from favorites");
      setShowSuccess(true);
    } catch (error) {
      console.error("Error removing favorite:", error);
      setSuccessMessage("Failed to remove favorite");
      setShowSuccess(true);
    }
  };

  const addToCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem("kulanCart") || "[]");
    const existingItem = existingCart.find(
      (cartItem) => cartItem.id === item.id
    );

    let newCart;
    if (existingItem) {
      newCart = existingCart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      newCart = [
        ...existingCart,
        {
          ...item,
          quantity: 1,
          price: parseFloat(item.price),
        },
      ];
    }

    localStorage.setItem("kulanCart", JSON.stringify(newCart));
    setSuccessMessage("Item added to cart!");
    setShowSuccess(true);
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Favorites</h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Toast
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Favorites</h2>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start exploring our menu and add your favorite dishes!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <button
                  onClick={() => removeFavorite(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Heart className="h-5 w-5 fill-current" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{item.type}</p>
              <p className="text-xs text-gray-500 mb-4">
                Last ordered: {item.lastOrdered}
              </p>
              <p className="text-lg font-bold text-orange-600 mb-4">
                ${parseFloat(item.price).toFixed(2)}
              </p>
              <button
                onClick={() => addToCart(item)}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;
