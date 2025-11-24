import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Eye,
  Edit,
  Trash2,
  Plus,
  Utensils,
  Star,
  Image as ImageIcon,
  Clock,
  Users,
  MoreVertical,
  DollarSign,
  Tag,
  Filter,
} from "lucide-react";
import { menuApi } from "../../services/menuApi";
import Toast from "../../components/ui/Toast/Toast";

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Load menu items and categories
  useEffect(() => {
    loadMenuItems();
    loadCategories();
  }, []);

  // Filter items
  useEffect(() => {
    let filtered = menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.category &&
          item.category.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        !categoryFilter ||
        (item.category && item.category.name === categoryFilter);
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "available" && item.is_available !== false) ||
        (statusFilter === "unavailable" && item.is_available === false);
      const matchesTag =
        !tagFilter ||
        (tagFilter === "special" && item.popular) ||
        (tagFilter === "regular" && !item.popular);

      return matchesSearch && matchesCategory && matchesStatus && matchesTag;
    });
    setFilteredItems(filtered);
  }, [searchTerm, categoryFilter, statusFilter, tagFilter, menuItems]);

  const loadMenuItems = async () => {
    setLoading(true);
    try {
      // Get all categories first, then get items for each category
      const categoriesData = await menuApi.getCategories();
      let allItems = [];

      // Fetch items for each category
      for (const category of categoriesData) {
        try {
          const items = await menuApi.getItemsByCategory(category.id);
          // Add category information to each item
          const itemsWithCategory = items.map((item) => ({
            ...item,
            category: category,
          }));
          allItems = [...allItems, ...itemsWithCategory];
        } catch (error) {
          console.error(
            `Error loading items for category ${category.name}:`,
            error
          );
        }
      }

      setMenuItems(allItems);
      setFilteredItems(allItems);
    } catch (error) {
      console.error("Error loading menu items:", error);
      setToastMessage("Error loading menu items");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await menuApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStatusFilter("");
    setTagFilter("");
    setShowFilters(false);
    setMobileMenuOpen(null);
  };

  const openImageModal = (imageUrl, itemName) => {
    setSelectedImage({ url: imageUrl, name: itemName });
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  };

  const handleDeleteItem = async (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
        setToastMessage(`"${itemName}" has been deleted`);
        setShowToast(true);
        setMobileMenuOpen(null);
      } catch (error) {
        console.error("Error deleting item:", error);
        setToastMessage("Error deleting item");
        setShowToast(true);
      }
    }
  };

  const handleToggleAvailability = async (itemId, currentStatus, itemName) => {
    try {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, is_available: !currentStatus } : item
        )
      );
      setToastMessage(
        `"${itemName}" is now ${!currentStatus ? "available" : "unavailable"}`
      );
      setShowToast(true);
      setMobileMenuOpen(null);
    } catch (error) {
      console.error("Error updating item:", error);
      setToastMessage("Error updating item");
      setShowToast(true);
    }
  };

  const getCategoryNames = () => {
    return [
      ...new Set(menuItems.map((item) => item.category?.name).filter(Boolean)),
    ];
  };

  return (
    <div className="p-4">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Menu Items
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Management section for menu items
        </p>
      </div>

      {/* Header with Add Button and Item Count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full sm:text-sm">
            {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm transition-colors">
            <Plus className="w-4 h-4" />
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline">Add New Item</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        {/* Search Bar */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          {/* Mobile Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Filters - Collapsible on mobile */}
        <div className={`${showFilters ? "block" : "hidden"} sm:block`}>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="">All Categories</option>
              {getCategoryNames().map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="">All Tags</option>
              <option value="special">Special</option>
              <option value="regular">Regular</option>
            </select>

            <button
              onClick={clearFilters}
              className="border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <p className="text-gray-500 text-sm mt-3">Loading menu items...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tag
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prep Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <button
                              onClick={() =>
                                openImageModal(item.image, item.name)
                              }
                              className="flex-shrink-0"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                              />
                            </button>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                              <Utensils className="text-gray-400 w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">
                          {item.category?.name || "Uncategorized"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">
                          ${parseFloat(item.price).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            handleToggleAvailability(
                              item.id,
                              item.is_available,
                              item.name
                            )
                          }
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border transition-colors cursor-pointer ${
                            item.is_available !== false
                              ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                              : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${
                              item.is_available !== false
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {item.is_available !== false
                            ? "Available"
                            : "Unavailable"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {item.popular ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <Star className="text-yellow-600 w-3 h-3 mr-1" />
                            Special
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {item.prep_time || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-800 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3 p-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      {item.image ? (
                        <button
                          onClick={() => openImageModal(item.image, item.name)}
                          className="flex-shrink-0"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                          />
                        </button>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <Utensils className="text-gray-400 w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base truncate">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {item.description || "No description"}
                        </p>
                      </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMobileMenuOpen(
                            mobileMenuOpen === item.id ? null : item.id
                          )
                        }
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {mobileMenuOpen === item.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Item
                          </button>
                          <button
                            onClick={() =>
                              handleToggleAvailability(
                                item.id,
                                item.is_available,
                                item.name
                              )
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {item.is_available !== false
                              ? "Mark Unavailable"
                              : "Mark Available"}
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Item
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Category</div>
                      <div className="text-gray-700">
                        {item.category?.name || "Uncategorized"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Price</div>
                      <div className="flex items-center gap-1 text-gray-900 font-medium">
                        <DollarSign className="w-3 h-3" />
                        {parseFloat(item.price).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <button
                        onClick={() =>
                          handleToggleAvailability(
                            item.id,
                            item.is_available,
                            item.name
                          )
                        }
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border transition-colors cursor-pointer ${
                          item.is_available !== false
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                            : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            item.is_available !== false
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        {item.is_available !== false
                          ? "Available"
                          : "Unavailable"}
                      </button>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Prep Time
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        {item.prep_time || "-"}
                      </div>
                    </div>
                  </div>

                  {/* Tag */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {item.popular ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <Star className="text-yellow-600 w-3 h-3 mr-1" />
                        Special Item
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                        <Tag className="w-3 h-3 mr-1" />
                        Regular Item
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Utensils className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm mb-2">
              {searchTerm || categoryFilter || statusFilter || tagFilter
                ? "No menu items match your filters."
                : "No menu items found."}
            </p>
            <p className="text-gray-400 text-xs mb-4">
              {searchTerm || categoryFilter || statusFilter || tagFilter
                ? "Try adjusting your filters or search term."
                : "Create your first menu item to get started."}
            </p>
            <button className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add your first menu item
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {modalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedImage.name}
              </h3>
              <button
                onClick={closeImageModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItems;
