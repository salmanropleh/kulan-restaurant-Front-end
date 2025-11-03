import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, ShoppingCart } from "lucide-react";
import { menuItems } from "../../data/menuData";
import Toast from "../../components/ui/Toast/Toast";

// Define specialties here to match the KulanSpecials component
const specialties = [
  {
    id: "special-1",
    name: "KULAN Grand Platter",
    description:
      "A feast for 4: Bariis Iskukaris, Hilib Ari, Nyama Choma, Sambusa, Kachumbari, and traditional sauces",
    price: 75,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3",
    prepTime: "45-60 min",
    serves: "4 People",
    tags: ["Family Style", "Best Seller", "Traditional"],
    popular: true,
    category: "specials",
  },
  {
    id: "special-2",
    name: "Coastal Fusion Seafood Feast",
    description:
      "Samaki Wa Kupaka, grilled prawns, calamari, and coconut rice with Swahili spices",
    price: 42,
    image:
      "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?ixlib=rb-4.0.3",
    prepTime: "30-40 min",
    serves: "2 People",
    tags: ["Seafood", "Fusion", "Coastal"],
    popular: true,
    category: "specials",
  },
  {
    id: "special-3",
    name: "Sultan's Camel Feast",
    description:
      "Tender camel meat slow-cooked for 8 hours with traditional Somali herbs and spices",
    price: 55,
    image:
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3",
    prepTime: "8+ hours",
    serves: "3-4 People",
    tags: ["Exotic", "Premium", "Traditional"],
    popular: true,
    category: "specials",
  },
  {
    id: "special-4",
    name: "Mandhi Experience",
    description:
      "Yemeni-style lamb marinated for 24 hours, served with fragrant rice and special sauces",
    price: 38,
    image:
      "https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3",
    prepTime: "24+ hours",
    serves: "2-3 People",
    tags: ["Marinated", "Specialty", "Aromatic"],
    popular: true,
    category: "specials",
  },
  {
    id: "special-5",
    name: "Vegetarian Delight Platter",
    description:
      "Sukuma Wiki, Mukimo, Vegetarian Pilau, Bhajia, and fresh salads",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3",
    prepTime: "25-35 min",
    serves: "2-3 People",
    tags: ["Vegetarian", "Healthy", "Traditional"],
    popular: true,
    category: "specials",
  },
  {
    id: "special-6",
    name: "Sweet Endings Platter",
    description: "Halwa, Kashata, Mahalabiya, and Mandazi with Somali Shaah",
    price: 22,
    image:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3",
    prepTime: "15-20 min",
    serves: "2-4 People",
    tags: ["Dessert", "Sweet", "Traditional"],
    popular: true,
    category: "specials",
  },
];

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Load favorites from localStorage on component mount - UPDATED FOR SPECIALS
  useEffect(() => {
    const savedFavorites = localStorage.getItem("kulanFavorites");
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites);

      // Combine regular menu items and specials
      const allMenuItems = Object.values(menuItems).flat();
      const allItems = [...allMenuItems, ...specialties];

      const favoriteItems = allItems.filter((item) =>
        favoriteIds.includes(item.id)
      );
      setFavorites(favoriteItems);
    }
  }, []);

  const toggleFavorite = (itemId) => {
    const newFavorites = favorites.filter((item) => item.id !== itemId);
    setFavorites(newFavorites);

    // Update localStorage
    const favoriteIds = newFavorites.map((item) => item.id);
    localStorage.setItem("kulanFavorites", JSON.stringify(favoriteIds));

    setSuccessMessage("Item removed from favorites");
    setShowSuccess(true);
  };

  const addToCartFromFavorites = (item) => {
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem("kulanCart") || "[]");

    // Check if item already in cart
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
      newCart = [...existingCart, { ...item, quantity: 1 }];
    }

    // Save to localStorage
    localStorage.setItem("kulanCart", JSON.stringify(newCart));

    setSuccessMessage("Item added to cart from favorites!");
    setShowSuccess(true);
  };

  const orderAllFavorites = () => {
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem("kulanCart") || "[]");

    let newCart = [...existingCart];

    // Add each favorite item to cart
    favorites.forEach((favoriteItem) => {
      // Check if item already in cart
      const existingItemIndex = newCart.findIndex(
        (cartItem) => cartItem.id === favoriteItem.id
      );

      if (existingItemIndex > -1) {
        // Item exists, increase quantity
        newCart[existingItemIndex].quantity += 1;
      } else {
        // Item doesn't exist, add new item
        newCart.push({ ...favoriteItem, quantity: 1 });
      }
    });

    // Save updated cart to localStorage
    localStorage.setItem("kulanCart", JSON.stringify(newCart));

    // Show success message
    setSuccessMessage(`Added ${favorites.length} favorite items to cart!`);
    setShowSuccess(true);

    // Navigate to ORDER ONLINE page (not cart) after a short delay
    setTimeout(() => {
      navigate("/order-online");
    }, 1500);
  };

  // Empty State - with original gradient and button styling
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Restored gradient */}
        <section className="bg-gradient-to-r from-primary to-accent text-white py-20">
          <div className="container-custom section-padding text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              My Favorites
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Your favorite KULAN dishes will appear here
            </p>
          </div>
        </section>

        {/* Empty State - Restored original styling */}
        <section className="py-20">
          <div className="container-custom section-padding">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-lg p-12">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                  No favorites yet
                </h2>
                <p className="text-gray-600 mb-8">
                  Start exploring our menu and click the heart icon to save your
                  favorite dishes for easy access later.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/menu"
                    className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-accent transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Browse Menu</span>
                  </Link>
                  <Link
                    to="/order-online"
                    className="bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
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
      {/* Success Toast */}
      <Toast
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-20">
        <div className="container-custom section-padding text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            My Favorites
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Your beloved KULAN dishes, saved for easy ordering
          </p>
        </div>
      </section>

      {/* Favorites Content */}
      <section className="py-20">
        <div className="container-custom section-padding">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-display font-bold text-gray-900">
              {favorites.length} Favorite{" "}
              {favorites.length === 1 ? "Item" : "Items"}
            </h2>
            <Link
              to="/menu"
              className="bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Menu</span>
            </Link>
          </div>

          {/* Favorites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
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
                      className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-200 transform hover:scale-110"
                    >
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    </button>
                    {item.popular && (
                      <div className="absolute top-2 left-2 bg-secondary text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Popular
                      </div>
                    )}
                    {/* Special Badge for specials - FIXED */}
                    {String(item.id).startsWith("special-") && (
                      <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Special
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCartFromFavorites(item)}
                        className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-accent transition-all duration-200 transform hover:scale-105 text-sm"
                      >
                        Add to Cart
                      </button>
                      <Link
                        to="/order-online"
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 text-sm flex items-center justify-center"
                      >
                        Order
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-display font-bold text-gray-900 mb-4 text-center">
              Ready to Order Your Favorites?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={orderAllFavorites}
                className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-accent transition-colors duration-200 text-center"
              >
                Order All Favorites Online
              </button>
              <Link
                to="/reservations"
                className="bg-secondary text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 text-center"
              >
                Reserve a Table
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Favorites;
