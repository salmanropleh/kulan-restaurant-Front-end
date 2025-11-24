// Front-End/src/pages/Admin/Testimonials.jsx
import React, { useState, useEffect } from "react";
import {
  Star,
  Plus,
  Edit,
  Trash2,
  Search,
  User,
  X,
  Upload,
  AlertCircle,
  Save,
  RefreshCw,
  MoreVertical,
} from "lucide-react";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);

  // Form state - updated to match Django model
  const [formData, setFormData] = useState({
    name: "",
    category: "customer",
    content: "",
    rating: 5,
    avatar: null,
    is_featured: false,
    is_active: true,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);

  // Category options from Django model
  const categoryOptions = [
    { value: "customer", label: "Customer" },
    { value: "critic", label: "Food Critic" },
    { value: "celebrity", label: "Celebrity" },
  ];

  // Fetch testimonials from API
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(
        "http://localhost:8000/api/testimonials/testimonials/",
        { headers }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch testimonials: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log("API Response:", apiResponse); // Debug log

      // Extract the testimonials array from the paginated response
      const testimonialsData = apiResponse.results || apiResponse;
      setTestimonials(testimonialsData);
      setFilteredTestimonials(testimonialsData);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError("Failed to load testimonials. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Filter testimonials
  useEffect(() => {
    let filtered = testimonials.filter(
      (testimonial) =>
        testimonial.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTestimonials(filtered);
  }, [searchTerm, testimonials]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTestimonials();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStarClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.avatar) {
      setError("Avatar image is required");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("category", formData.category);
      submitData.append("content", formData.content);
      submitData.append("rating", formData.rating.toString());
      submitData.append("is_featured", formData.is_featured.toString());
      submitData.append("is_active", formData.is_active.toString());
      submitData.append("avatar", formData.avatar);

      const response = await fetch(
        "http://localhost:8000/api/testimonials/testimonials/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: submitData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create testimonial: ${response.status}`);
      }

      setSuccess("Testimonial added successfully!");
      setShowAddForm(false);
      resetForm();
      fetchTestimonials(); // Refresh the list

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error creating testimonial:", err);
      setError("Failed to add testimonial. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "customer",
      content: "",
      rating: 5,
      avatar: null,
      is_featured: false,
      is_active: true,
    });
    setAvatarPreview(null);
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(
        `http://localhost:8000/api/testimonials/testimonials/${id}/`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete testimonial: ${response.status}`);
      }

      setSuccess("Testimonial deleted successfully!");
      fetchTestimonials(); // Refresh the list
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      setError("Failed to delete testimonial. Please try again.");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const clearFilters = () => {
    setSearchTerm("");
  };

  // Function to get full image URL
  const getImageUrl = (avatarUrl) => {
    if (!avatarUrl) return null;
    // If it's already a full URL, return as is
    if (avatarUrl.startsWith("http")) return avatarUrl;
    // Otherwise, prepend the base URL
    return `http://localhost:8000${avatarUrl}`;
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-gray-600 text-sm">
            Loading testimonials...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        </div>
      )}

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
          Testimonials Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage customer testimonials ({testimonials.length} total)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with Refresh and Add */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full sm:text-sm">
                {filteredTestimonials.length} testimonial
                {filteredTestimonials.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex-1 sm:flex-none border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span> {/* Remove the sm:hidden class */}
              </button>

              <button
                onClick={() => setShowAddForm(true)}
                className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">Add Testimonial</span>
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
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded pl-10 pr-4 py-2 text-sm w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>
            {searchTerm && (
              <button
                onClick={clearFilters}
                className="border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Testimonials Content */}
        <div className="p-4">
          {filteredTestimonials.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3 text-center">Rating</th>
                      <th className="px-4 py-3">Message</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTestimonials.map((testimonial) => {
                      const fullAvatarUrl = getImageUrl(testimonial.avatar);

                      return (
                        <tr key={testimonial.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                {fullAvatarUrl ? (
                                  <img
                                    src={fullAvatarUrl}
                                    alt={testimonial.name}
                                    className="h-10 w-10 object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display =
                                        "flex";
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ${
                                    fullAvatarUrl ? "hidden" : "flex"
                                  }`}
                                >
                                  <User className="h-5 w-5 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {testimonial.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {testimonial.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center">
                              {renderStars(testimonial.rating)}
                              <span className="ml-2 text-sm text-gray-500">
                                ({testimonial.rating})
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900 max-w-xs line-clamp-2">
                              {testimonial.content}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex flex-col space-y-1 items-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  testimonial.is_featured
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {testimonial.is_featured
                                  ? "Featured"
                                  : "Regular"}
                              </span>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  testimonial.is_active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {testimonial.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <button className="text-orange-600 hover:text-orange-900">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  deleteTestimonial(testimonial.id)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {filteredTestimonials.map((testimonial) => {
                  const fullAvatarUrl = getImageUrl(testimonial.avatar);

                  return (
                    <div
                      key={testimonial.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {fullAvatarUrl ? (
                              <img
                                src={fullAvatarUrl}
                                alt={testimonial.name}
                                className="h-12 w-12 object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={`h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center ${
                                fullAvatarUrl ? "hidden" : "flex"
                              }`}
                            >
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">
                              {testimonial.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs capitalize">
                                {testimonial.category}
                              </span>
                              <div className="flex items-center">
                                {renderStars(testimonial.rating)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Menu */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setMobileMenuOpen(
                                mobileMenuOpen === testimonial.id
                                  ? null
                                  : testimonial.id
                              )
                            }
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {mobileMenuOpen === testimonial.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Testimonial
                              </button>
                              <button
                                onClick={() =>
                                  deleteTestimonial(testimonial.id)
                                }
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Testimonial
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Testimonial Content */}
                      <div className="text-sm text-gray-700 mb-3 line-clamp-3">
                        {testimonial.content}
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              testimonial.is_featured
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {testimonial.is_featured ? "Featured" : "Regular"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              testimonial.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {testimonial.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {testimonial.rating}/5
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <User className="mx-auto w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm mb-2">
                {testimonials.length === 0
                  ? "No testimonials found"
                  : "No testimonials match your search"}
              </p>
              <p className="text-gray-400 text-xs">
                {testimonials.length === 0
                  ? "Add your first testimonial to get started"
                  : "Try adjusting your search terms"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Testimonial Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Add Testimonial
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    placeholder="Enter testimonial content"
                  />
                </div>

                {/* Media & Rating */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avatar *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {avatarPreview ? (
                        <div className="space-y-2">
                          <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="w-20 h-20 rounded-full mx-auto object-cover"
                          />
                          <p className="text-sm text-gray-600">
                            Image selected
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                avatar: null,
                              }));
                              setAvatarPreview(null);
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            Click to upload avatar
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            required
                            className="hidden"
                            id="avatar-upload"
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="bg-orange-500 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-orange-600"
                          >
                            Choose File
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= formData.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        ({formData.rating}/5)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Is featured
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Is active
                    </span>
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-600 text-sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add Testimonial
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
