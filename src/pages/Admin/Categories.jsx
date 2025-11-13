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
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoriesApi.deleteCategory(categoryId);
        setToastMessage("Category deleted successfully");
        setShowToast(true);
        loadCategories(); // Refresh the list
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
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading categories...</span>
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

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Categories Management
        </h1>
        <p className="text-gray-600">Manage your menu categories</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        {/* Header with Add Button and Item Count */}
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              All Categories
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredCategories.length} categor
              {filteredCategories.length !== 1 ? "ies" : "y"} found
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadCategories}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm shadow-sm hover:shadow transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <Link
              to="/admin/categories/add"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm shadow-sm hover:shadow transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Category</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by category name, description..."
                className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={clearFilters}
                className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="p-4">
          {filteredCategories.length > 0 ? (
            <div className="categories-table overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 hidden sm:table-header-group">
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
                      className="category-item hover:bg-gray-50 transition-colors duration-150 sm:table-row block border-b sm:border-none p-3 sm:p-0"
                    >
                      {/* ID - Using numeric index + 1 */}
                      <td className="px-4 py-3 text-gray-500 text-sm sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          ID
                        </div>
                        #{index + 1}
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3 text-gray-900 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Name
                        </div>
                        <div className="font-medium break-words">
                          {category.name || "Unnamed Category"}
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3 text-gray-700 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Description
                        </div>
                        <div className="break-words line-clamp-2 text-sm">
                          {category.description || "No description"}
                        </div>
                      </td>

                      {/* Menu Items */}
                      <td className="px-4 py-3 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
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
                      </td>

                      {/* Created */}
                      <td className="px-4 py-3 text-gray-500 text-xs sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Created
                        </div>
                        {formatDate(category.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Actions
                        </div>
                        <div className="flex space-x-3">
                          {/* View Details */}
                          <Link
                            to={`/admin/categories/${category.id}`}
                            className="text-green-600 hover:text-green-800 transition-colors duration-200"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          {/* Edit */}
                          <Link
                            to={`/admin/categories/${category.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          {/* Delete */}
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
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Tags className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm sm:text-base mb-2">
                {categories.length === 0
                  ? "No categories found."
                  : "No categories match your search."}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                {searchTerm
                  ? "Try adjusting your search term."
                  : "Create your first category to get started."}
              </p>
              <Link
                to="/admin/categories/add"
                className="inline-flex items-center text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add your first category
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Debug panel - remove in production */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
        <details>
          <summary className="cursor-pointer font-semibold">
            Debug Information
          </summary>
          <div className="mt-2">
            <p>
              <strong>Total categories:</strong> {categories.length}
            </p>
            <p>
              <strong>Filtered categories:</strong> {filteredCategories.length}
            </p>
            <p>
              <strong>Search term:</strong> "{searchTerm}"
            </p>
            <p>
              <strong>Sample category data:</strong>
            </p>
            <pre className="mt-1 text-xs">
              {categories.length > 0
                ? JSON.stringify(categories[0], null, 2)
                : "No categories"}
            </pre>
          </div>
        </details>
      </div>
    </>
  );
};

export default Categories;
