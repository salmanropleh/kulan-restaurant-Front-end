import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Heart } from "lucide-react";
import { featuredItems } from "../../data/menuData";
import Toast from "../ui/Toast";

const MenuPreview = () => {
  const [favorites, setFavorites] = useState([]);
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
    setShowSuccess(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleAddToOrder = (item) => {
    // Get current cart from localStorage or initialize empty array
    const currentCart = JSON.parse(localStorage.getItem("kulanCart") || "[]");

    // Check if item already exists in cart
    const existingItemIndex = currentCart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex > -1) {
      // If item exists, increase quantity
      currentCart[existingItemIndex].quantity += 1;
    } else {
      // If item doesn't exist, add new item
      currentCart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        description: item.description,
        quantity: 1,
        category: item.category || "featured",
      });
    }

    // Save updated cart to localStorage
    localStorage.setItem("kulanCart", JSON.stringify(currentCart));

    // Show success message
    setSuccessMessage(`🎉 ${item.name} added to cart!`);
    setShowSuccess(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const isFavorite = (itemId) => {
    return favorites.includes(itemId);
  };

  // ADD THIS FUNCTION FOR NAVIGATION
  const navigateToDetails = (itemId) => {
    navigate(`/food/${itemId}`);
  };

  return (
    <section className="py-20 bg-white">
      {/* Toast Component */}
      <Toast
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      <div className="container-custom section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            KULAN Specialties
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Taste our most beloved Somali and Kenyan dishes, crafted with
            authentic recipes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-primary"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {item.popular && (
                  <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
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
              </div>

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

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{item.prepTime || "15-25 min"}</span>
                  </div>
                  <span>Serves: {item.serves || "1-2 People"}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* REPLACE SINGLE BUTTON WITH DUAL BUTTONS */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigateToDetails(item.id)}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors duration-200"
                  >
                    View Details
                  </button>
                  {/* <button
                    onClick={() => handleAddToOrder(item)}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors duration-200"
                  >
                    Order Now
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/menu"
            className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-full hover:bg-accent transition-colors duration-200 font-semibold text-lg group"
          >
            <span>View Full Menu</span>
            <div className="group-hover:translate-x-1 transition-transform">
              →
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
