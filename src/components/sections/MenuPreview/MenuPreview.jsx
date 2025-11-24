import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Heart } from "lucide-react";
import { menuApi } from "../../../services/menuApi";
import Toast from "../../ui/Toast/Toast";

const MenuPreview = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFeaturedItems();
    loadFavorites();
  }, []);

  useEffect(() => {
    localStorage.setItem("kulanFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const loadFeaturedItems = async () => {
    setLoading(true);
    try {
      const data = await menuApi.getFeaturedItems();
      setFeaturedItems(data);
    } catch (error) {
      console.error("Error loading featured items:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem("kulanFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const toggleFavorite = (itemId) => {
    let newFavorites;
    const isCurrentlyFavorite = favorites.includes(itemId);

    if (isCurrentlyFavorite) {
      newFavorites = favorites.filter((id) => id !== itemId);
      setSuccessMessage("Item removed from favorites");
    } else {
      newFavorites = [...favorites, itemId];
      setSuccessMessage("Item added to favorites!");
    }

    setFavorites(newFavorites);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddToOrder = (item) => {
    const currentCart = JSON.parse(localStorage.getItem("kulanCart") || "[]");
    const existingItemIndex = currentCart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        image: item.image,
        description: item.description,
        quantity: 1,
        category: "featured",
      });
    }

    localStorage.setItem("kulanCart", JSON.stringify(currentCart));
    setSuccessMessage(`🎉 ${item.name} added to cart!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isFavorite = (itemId) => {
    return favorites.includes(itemId);
  };

  const navigateToDetails = (itemId) => {
    navigate(`/food/${itemId}`);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white px-4">
      <Toast
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-3 sm:mb-4">
            KULAN Specialties
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Taste our most beloved Somali and Kenyan dishes, crafted with
            authentic recipes
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-primary"></div>
            <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">
              Loading featured items...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
              {featuredItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden border border-gray-100 hover:border-primary"
                >
                  <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300"
                    />
                    {item.popular && (
                      <div className="absolute top-3 left-3 bg-secondary text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Most Popular
                      </div>
                    )}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-3 right-3 p-1.5 sm:p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-200 transform hover:scale-110"
                    >
                      <Heart
                        className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${
                          isFavorite(item.id)
                            ? "text-red-500 fill-current"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <h3 className="text-lg sm:text-xl font-display font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <span className="text-xl sm:text-2xl font-bold text-primary">
                        ${parseFloat(item.price).toFixed(2)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{item.prep_time}</span>
                      </div>
                      <span>Serves: {item.serves}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-primary text-white rounded-full text-xs font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => navigateToDetails(item.id)}
                        className="flex-1 bg-primary text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-accent transition-colors duration-200 text-sm sm:text-base"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/menu"
                className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full hover:bg-accent transition-colors duration-200 font-semibold text-base sm:text-lg group"
              >
                <span>View Full Menu</span>
                <div className="group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MenuPreview;
