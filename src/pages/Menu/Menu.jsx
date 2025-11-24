import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Heart } from "lucide-react";
import { menuApi, fallbackCategories } from "../../services/menuApi";
import { favoritesApi } from "../../services/favoritesApi";
import { menuItems } from "../../data/menuData";
import Toast from "../../components/ui/Toast/Toast";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("breakfast");
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  // Load categories and initial items
  useEffect(() => {
    loadCategories();
    loadFavorites();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      loadCategoryItems(activeCategory);
    }
  }, [activeCategory]);

  const loadCategories = async () => {
    try {
      const data = await menuApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories(fallbackCategories);
    }
  };

  const loadCategoryItems = async (categoryId) => {
    setLoading(true);
    try {
      if (categoryId === "specials") {
        const fallbackSpecials = menuItems.specials.slice(0, 3);
        setItems(fallbackSpecials);
      } else {
        const data = await menuApi.getItemsByCategory(categoryId);
        setItems(data);
      }
    } catch (error) {
      console.error("Error loading items:", error);
      if (categoryId === "specials") {
        const fallbackSpecials = menuItems.specials.slice(0, 3);
        setItems(fallbackSpecials);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favoritesData = await favoritesApi.getFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (itemId) => {
    try {
      const result = await favoritesApi.toggleFavorite(itemId);

      if (result.status === "added") {
        setSuccessMessage("Item added to favorites!");
        const item = items.find((i) => i.id === itemId);
        if (item) {
          setFavorites((prev) => [...prev, { ...item, id: itemId }]);
        }
      } else {
        setSuccessMessage("Item removed from favorites");
        setFavorites((prev) => prev.filter((fav) => fav.id !== itemId));
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setSuccessMessage("Failed to update favorites");
      setShowSuccess(true);
    }
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
        category: activeCategory,
      });
    }

    localStorage.setItem("kulanCart", JSON.stringify(currentCart));
    setSuccessMessage(`🎉 ${item.name} added to cart!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isFavorite = (itemId) => {
    return favorites.some((fav) => fav.id === itemId);
  };

  const navigateToDetails = (itemId) => {
    navigate(`/food/${itemId}`);
  };

  const getActiveCategory = () => {
    return (
      categories.find((cat) => cat.id === activeCategory) ||
      fallbackCategories.find((cat) => cat.id === activeCategory)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 md:py-20">
      <Toast
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      <div className="container-custom px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-3 sm:mb-4">
            Our Menu
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the rich flavors of Somali and Kenyan cuisine
          </p>
        </div>

        {/* Scrollable Categories */}
        <div className="mb-6 sm:mb-8">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide space-x-2 pb-3 sm:pb-4 md:justify-center"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold transition-colors whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Description */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-gray-900 mb-2">
            {getActiveCategory()?.name}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {getActiveCategory()?.description}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-primary"></div>
            <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">
              Loading menu items...
            </p>
          </div>
        )}

        {/* Menu Items Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden border border-gray-100 hover:border-primary"
              >
                {/* Image with Favorite Button */}
                <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300"
                  />

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

                  {item.popular && (
                    <div className="absolute top-3 left-3 bg-secondary text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Popular
                    </div>
                  )}
                </div>

                {/* Content */}
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
                      <span>{item.prepTime || item.prep_time}</span>
                    </div>
                    <span>Serves: {item.serves}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                    {item.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary text-white rounded-full text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.spice_level_display && (
                      <span className="px-2 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold">
                        {item.spice_level_display}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
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
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">
              🍽️
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              There are no menu items available in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
