import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Heart } from "lucide-react";
import { menuApi, fallbackCategories } from "../../services/menuApi";
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

  // Load categories and initial items
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      loadCategoryItems(activeCategory);
    }
  }, [activeCategory]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("kulanFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("kulanFavorites", JSON.stringify(favorites));
  }, [favorites]);

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
      const data = await menuApi.getItemsByCategory(categoryId);
      setItems(data);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
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
        category: activeCategory,
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

  const getActiveCategory = () => {
    return (
      categories.find((cat) => cat.id === activeCategory) ||
      fallbackCategories.find((cat) => cat.id === activeCategory)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <Toast
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      <div className="container-custom section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Our Menu
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the rich flavors of Somali and Kenyan cuisine
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center overflow-x-auto pb-4 mb-8">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-6 py-3 rounded-full font-semibold transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Description */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-semibold text-gray-900 mb-2">
            {getActiveCategory()?.name}
          </h2>
          <p className="text-gray-600">{getActiveCategory()?.description}</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading menu items...</p>
          </div>
        )}

        {/* Menu Items Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-primary"
              >
                {/* Image with Favorite Button */}
                <div className="relative overflow-hidden h-64">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-200 transform hover:scale-110"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors duration-200 ${
                        isFavorite(item.id)
                          ? "text-red-500 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                  {item.popular && (
                    <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Popular
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-display font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <span className="text-2xl font-bold text-primary">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{item.prep_time}</span>
                    </div>
                    <span>Serves: {item.serves}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.spice_level_display && (
                      <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold">
                        {item.spice_level_display}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigateToDetails(item.id)}
                      className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors duration-200"
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
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">
              There are no menu items available in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
