import React, { useState, useEffect } from "react";
import {
  Image,
  Plus,
  Trash2,
  Edit,
  Upload,
  X,
  Save,
  AlertCircle,
  RefreshCw,
  Search,
  MoreVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { galleryApi } from "../../services/galleryApi";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // New status filter

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "food",
    is_featured: false,
    is_active: true,
    order: 0,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Category options matching backend
  const categoryOptions = [
    { value: "food", label: "Food" },
    { value: "interior", label: "Interior" },
    { value: "experience", label: "Experience" },
    { value: "events", label: "Events" },
    { value: "chef", label: "Chef Specials" },
  ];

  // Status options
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Fetch gallery images from API
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");
      const response = await galleryApi.getAllImages();
      const imagesData = response.results || response;
      setImages(imagesData);
      setFilteredImages(imagesData);
    } catch (err) {
      console.error("Error fetching gallery images:", err);
      setError("Failed to load gallery images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Filter images
  useEffect(() => {
    let filtered = images.filter((image) => {
      const matchesSearch =
        image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !categoryFilter || image.category === categoryFilter;

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "active" && image.is_active) ||
        (statusFilter === "inactive" && !image.is_active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
    setFilteredImages(filtered);
  }, [searchTerm, categoryFilter, statusFilter, images]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);
      const token = localStorage.getItem("accessToken");

      if (editingImage) {
        // Update existing image
        await galleryApi.updateImage(editingImage.id, formData, token);
        setSuccess("Image updated successfully!");
      } else {
        // Upload new image
        await galleryApi.uploadImage(formData, token);
        setSuccess("Image uploaded successfully!");
      }

      setShowUploadForm(false);
      setEditingImage(null);
      resetForm();
      fetchImages();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving image:", err);
      setError("Failed to save image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "food",
      is_featured: false,
      is_active: true,
      order: 0,
      image: null,
    });
    setImagePreview(null);
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || "",
      category: image.category,
      is_featured: image.is_featured,
      is_active: image.is_active,
      order: image.order,
      image: null,
    });
    setImagePreview(getImageUrl(image.image_url || image.image));
    setShowUploadForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      await galleryApi.deleteImage(id, token);
      setSuccess("Image deleted successfully!");
      fetchImages();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image. Please try again.");
    }
  };

  // New function to toggle image active status
  const handleToggleActive = async (image) => {
    try {
      const token = localStorage.getItem("accessToken");
      const newStatus = !image.is_active;

      await galleryApi.updateImage(image.id, { is_active: newStatus }, token);
      setSuccess(
        `Image ${newStatus ? "activated" : "deactivated"} successfully!`
      );
      fetchImages();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating image status:", err);
      setError("Failed to update image status. Please try again.");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStatusFilter("");
  };

  // Function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://localhost:8000${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-gray-600 text-sm">
            Loading gallery images...
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
          Gallery Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your gallery images ({images.length} total)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with Refresh and Upload - UPDATED */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full sm:text-sm">
                {filteredImages.length} image
                {filteredImages.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={fetchImages}
                className="flex-1 sm:flex-none bg-primary hover:bg-accent text-white px-3 py-2 rounded text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Refresh</span>
              </button>

              <button
                onClick={() => setShowUploadForm(true)}
                className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span className="sm:hidden">Upload</span>
                <span className="hidden sm:inline">Upload Image</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded pl-10 pr-4 py-2 text-sm w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={clearFilters}
              className="border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded text-sm font-medium inline-flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Gallery Content */}
        <div className="p-4">
          {filteredImages.length > 0 ? (
            <>
              {/* Desktop Grid */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow ${
                        !image.is_active ? "opacity-60 border-red-200" : ""
                      }`}
                    >
                      <div className="relative aspect-w-16 aspect-h-9 bg-gray-200">
                        <img
                          src={getImageUrl(image.image_url || image.image)}
                          alt={image.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/300/200";
                          }}
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            onClick={() => handleToggleActive(image)}
                            className={`bg-white bg-opacity-80 p-1 rounded hover:bg-opacity-100 ${
                              image.is_active
                                ? "text-green-600 hover:text-green-800"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                            title={image.is_active ? "Deactivate" : "Activate"}
                          >
                            {image.is_active ? (
                              <Eye className="w-3 h-3" />
                            ) : (
                              <EyeOff className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(image)}
                            className="bg-white bg-opacity-80 p-1 rounded hover:bg-opacity-100 text-gray-700 hover:text-gray-900"
                            title="Edit"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(image.id)}
                            className="bg-white bg-opacity-80 p-1 rounded hover:bg-opacity-100 text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        {image.is_featured && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                              Featured
                            </span>
                          </div>
                        )}
                        {!image.is_active && (
                          <div className="absolute bottom-2 left-2">
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                              Inactive
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {image.title}
                        </h3>
                        {image.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {image.description}
                          </p>
                        )}
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded capitalize">
                            {image.category}
                          </span>
                          <span>Order: {image.order}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                          <span
                            className={
                              image.is_active
                                ? "text-green-600 font-medium"
                                : "text-red-600 font-medium"
                            }
                          >
                            {image.is_active ? "Active" : "Inactive"}
                          </span>
                          <span>
                            {new Date(image.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add New Card */}
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors flex flex-col items-center justify-center h-full min-h-64"
                  >
                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-gray-600">Add New Image</div>
                  </button>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
                      !image.is_active ? "opacity-60 border-red-200" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={getImageUrl(image.image_url || image.image)}
                          alt={image.title}
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/300/200";
                          }}
                        />
                        {!image.is_active && (
                          <div className="mt-1">
                            <span className="bg-red-500 text-white px-1 py-0.5 rounded text-xs">
                              Inactive
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              {image.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-gray-100 px-2 py-1 rounded text-xs capitalize">
                                {image.category}
                              </span>
                              {image.is_featured && (
                                <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Mobile Menu */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setMobileMenuOpen(
                                  mobileMenuOpen === image.id ? null : image.id
                                )
                              }
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {mobileMenuOpen === image.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button
                                  onClick={() => handleToggleActive(image)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  {image.is_active ? (
                                    <>
                                      <EyeOff className="w-4 h-4 mr-2" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Activate
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleEdit(image)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Image
                                </button>
                                <button
                                  onClick={() => handleDelete(image.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Image
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {image.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {image.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Order
                            </div>
                            <div>{image.order}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Status
                            </div>
                            <div
                              className={
                                image.is_active
                                  ? "text-green-600 font-medium"
                                  : "text-red-600 font-medium"
                              }
                            >
                              {image.is_active ? "Active" : "Inactive"}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mt-2">
                          Added:{" "}
                          {new Date(image.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add New Card - Mobile */}
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors flex flex-col items-center justify-center"
                >
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-600">Add New Image</div>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Image className="mx-auto w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm mb-2">
                {images.length === 0
                  ? "No gallery images found"
                  : "No images match your filters"}
              </p>
              <p className="text-gray-400 text-xs">
                {images.length === 0
                  ? "Upload your first image to get started"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload/Edit Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {editingImage ? "Edit Image" : "Upload New Image"}
                </h2>
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    setEditingImage(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image {!editingImage && "*"}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover mx-auto rounded"
                        />
                        <p className="text-sm text-gray-600">Image selected</p>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, image: null }));
                            setImagePreview(null);
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
                          Click to upload image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          required={!editingImage}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="bg-orange-500 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-orange-600"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
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

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  />
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Featured
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Active</label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadForm(false);
                      setEditingImage(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-600 disabled:opacity-50 text-sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {uploading
                      ? "Saving..."
                      : editingImage
                      ? "Update Image"
                      : "Upload Image"}
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

export default Gallery;
