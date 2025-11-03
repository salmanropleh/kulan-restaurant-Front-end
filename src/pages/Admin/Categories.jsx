import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Edit, Trash2, Search, Tags, X } from "lucide-react";

// Mock data - replace with actual API calls
const mockCategories = [
  {
    id: 1,
    name: "Breakfast",
    description: "Morning meals and breakfast specials",
    item_count: 8,
    created_at: "2024-01-15",
  },
  {
    id: 2,
    name: "Lunch",
    description: "Midday meals and lunch combos",
    item_count: 12,
    created_at: "2024-01-10",
  },
  {
    id: 3,
    name: "Dinner",
    description: "Evening meals and dinner specials",
    item_count: 15,
    created_at: "2024-01-05",
  },
  {
    id: 4,
    name: "KULAN Specialties",
    description: "Our signature dishes and house specials",
    item_count: 6,
    created_at: "2024-01-20",
  },
];

const Categories = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [filteredCategories, setFilteredCategories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const categoryTypes = ["Breakfast", "Lunch", "Dinner", "KULAN Specialties"];

  // Filter categories based on search and filter
  useEffect(() => {
    let filtered = categories.filter((category) => {
      const matchesSearch =
        searchTerm === "" ||
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !categoryFilter || category.name === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    setFilteredCategories(filtered);
  }, [searchTerm, categoryFilter, categories]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
  };

  const handleDelete = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
  };

  return (
    // REMOVED DashboardLayout wrapper - we're already inside it
    <>
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
              <span id="item-count">{filteredCategories.length}</span>{" "}
              category/categories found
            </span>
          </div>
          <Link
            to="/admin/categories/add"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm shadow-sm hover:shadow transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Category</span>
          </Link>
        </div>

        {/* Filters & Search Bar */}
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

            {/* Filters and Clear Button - Right Aligned */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
              >
                <option value="">All Categories</option>
                {categoryTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
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
                  {filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="category-item hover:bg-gray-50 transition-colors duration-150 sm:table-row block border-b sm:border-none p-3 sm:p-0"
                    >
                      {/* ID */}
                      <td className="px-4 py-3 text-gray-500 text-sm sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          ID
                        </div>
                        #{category.id}
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3 text-gray-900 sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Name
                        </div>
                        <div className="font-medium break-words">
                          {category.name}
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
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          {category.item_count} items
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-4 py-3 text-gray-500 text-xs sm:table-cell block">
                        <div className="sm:hidden text-xs font-semibold text-gray-400 uppercase mb-1">
                          Created
                        </div>
                        {new Date(category.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
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
                No categories found.
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                {searchTerm || categoryFilter
                  ? "Try adjusting your filters."
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
    </>
  );
};

export default Categories;
