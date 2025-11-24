import React, { useState, useEffect } from "react";
import { X, ZoomIn, Database, Wifi } from "lucide-react";
import { galleryApi } from "../../services/galleryApi";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [apiImages, setApiImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fallback gallery images data organized by category
  const fallbackGalleryImages = {
    food: [
      {
        id: 101,
        image_url:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3",
        title: "Nyama Choma Platter",
        category: "food",
        description: "Traditional grilled meat platter",
        isFallback: true,
      },
      {
        id: 102,
        image_url:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
        title: "Traditional Breakfast",
        category: "food",
        description: "Hearty morning meal",
        isFallback: true,
      },
      {
        id: 103,
        image_url:
          "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3",
        title: "Bariis Iskukaris",
        category: "food",
        description: "Flavorful spiced rice",
        isFallback: true,
      },
      {
        id: 104,
        image_url:
          "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3",
        title: "Signature Grilled Steak",
        category: "food",
        description: "Premium cut steak",
        isFallback: true,
      },
    ],
    interior: [
      {
        id: 201,
        image_url:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3",
        title: "Dining Area",
        category: "interior",
        description: "Comfortable seating area",
        isFallback: true,
      },
      {
        id: 202,
        image_url:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3",
        title: "Restaurant Ambiance",
        category: "interior",
        description: "Our elegant dining space",
        isFallback: true,
      },
    ],
    experience: [
      {
        id: 301,
        image_url:
          "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3",
        title: "Somali Shaah Service",
        category: "experience",
        description: "Traditional tea ceremony",
        isFallback: true,
      },
      {
        id: 302,
        image_url:
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3",
        title: "Live Cooking Station",
        category: "experience",
        description: "Watch our chefs in action",
        isFallback: true,
      },
    ],
    events: [
      {
        id: 401,
        image_url:
          "https://images.unsplash.com/photo-1549451371-64aa98a6f660?ixlib=rb-4.0.3",
        title: "Private Dining Events",
        category: "events",
        description: "Exclusive private gatherings",
        isFallback: true,
      },
      {
        id: 402,
        image_url:
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3",
        title: "Cultural Evenings",
        category: "events",
        description: "Traditional music and dance",
        isFallback: true,
      },
    ],
    chef: [
      {
        id: 501,
        image_url:
          "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3",
        title: "Chef's Special Platter",
        category: "chef",
        description: "Daily special creations",
        isFallback: true,
      },
      {
        id: 502,
        image_url:
          "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3",
        title: "Gourmet Presentations",
        category: "chef",
        description: "Artistically crafted dishes",
        isFallback: true,
      },
    ],
  };

  const categories = [
    { id: "all", name: "All" },
    { id: "food", name: "Food" },
    { id: "interior", name: "Interior" },
    { id: "experience", name: "Experience" },
    { id: "events", name: "Events" },
    { id: "chef", name: "Chef Specials" },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  // Function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://localhost:8000${imageUrl}`;
  };

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        setError(null);
        setUsingFallback(false);

        console.log("Fetching gallery images from API...");
        const response = await galleryApi.getAllImages({ is_active: "true" });

        // Handle both paginated and non-paginated responses
        const images = response.results || response;

        if (images && images.length > 0) {
          console.log(`Loaded ${images.length} gallery images from API`);
          // Mark API images with isFallback: false
          const apiImagesWithFlag = images.map((img) => ({
            ...img,
            isFallback: false,
          }));
          setApiImages(apiImagesWithFlag);
        } else {
          console.log("No gallery images from API, using fallback data only");
          setApiImages([]);
          setUsingFallback(true);
        }
      } catch (err) {
        console.error(
          "Error fetching gallery images from API, using fallback only:",
          err
        );
        setApiImages([]);
        setUsingFallback(true);
        setError("API unavailable - Using demo data");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Function to combine API images with fallback images
  const getCombinedImages = () => {
    if (activeCategory === "all") {
      // For "All" category, show API images first, then fill missing categories with fallback
      const apiImagesByCategory = {};
      apiImages.forEach((img) => {
        if (!apiImagesByCategory[img.category]) {
          apiImagesByCategory[img.category] = [];
        }
        apiImagesByCategory[img.category].push(img);
      });

      // Combine: use API images where available, fallback where not
      const combined = [];
      categories
        .filter((cat) => cat.id !== "all")
        .forEach((category) => {
          const categoryId = category.id;
          if (
            apiImagesByCategory[categoryId] &&
            apiImagesByCategory[categoryId].length > 0
          ) {
            combined.push(...apiImagesByCategory[categoryId]);
          } else if (fallbackGalleryImages[categoryId]) {
            combined.push(...fallbackGalleryImages[categoryId]);
          }
        });
      return combined;
    } else {
      // For specific category, show API images first, then fallback if no API images
      const apiCategoryImages = apiImages.filter(
        (img) => img.category === activeCategory
      );
      if (apiCategoryImages.length > 0) {
        return apiCategoryImages;
      } else {
        return fallbackGalleryImages[activeCategory] || [];
      }
    }
  };

  const displayedImages = getCombinedImages();

  // Function to check if current category uses fallback data
  const isUsingFallbackForCategory = (category) => {
    if (category === "all") {
      return categories
        .filter((cat) => cat.id !== "all")
        .some(
          (cat) =>
            apiImages.filter((img) => img.category === cat.id).length === 0
        );
    }
    return apiImages.filter((img) => img.category === category).length === 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-20">
        <div className="container-custom section-padding text-center">
          {/* API Status Indicator */}
          {usingFallback && (
            <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              API unavailable - Showing demo data
            </div>
          )}

          {error && !usingFallback && (
            <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              {error}
            </div>
          )}

          {/* Category-specific fallback indicator */}
          {isUsingFallbackForCategory(activeCategory) && !usingFallback && (
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Showing demo data for this category
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Gallery
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Experience the sights, flavors, and atmosphere of KULAN
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-20">
        <div className="container-custom section-padding">
          {/* Category Filters */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                    activeCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-lg"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          {displayedImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No images found in this category.
              </p>
            </div>
          ) : (
            <>
              {/* Category Info */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {activeCategory === "all" ? "All Categories" : activeCategory}
                </h2>
                <p className="text-gray-600 mt-2">
                  {isUsingFallbackForCategory(activeCategory) && !usingFallback
                    ? "Demo content - Add real images in admin panel"
                    : `Showing ${displayedImages.length} images`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedImages.map((image, index) => {
                  const imageUrl = getImageUrl(image.image_url || image.image);
                  const isFallbackImage = image.isFallback;

                  return (
                    <div
                      key={`${image.id}-${index}`}
                      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={imageUrl}
                        alt={image.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-white font-semibold text-lg">
                          {image.title}
                        </h3>
                        {image.description && (
                          <p className="text-white text-sm opacity-90 mt-1">
                            {image.description}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded capitalize">
                            {image.category}
                          </span>
                          {/* Data Source Badge */}
                          <span
                            className={`flex items-center text-xs px-2 py-1 rounded ${
                              isFallbackImage
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {isFallbackImage ? (
                              <>
                                <Database className="h-3 w-3 mr-1" />
                                Demo
                              </>
                            ) : (
                              <>
                                <Wifi className="h-3 w-3 mr-1" />
                                Live
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-secondary transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={getImageUrl(selectedImage.image_url || selectedImage.image)}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3";
              }}
            />
            <div className="text-white text-center mt-4">
              <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-300 mt-2">
                  {selectedImage.description}
                </p>
              )}
              <div className="flex justify-center items-center space-x-4 mt-2">
                <span className="text-gray-300 text-sm capitalize">
                  Category: {selectedImage.category}
                </span>
                {/* Data Source Badge in Modal */}
                <span
                  className={`flex items-center text-xs px-2 py-1 rounded ${
                    selectedImage.isFallback
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedImage.isFallback ? (
                    <>
                      <Database className="h-3 w-3 mr-1" />
                      Demo Data
                    </>
                  ) : (
                    <>
                      <Wifi className="h-3 w-3 mr-1" />
                      Live API Data
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
