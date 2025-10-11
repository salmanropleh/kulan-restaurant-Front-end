import React, { useState } from "react";
import { X, ZoomIn } from "lucide-react";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3",
      title: "Restaurant Ambiance",
      category: "interior",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3",
      title: "Nyama Choma Platter",
      category: "food",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
      title: "Traditional Breakfast",
      category: "food",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3",
      title: "Bariis Iskukaris",
      category: "food",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3",
      title: "Dining Area",
      category: "interior",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3",
      title: "Signature Grilled Steak",
      category: "food",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?ixlib=rb-4.0.3",
      title: "Samaki Wa Kupaka",
      category: "food",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1563379091339-03246963d96c?ixlib=rb-4.0.3",
      title: "Pilau Feast",
      category: "food",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3",
      title: "Somali Shaah Service",
      category: "experience",
    },
  ];

  const categories = [
    { id: "all", name: "All" },
    { id: "food", name: "Food" },
    { id: "interior", name: "Interior" },
    { id: "experience", name: "Experience" },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredImages =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-20">
        <div className="container-custom section-padding text-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg">
                    {image.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
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
              src={selectedImage.src}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-white text-center mt-4">
              <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
