import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Tags,
  X,
  RefreshCw,
  MoreVertical,
  Calendar,
  FileText,
  Hash,
} from "lucide-react";
import { categoriesApi } from "../../services/categoriesApi";
import Toast from "../../components/ui/Toast/Toast";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);

  // Load categories from API
  const loadCategories = async () => {
    setLoading(true);
    try {
      const categoriesData = await categoriesApi.getCategories();
      console.log("Raw categories data:", categoriesData); // Debug log

      // Handle both array and object with results property
      let categoriesList = [];

      if (Array.isArray(categoriesData)) {
        categoriesList = categoriesData;
      } else if (categoriesData.results) {
        categoriesList = categoriesData.results;
      } else if (categoriesData) {
        categoriesList = [categoriesData];
      }

      console.log("Processed categories:", categoriesList);
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error loading categories:", error);
      setToastMessage("Error loading categories. Please try again.");
      setShowToast(true);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Filter categories based on search
  useEffect(() => {
    if (!categories || categories.length === 0) {
      setFilteredCategories([]);
      return;
    }

    let filtered = categories.filter((category) => {
      const matchesSearch =
        searchTerm === "" ||
        (category.name &&
          category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category.description &&
          category.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      return matchesSearch;
    });

    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const clearFilters = () => {
    setSearchTerm("");
    setMobileMenuOpen(null);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoriesApi.deleteCategory(categoryId);
        setToastMessage("Category deleted successfully");
        setShowToast(true);
        loadCategories(); // Refresh the list
        setMobileMenuOpen(null);
      } catch (error) {
        console.error("Error deleting category:", error);
        setToastMessage("Error deleting category");
        setShowToast(true);
      }
    }
  };

  // Get item count - handle different field names
  const getItemCount = (category) => {
    return (
      category.item_count ||
      category.items_count ||
      category.menu_items_count ||
      0
    );
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-gray-600 text-sm">
            Loading categories...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />

      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Categories Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your menu categories
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header with Add Button and Item Count */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  All Categories
                </h2>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full sm:text-sm">
                  {filteredCategories.length} categor
                  {filteredCategories.length !== 1 ? "ies" : "y"}
                </span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={loadCategories}
                  className="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
                <Link
                  to="/admin/categories/add"
                  className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sm:hidden">Add</span>
                  <span className="hidden sm:inline">Add New Category</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search categories..."
                  className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="sm:w-auto w-full border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Categories Content */}
          <div className="p-4">
            {filteredCategories.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Menu Items
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCategories.map((category, index) => (
                        <tr
                          key={category.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-4 py-3 text-gray-500 text-sm">
                            #{index + 1}
                          </td>
                          <td className="px-4 py-3 text-gray-900">
                            <div className="font-medium">
                              {category.name || "Unnamed Category"}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            <div className="break-words line-clamp-2">
                              {category.description || "No description"}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${
                                getItemCount(category) > 0
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              }`}
                            >
                              {getItemCount(category)} item
                              {getItemCount(category) !== 1 ? "s" : ""}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {formatDate(category.created_at)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-3">
                              <Link
                                to={`/admin/categories/${category.id}`}
                                className="text-green-600 hover:text-green-800 transition-colors duration-200"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                to={`/admin/categories/${category.id}/edit`}
                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(category.id)}
                                className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-3">
                  {filteredCategories.map((category, index) => (
                    <div
                      key={category.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              #{index + 1}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 text-base">
                            {category.name || "Unnamed Category"}
                          </h3>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setMobileMenuOpen(
                                mobileMenuOpen === category.id
                                  ? null
                                  : category.id
                              )
                            }
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {mobileMenuOpen === category.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              <Link
                                to={`/admin/categories/${category.id}`}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(null)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Link>
                              <Link
                                to={`/admin/categories/${category.id}/edit`}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(null)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Category
                              </Link>
                              <button
                                onClick={() => handleDelete(category.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Category
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="space-y-2">
                        {/* Description */}
                        {category.description && (
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-600 text-sm flex-1">
                              {category.description}
                            </p>
                          </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Menu Items
                            </div>
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${
                                getItemCount(category) > 0
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              }`}
                            >
                              {getItemCount(category)} item
                              {getItemCount(category) !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Created
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-700">
                              <Calendar className="h-3 w-3" />
                              {formatDate(category.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Tags className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-2">
                  {categories.length === 0
                    ? "No categories found."
                    : "No categories match your search."}
                </p>
                <p className="text-gray-400 text-xs mb-4">
                  {searchTerm
                    ? "Try adjusting your search term."
                    : "Create your first category to get started."}
                </p>
                <Link
                  to="/admin/categories/add"
                  className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first category
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
