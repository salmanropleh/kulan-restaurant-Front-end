import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, ShoppingCart } from "lucide-react";
import { favoritesApi } from "../../services/favoritesApi";
import { orderApi } from "../../services/orderApi";
import Toast from "../../components/ui/Toast/Toast";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const navigate = useNavigate();

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

  const addToCartFromFavorites = async (item) => {
    try {
      setAddingToCart(true);
      await orderApi.addToCart({
        menu_item_id: item.id,
        quantity: 1,
      });
      setSuccessMessage(`${item.name} added to cart from favorites!`);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setSuccessMessage("Failed to add item to cart");
      setShowSuccess(true);
    } finally {
      setAddingToCart(false);
    }
  };

  const orderAllFavorites = async () => {
    try {
      setAddingToCart(true);
      for (const favoriteItem of favorites) {
        await orderApi.addToCart({
          menu_item_id: favoriteItem.id,
          quantity: 1,
        });
      }
      setSuccessMessage(`Added ${favorites.length} favorite items to cart!`);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/order-online");
      }, 1500);
    } catch (error) {
      console.error("Error adding favorites to cart:", error);
      setSuccessMessage("Failed to add favorites to cart");
      setShowSuccess(true);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleOrderNow = async (item) => {
    try {
      setAddingToCart(true);
      await orderApi.addToCart({
        menu_item_id: item.id,
        quantity: 1,
      });
      setSuccessMessage(`${item.name} added to cart!`);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/order-online");
      }, 1000);
    } catch (error) {
      console.error("Error ordering item:", error);
      setSuccessMessage("Failed to add item to cart");
      setShowSuccess(true);
    } finally {
      setAddingToCart(false);
    }
  };

  // Empty State
  if (!loading && favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-primary to-accent text-white py-12 sm:py-16 md:py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6">
              My Favorites
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
              Your favorite KULAN dishes will appear here
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg p-6 sm:p-8 md:p-12">
                <Heart className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-gray-300 mx-auto mb-4 sm:mb-6" />
                <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-3 sm:mb-4">
                  No favorites yet
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
                  Start exploring our menu and click the heart icon to save your
                  favorite dishes for easy access later.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link
                    to="/menu"
                    className="bg-primary text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-accent transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Browse Menu</span>
                  </Link>
                  <Link
                    to="/order-online"
                    className="bg-secondary text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Order Online</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6">
            My Favorites
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
            Your beloved KULAN dishes, saved for easy ordering
          </p>
        </div>
      </section>

      {/* Favorites Content */}
      <section className="py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-gray-900 text-center sm:text-left">
              {favorites.length} Favorite{" "}
              {favorites.length === 1 ? "Item" : "Items"}
            </h2>
            <Link
              to="/menu"
              className="bg-secondary text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Back to Menu</span>
            </Link>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-primary"></div>
              <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">
                Loading your favorites...
              </p>
            </div>
          ) : (
            <>
              {/* Favorites Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {favorites.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg overflow-hidden hover:shadow-md sm:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    <div className="flex h-40 sm:h-48">
                      <div className="relative w-28 sm:w-32 h-full flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300"
                        />
                        <button
                          onClick={() => removeFavorite(item.id)}
                          className="absolute top-2 right-2 p-1.5 sm:p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-200 transform hover:scale-110"
                          disabled={addingToCart}
                        >
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-current" />
                        </button>
                        {item.popular && (
                          <div className="absolute top-2 left-2 bg-secondary text-white px-1.5 py-1 sm:px-2 sm:py-1 rounded-full text-xs font-semibold">
                            Popular
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2 sm:mb-3">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg group-hover:text-primary transition-colors line-clamp-1">
                              {item.name}
                            </h3>
                            <span className="text-lg sm:text-xl font-bold text-primary flex-shrink-0 ml-2">
                              ${parseFloat(item.price).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex space-x-1 sm:space-x-2">
                          <button
                            onClick={() => addToCartFromFavorites(item)}
                            disabled={addingToCart}
                            className="flex-1 bg-primary text-white py-1.5 sm:py-2 rounded-lg font-semibold hover:bg-accent transition-all duration-200 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {addingToCart ? "Adding..." : "Add to Cart"}
                          </button>
                          <button
                            onClick={() => handleOrderNow(item)}
                            disabled={addingToCart}
                            className="bg-gray-200 text-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200 text-xs sm:text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                          >
                            {addingToCart ? "..." : "Order"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg p-4 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl font-display font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                  Ready to Order Your Favorites?
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={orderAllFavorites}
                    disabled={addingToCart || favorites.length === 0}
                    className="bg-primary text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-accent transition-colors duration-200 text-center disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
                  >
                    {addingToCart
                      ? "Adding to Cart..."
                      : `Order All ${favorites.length} Favorites`}
                  </button>
                  <Link
                    to="/reservations"
                    className="bg-secondary text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 text-center text-sm sm:text-base w-full sm:w-auto"
                  >
                    Reserve a Table
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Favorites;
