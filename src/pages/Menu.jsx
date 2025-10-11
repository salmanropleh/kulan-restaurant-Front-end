import React, { useState, useEffect } from "react";
import { menuCategories, menuItems } from "../data/menuData";
import { Star, Clock, Heart } from "lucide-react";
import Toast from "../components/ui/Toast";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("breakfast");
  const [favorites, setFavorites] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("kulanFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (itemId) => {
    let newFavorites;
    const isCurrentlyFavorite = favorites.includes(itemId);

    if (isCurrentlyFavorite) {
      // Remove from favorites
      newFavorites = favorites.filter((id) => id !== itemId);
      setSuccessMessage("Item removed from favorites");
    } else {
      // Add to favorites
      newFavorites = [...favorites, itemId];
      setSuccessMessage("Item added to favorites!");
    }

    setFavorites(newFavorites);
    localStorage.setItem("kulanFavorites", JSON.stringify(newFavorites));
    setShowSuccess(true);
  };

  const isFavorite = (itemId) => {
    return favorites.includes(itemId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Success Toast */}
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
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2">
          {menuCategories.map((category) => (
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

        {/* Category Description */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-semibold text-gray-900 mb-2">
            {menuCategories.find((cat) => cat.id === activeCategory)?.name}
          </h2>
          <p className="text-gray-600">
            {
              menuCategories.find((cat) => cat.id === activeCategory)
                ?.description
            }
          </p>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems[activeCategory]?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Image with Favorite Button */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-200 transform hover:scale-110"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavorite(item.id)
                        ? "text-red-500 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                {item.popular && (
                  <div className="absolute top-3 left-3 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
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
                    ${item.price}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
