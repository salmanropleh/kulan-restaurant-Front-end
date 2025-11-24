// Front-End/src/pages/Admin/Favorites.jsx
import React, { useState, useEffect } from "react";
import {
  Heart,
  User,
  Utensils,
  Trash2,
  Search,
  Calendar,
  AlertCircle,
  RefreshCw,
  X,
  MoreVertical,
} from "lucide-react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);

  // Function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // If it's already a full URL, return as is
    if (imageUrl.startsWith("http")) return imageUrl;
    // Otherwise, prepend the base URL
    return `http://localhost:8000${imageUrl}`;
  };

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Use the admin endpoint
      const response = await fetch(
        "http://localhost:8000/api/favorites/favorites/admin_list/",
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch favorites: ${response.status}`);
      }

      const favoritesData = await response.json();
      console.log("Favorites API Response:", favoritesData); // Debug log

      // Transform the data to match our table structure
      const transformedFavorites = Array.isArray(favoritesData)
        ? favoritesData.map((favorite) => ({
            id: favorite.id,
            user:
              favorite.user?.username || favorite.user?.email || "Unknown User",
            userEmail: favorite.user?.email || "No email",
            userAvatar:
              favorite.user?.avatar || favorite.user?.avatar_url || null,
            menuItem: favorite.menu_item?.name || "Unknown Item",
            category: favorite.menu_item?.category?.name || "Uncategorized",
            addedDate: favorite.created_at
              ? new Date(favorite.created_at).toLocaleDateString()
              : "Unknown date",
            menuItemId: favorite.menu_item?.id,
            userId: favorite.user?.id,
          }))
        : [];

      console.log("Transformed Favorites:", transformedFavorites); // Debug log
      setFavorites(transformedFavorites);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Failed to load favorites. Please try again.");
      setFavorites([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteFavorite = async (favoriteId) => {
    if (!window.confirm("Are you sure you want to remove this favorite?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(
        `http://localhost:8000/api/favorites/favorites/${favoriteId}/`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete favorite: ${response.status}`);
      }

      // Remove from local state
      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
    } catch (err) {
      console.error("Error deleting favorite:", err);
      setError("Failed to delete favorite. Please try again.");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const filteredFavorites = favorites.filter(
    (favorite) =>
      favorite.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      favorite.menuItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      favorite.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-gray-600 text-sm">
            Loading favorites...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="mt-2 text-red-600 hover:text-red-800 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Favorites Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Total favorites: {favorites.length}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with Search and Refresh */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full sm:text-sm">
                {filteredFavorites.length} favorite
                {filteredFavorites.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded pl-10 pr-4 py-2 text-sm w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Favorites Content */}
        <div className="p-4">
          {filteredFavorites.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Menu Item</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Added Date</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredFavorites.map((favorite) => {
                      const userAvatarUrl = getImageUrl(favorite.userAvatar);

                      return (
                        <tr key={favorite.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
                                {userAvatarUrl ? (
                                  <img
                                    src={userAvatarUrl}
                                    alt={favorite.user}
                                    className="h-10 w-10 object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display =
                                        "flex";
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center ${
                                    userAvatarUrl ? "hidden" : "flex"
                                  }`}
                                >
                                  <User className="h-5 w-5 text-white" />
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {favorite.user}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {favorite.userEmail}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <Utensils className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                              <div className="text-sm font-medium text-gray-900">
                                {favorite.menuItem}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                              {favorite.category}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
                              {favorite.addedDate}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => deleteFavorite(favorite.id)}
                              className="text-red-600 hover:text-red-900 flex items-center justify-center transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {filteredFavorites.map((favorite) => {
                  const userAvatarUrl = getImageUrl(favorite.userAvatar);

                  return (
                    <div
                      key={favorite.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
                            {userAvatarUrl ? (
                              <img
                                src={userAvatarUrl}
                                alt={favorite.user}
                                className="h-12 w-12 object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={`h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center ${
                                userAvatarUrl ? "hidden" : "flex"
                              }`}
                            >
                              <User className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">
                              {favorite.user}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {favorite.userEmail}
                            </div>
                          </div>
                        </div>

                        {/* Mobile Menu */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setMobileMenuOpen(
                                mobileMenuOpen === favorite.id
                                  ? null
                                  : favorite.id
                              )
                            }
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {mobileMenuOpen === favorite.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              <button
                                onClick={() => deleteFavorite(favorite.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove Favorite
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Menu Item */}
                      <div className="flex items-center mb-2">
                        <Utensils className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <div className="font-medium text-gray-900 text-sm">
                          {favorite.menuItem}
                        </div>
                      </div>

                      {/* Category and Date */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs capitalize">
                          {favorite.category}
                        </span>
                        <div className="flex items-center text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="text-xs">{favorite.addedDate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Heart className="mx-auto w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm mb-2">
                {favorites.length === 0
                  ? "No favorites found"
                  : "No favorites match your search"}
              </p>
              <p className="text-gray-400 text-xs">
                {favorites.length === 0
                  ? "Users haven't added any favorites yet"
                  : "Try adjusting your search terms"}
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mt-4 text-orange-500 hover:text-orange-600 text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
