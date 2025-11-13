import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Clock, Users, Star, ArrowLeft } from "lucide-react";
import { menuApi } from "../../services/menuApi";
import { orderApi } from "../../services/orderApi";
import Toast from "../../components/ui/Toast/Toast";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    spiceLevel: "Medium",
    toppings: [],
    instructions: "",
  });
  const [favorites, setFavorites] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isInCart, setIsInCart] = useState(false);
  const [cartItemQuantity, setCartItemQuantity] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
    loadFavorites();
  }, [id]);

  useEffect(() => {
    if (item) {
      checkIfItemInCart();
    }
  }, [item, selectedOptions]);

  const loadItem = async () => {
    setLoading(true);
    try {
      const data = await menuApi.getItemById(id);
      setItem(data);
    } catch (error) {
      console.error("Error loading item:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem("kulanFavorites");
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  };

  const checkIfItemInCart = async () => {
    if (!item) return;

    try {
      const cartData = await orderApi.getCart();

      const existingItem = cartData.items.find((cartItem) => {
        if (parseInt(cartItem.menu_item) !== parseInt(id)) return false;

        const sameSpice = cartItem.spice_level === selectedOptions.spiceLevel;

        const cartExtras = Array.isArray(cartItem.extras)
          ? cartItem.extras
          : [];
        const currentExtras = Array.isArray(selectedOptions.toppings)
          ? selectedOptions.toppings.map((t) => t.name)
          : [];

        const sameExtras =
          JSON.stringify(cartExtras.sort()) ===
          JSON.stringify(currentExtras.sort());

        const cartNotes = (cartItem.special_notes || "").trim();
        const currentNotes = (selectedOptions.instructions || "").trim();
        const sameNotes = cartNotes === currentNotes;

        return sameSpice && sameExtras && sameNotes;
      });

      if (existingItem) {
        setIsInCart(true);
        setCartItemQuantity(existingItem.quantity);
        setQuantity(existingItem.quantity);
      } else {
        setIsInCart(false);
        setCartItemQuantity(0);
        setQuantity(1);
      }
    } catch (error) {
      console.error("Error checking cart:", error);
      // No localStorage fallback - just reset state
      setIsInCart(false);
      setCartItemQuantity(0);
      setQuantity(1);
    }
  };

  const toggleFavorite = (itemId) => {
    let newFavorites;
    const isFav = favorites.includes(itemId);

    if (isFav) {
      newFavorites = favorites.filter((id) => id !== itemId);
      setToastMessage("Item removed from favorites");
    } else {
      newFavorites = [...favorites, itemId];
      setToastMessage("Item added to favorites!");
    }

    setFavorites(newFavorites);
    localStorage.setItem("kulanFavorites", JSON.stringify(newFavorites));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const isFavorite = (itemId) => favorites.includes(itemId);

  const handleAddToOrder = async (item, quantity, options) => {
    try {
      const itemData = {
        menu_item_id: item.id,
        quantity: quantity,
        extras: options.toppings.map((topping) => topping.name),
        spice_level: options.spiceLevel,
        special_notes: options.instructions,
      };

      console.log("Adding to cart:", itemData);

      const result = await orderApi.addToCart(itemData);

      if (result.success) {
        setIsInCart(true);
        setCartItemQuantity(quantity);
        setToastMessage(`🎉 ${quantity} x ${item.name} added to cart!`);
        setShowToast(true);

        setTimeout(() => {
          checkIfItemInCart();
        }, 1000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setToastMessage("Error adding item to cart. Please try again.");
      setShowToast(true);
    }
  };

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart();
      return;
    }

    setQuantity(newQuantity);

    if (isInCart) {
      await updateCartQuantity(newQuantity);
    }
  };

  const updateCartQuantity = async (newQuantity) => {
    try {
      const cartData = await orderApi.getCart();
      const cartItem = cartData.items.find((item) => {
        if (parseInt(item.menu_item) !== parseInt(id)) return false;

        const sameSpice = item.spice_level === selectedOptions.spiceLevel;
        const cartExtras = Array.isArray(item.extras) ? item.extras : [];
        const currentExtras = Array.isArray(selectedOptions.toppings)
          ? selectedOptions.toppings.map((t) => t.name)
          : [];
        const sameExtras =
          JSON.stringify(cartExtras.sort()) ===
          JSON.stringify(currentExtras.sort());
        const cartNotes = (item.special_notes || "").trim();
        const currentNotes = (selectedOptions.instructions || "").trim();
        const sameNotes = cartNotes === currentNotes;

        return sameSpice && sameExtras && sameNotes;
      });

      if (cartItem) {
        const result = await orderApi.updateCartItem(cartItem.id, newQuantity);
        if (result.success) {
          setCartItemQuantity(newQuantity);
          setToastMessage(`🛒 Quantity updated to ${newQuantity}`);
          setShowToast(true);
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      setToastMessage("Error updating quantity. Please try again.");
      setShowToast(true);
    }
  };

  const removeFromCart = async () => {
    try {
      const cartData = await orderApi.getCart();
      const cartItem = cartData.items.find((item) => {
        if (parseInt(item.menu_item) !== parseInt(id)) return false;

        const sameSpice = item.spice_level === selectedOptions.spiceLevel;
        const cartExtras = Array.isArray(item.extras) ? item.extras : [];
        const currentExtras = Array.isArray(selectedOptions.toppings)
          ? selectedOptions.toppings.map((t) => t.name)
          : [];
        const sameExtras =
          JSON.stringify(cartExtras.sort()) ===
          JSON.stringify(currentExtras.sort());
        const cartNotes = (item.special_notes || "").trim();
        const currentNotes = (selectedOptions.instructions || "").trim();
        const sameNotes = cartNotes === currentNotes;

        return sameSpice && sameExtras && sameNotes;
      });

      if (cartItem) {
        const result = await orderApi.removeCartItem(cartItem.id);
        if (result.success) {
          setIsInCart(false);
          setCartItemQuantity(0);
          setQuantity(1);
          setToastMessage("🗑️ Item removed from cart");
          setShowToast(true);
        }
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      setToastMessage("Error removing item from cart. Please try again.");
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Item not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const toppingPrice = selectedOptions.toppings.reduce(
    (total, topping) => total + parseFloat(topping.price),
    0
  );
  const totalPrice = (parseFloat(item.price) + toppingPrice) * quantity;

  return (
    <div className="min-h-screen bg-gray-50 py-3 sm:py-6">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />

      <div className="container-custom max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center bg-primary text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-accent transition-colors duration-200 shadow w-full sm:w-auto text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Menu
          </button>

          <button
            onClick={() => toggleFavorite(item.id)}
            className="flex items-center justify-center bg-white px-3 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200 border border-gray-300 shadow-sm w-full sm:w-auto text-sm"
          >
            <Heart
              className={`h-4 w-4 mr-1 ${
                isFavorite(item.id)
                  ? "text-red-500 fill-current"
                  : "text-gray-400"
              }`}
            />
            {isFavorite(item.id) ? "Favorited" : "Add to Favorites"}
          </button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 xl:gap-8">
          {/* Left: Image & Customization Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-56 sm:h-72 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-md">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />

              {item.popular && (
                <span className="absolute top-2 left-2 bg-secondary text-white px-2 py-1 rounded-full font-semibold text-xs shadow">
                  Popular
                </span>
              )}
            </div>

            {/* Customization Options */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                Customize Your Order
              </h3>

              <div className="space-y-3 sm:space-y-4">
                {/* Spice Level - Only show if customizable */}
                {item.customizable_spice && (
                  <div className="space-y-1 sm:space-y-2">
                    <label className="font-semibold text-gray-900 text-sm sm:text-base">
                      Spice Level
                    </label>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {["Mild", "Medium", "Hot", "Extra Hot"].map((level) => (
                        <label
                          key={level}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="spiceLevel"
                            value={level}
                            checked={selectedOptions.spiceLevel === level}
                            onChange={(e) =>
                              setSelectedOptions({
                                ...selectedOptions,
                                spiceLevel: e.target.value,
                              })
                            }
                            className="mr-1 sm:mr-2 w-3 h-3 text-primary focus:ring-primary"
                          />
                          <span className="text-xs sm:text-sm text-gray-700 font-medium">
                            {level}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extra Toppings */}
                {item.extra_toppings && item.extra_toppings.length > 0 && (
                  <div className="space-y-1 sm:space-y-2">
                    <label className="font-semibold text-gray-900 text-sm sm:text-base">
                      Extra Toppings
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                      {item.extra_toppings.map((topping) => (
                        <label
                          key={topping.name}
                          className="flex items-center cursor-pointer p-1 sm:p-2 rounded border border-gray-200 hover:border-primary transition-colors text-xs sm:text-sm"
                        >
                          <input
                            type="checkbox"
                            className="mr-1 sm:mr-2 w-3 h-3 text-primary focus:ring-primary"
                            onChange={(e) => {
                              const toppings = selectedOptions.toppings;
                              if (e.target.checked) {
                                setSelectedOptions({
                                  ...selectedOptions,
                                  toppings: [...toppings, topping],
                                });
                              } else {
                                setSelectedOptions({
                                  ...selectedOptions,
                                  toppings: toppings.filter(
                                    (t) => t.name !== topping.name
                                  ),
                                });
                              }
                            }}
                          />
                          <span className="text-gray-700 font-medium flex-1">
                            {topping.name}
                          </span>
                          <span className="text-primary font-semibold">
                            +${parseFloat(topping.price).toFixed(2)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="font-semibold text-gray-900 text-sm sm:text-base">
                    Special Instructions
                  </label>
                  <textarea
                    placeholder="Any special requests or dietary requirements..."
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent resize-none text-xs sm:text-sm"
                    rows="2"
                    value={selectedOptions.instructions}
                    onChange={(e) =>
                      setSelectedOptions({
                        ...selectedOptions,
                        instructions: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details Section */}
          <div className="space-y-4">
            {/* Title & Price */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {item.name}
                </h1>
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary bg-primary/10 px-2 sm:px-3 py-1 rounded-lg inline-block sm:inline">
                  ${parseFloat(item.price).toFixed(2)}
                </span>
              </div>

              {/* Description */}
              <div className="border-t pt-3">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed text-xs sm:text-sm lg:text-base">
                  {item.detailed_description || item.description}
                </p>
              </div>
            </div>

            {/* Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                  Ingredients
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                  {item.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-1 sm:mr-2 flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm text-gray-700 font-medium">
                        {ingredient}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutritional Information */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                Nutritional Information
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { label: "Calories", value: item.calories || "450" },
                  { label: "Protein", value: item.protein || "25g" },
                  { label: "Carbs", value: item.carbs || "45g" },
                  { label: "Fat", value: item.fat || "18g" },
                ].map((info, i) => (
                  <div
                    key={i}
                    className="text-center p-2 sm:p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <p className="text-base sm:text-lg font-bold text-primary mb-0.5">
                      {info.value}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      {info.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                Quick Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-yellow-50 p-1.5 sm:p-2 rounded-lg">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Rating</p>
                    <p className="text-sm sm:text-base font-bold text-gray-900">
                      {item.rating || "4.5"}/5
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-blue-50 p-1.5 sm:p-2 rounded-lg">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Prep Time
                    </p>
                    <p className="text-sm sm:text-base font-bold text-gray-900">
                      {item.prep_time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-green-50 p-1.5 sm:p-2 rounded-lg">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Serves</p>
                    <p className="text-sm sm:text-base font-bold text-gray-900">
                      {item.serves}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Section */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md sticky bottom-2 border border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <span className="text-sm sm:text-base font-semibold text-gray-900 whitespace-nowrap">
                    Quantity:
                  </span>
                  <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-50 rounded-lg p-0.5">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-xs sm:text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm sm:text-lg font-bold w-4 sm:w-6 text-center text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors font-bold text-xs sm:text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <p className="text-xs text-gray-600 mb-0.5">Total Price</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    ${totalPrice.toFixed(2)}
                  </p>
                  {toppingPrice > 0 && (
                    <p className="text-xs text-gray-500">
                      Includes ${toppingPrice.toFixed(2)} in toppings
                    </p>
                  )}
                </div>
              </div>

              {!isInCart ? (
                <button
                  onClick={() =>
                    handleAddToOrder(item, quantity, selectedOptions)
                  }
                  className="w-full bg-primary text-white py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-accent transition-colors duration-200 shadow hover:shadow-md"
                >
                  Add to Order - ${totalPrice.toFixed(2)}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-green-600 font-semibold text-sm">
                    ✓ Added to cart ({cartItemQuantity}{" "}
                    {cartItemQuantity === 1 ? "item" : "items"})
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
