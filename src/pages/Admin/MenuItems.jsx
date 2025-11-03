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
} from "lucide-react";

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockMenuItems = [
      {
        id: 1,
        name: "KULAN Signature Platter",
        description:
          "Sampler of our best dishes: Barils, Hllib Ari, Sambusa, and Kachumbari",
        category: { name: "KULAN Specialties" },
        price: 45.99,
        is_available: true,
        is_special: true,
        prep_time: "40-50 min",
        image: "/api/placeholder/40/40",
      },
      {
        id: 2,
        name: "Sanaki Wa Kupaka",
        description: "Grilled fish in coconut curry sauce",
        category: { name: "Dinner" },
        price: 32.5,
        is_available: true,
        is_special: false,
        prep_time: "25-35 min",
        image: "/api/placeholder/40/40",
      },
      {
        id: 3,
        name: "Malawah Pancakes",
        description: "Thin, sweet pancakes served with honey and ghee",
        category: { name: "Breakfast" },
        price: 12.99,
        is_available: false,
        is_special: true,
        prep_time: "10-15 min",
        image: null,
      },
    ];
    setMenuItems(mockMenuItems);
    setFilteredItems(mockMenuItems);
  }, []);

  // Filter items
  useEffect(() => {
    let filtered = menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.category.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !categoryFilter || item.category.name === categoryFilter;
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "available" && item.is_available) ||
        (statusFilter === "unavailable" && !item.is_available);
      const matchesTag =
        !tagFilter ||
        (tagFilter === "special" && item.is_special) ||
        (tagFilter === "regular" && !item.is_special);

      return matchesSearch && matchesCategory && matchesStatus && matchesTag;
    });
    setFilteredItems(filtered);
  }, [searchTerm, categoryFilter, statusFilter, tagFilter, menuItems]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStatusFilter("");
    setTagFilter("");
  };

  const openImageModal = (imageUrl, itemName) => {
    setSelectedImage({ url: imageUrl, name: itemName });
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Menu Items
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Management section for menu items
        </p>
      </div>

      {/* Header with Add Button and Item Count */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div className="flex-1">
          {/* Item Count */}
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}{" "}
            found
          </span>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          {/* Add New Menu Item Button */}
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm shadow-sm hover:shadow transition-colors duration-200">
            <Plus className="w-4 h-4" />
            <span>Add New Menu Item</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by item name, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="KULAN Specialties">KULAN Specialties</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>

            {/* Tag Filter */}
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="">All Tags</option>
              <option value="special">Special</option>
              <option value="regular">Regular</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Table Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Menu Items
          </h2>
        </div>

        <div className="p-2 sm:p-3 md:p-4">
          {filteredItems.length > 0 ? (
            <div className="items-table overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 hidden sm:table-header-group">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tag
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prep Time
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="menu-item hover:bg-gray-50 transition-colors duration-150 sm:table-row block border-b sm:border-none p-3 sm:p-0"
                    >
                      {/* ID */}
                      <td className="px-3 py-2 text-gray-500 text-xs sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          ID
                        </div>
                        #{item.id}
                      </td>

                      {/* Image */}
                      <td className="px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Image
                        </div>
                        <div className="w-10 h-10 flex-shrink-0">
                          {item.image ? (
                            <button
                              onClick={() =>
                                openImageModal(item.image, item.name)
                              }
                              className="w-full h-full focus:outline-none"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                              />
                            </button>
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <Utensils className="text-gray-400 w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Item */}
                      <td className="px-3 py-2 text-gray-900 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Item
                        </div>
                        <div className="font-medium break-words">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {item.description.length > 50
                              ? `${item.description.substring(0, 50)}...`
                              : item.description}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-3 py-2 text-gray-700 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Category
                        </div>
                        <div className="break-words text-sm category-name">
                          {item.category.name}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Price
                        </div>
                        <span className="font-medium text-gray-900">
                          ${item.price}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Status
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${
                            item.is_available
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              item.is_available ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></span>
                          {item.is_available ? "Available" : "Unavailable"}
                        </span>
                      </td>

                      {/* Tag */}
                      <td className="px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Tag
                        </div>
                        {item.is_special ? (
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

                      {/* Prep Time */}
                      <td className="px-3 py-2 text-gray-600 text-xs sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Prep Time
                        </div>
                        {item.prep_time || "-"}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-2 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Actions
                        </div>
                        <div className="flex space-x-3">
                          <button className="text-green-600 hover:text-green-800 transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 transition-colors duration-200">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Utensils className="mx-auto text-3xl sm:text-4xl text-gray-300 mb-3 sm:mb-4" />
              <p className="text-gray-500 text-sm sm:text-base mb-2">
                No menu items found.
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                Create your first menu item to get started.
              </p>
              <button className="inline-flex items-center text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium transition-colors duration-200">
                <Plus className="w-3 h-3 mr-2" />
                Add your first menu item
              </button>
            </div>
          )}
        </div>
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
                className="text-gray-500 hover:text-gray-700 text-xl"
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
