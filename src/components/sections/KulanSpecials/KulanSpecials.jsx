import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Award, Clock, Heart } from "lucide-react";
import { menuApi } from "../../../services/menuApi";
import Toast from "../../ui/Toast/Toast";

const KulanSpecials = () => {
  const [specials, setSpecials] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSpecials();
    loadFavorites();
  }, []);

  useEffect(() => {
    localStorage.setItem("kulanFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const loadSpecials = async () => {
    setLoading(true);
    try {
      const data = await menuApi.getItemsByCategory("specials");
      setSpecials(data);
    } catch (error) {
      console.error("Error loading specials:", error);
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

  const toggleFavorite = (specialId) => {
    let newFavorites;
    const isCurrentlyFavorite = favorites.includes(specialId);

    if (isCurrentlyFavorite) {
      newFavorites = favorites.filter((id) => id !== specialId);
      setSuccessMessage("Special removed from favorites");
    } else {
      newFavorites = [...favorites, specialId];
      setSuccessMessage("Special added to favorites!");
    }

    setFavorites(newFavorites);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddToOrder = (special) => {
    const currentCart = JSON.parse(localStorage.getItem("kulanCart") || "[]");
    const existingItemIndex = currentCart.findIndex(
      (item) => item.id === special.id
    );

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({
        id: special.id,
        name: special.name,
        price: parseFloat(special.price),
        image: special.image,
        description: special.description,
        quantity: 1,
        category: "specialties",
      });
    }

    localStorage.setItem("kulanCart", JSON.stringify(currentCart));
    setSuccessMessage(`🎉 ${special.name} added to cart!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isFavorite = (specialId) => {
    return favorites.includes(specialId);
  };

  const navigateToDetails = (itemId) => {
    navigate(`/food/${itemId}`);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
      <Toast
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      <div className="container-custom section-padding">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-full mb-4">
            <Award className="h-5 w-5" />
            <span className="font-semibold">Exclusive Creations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            KULAN Signature Specialties
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience our most celebrated dishes, crafted with generations of
            culinary wisdom
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading specialties...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {specials.map((special) => (
                <div
                  key={special.id}
                  className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-primary"
                >
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={special.image}
                      alt={special.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Chef's Special
                    </div>
                    <button
                      onClick={() => toggleFavorite(special.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-200 transform hover:scale-110"
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors duration-200 ${
                          isFavorite(special.id)
                            ? "text-red-500 fill-current"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-display font-semibold text-gray-900">
                        {special.name}
                      </h3>
                      <span className="text-2xl font-bold text-primary">
                        ${parseFloat(special.price).toFixed(2)}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {special.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{special.prep_time}</span>
                      </div>
                      <span>Serves: {special.serves}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {special.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigateToDetails(special.id)}
                        className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors duration-200"
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
                to="/reservations"
                className="inline-flex items-center space-x-2 bg-secondary text-white px-8 py-4 rounded-full hover:bg-orange-600 transition-colors duration-200 font-semibold text-lg group"
              >
                <span>Reserve Your Special Experience</span>
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

export default KulanSpecials;
