import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonialsApi } from "../../../services/testimonialsApi";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback testimonials data
  const fallbackTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Food Critic",
      rating: 5,
      content:
        "KULAN RESTAURANT never disappoints! The steak is always perfectly cooked and the service is exceptional.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Regular Customer",
      rating: 5,
      content:
        "I've been coming to KULAN for years. The quality and consistency are remarkable. My favorite restaurant in town!",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Food Blogger",
      rating: 5,
      content:
        "The ambiance and culinary experience at KULAN are unmatched. Every dish tells a story of excellence!",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3",
    },
  ];

  // Fetch ALL testimonials from API with fallback
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        setUsingFallback(false);

        console.log("Fetching ALL testimonials from API...");
        const response = await testimonialsApi.getAllTestimonials();

        // Handle both paginated and non-paginated responses
        const testimonialsData = response.results || response;

        if (testimonialsData && testimonialsData.length > 0) {
          console.log(
            `Loaded ${testimonialsData.length} testimonials from API`
          );
          setTestimonials(testimonialsData);
        } else {
          console.log("No testimonials from API, using fallback data");
          setTestimonials(fallbackTestimonials);
          setUsingFallback(true);
        }
      } catch (err) {
        console.error(
          "Error fetching testimonials from API, using fallback:",
          err
        );
        setTestimonials(fallbackTestimonials);
        setUsingFallback(true);
        setError("Connected to fallback data - API unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Navigation functions
  const nextTestimonials = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.ceil(testimonials.length / 2) - 1;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  const prevTestimonials = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.ceil(testimonials.length / 2) - 1;
      return prevIndex <= 0 ? maxIndex : prevIndex - 1;
    });
  };

  // Get current testimonials to display (2 at a time)
  const getCurrentTestimonials = () => {
    const startIndex = currentIndex * 2;
    return testimonials.slice(startIndex, startIndex + 2);
  };

  // Get total number of pages
  const totalPages = Math.ceil(testimonials.length / 2);

  if (loading) {
    return (
      <section className="py-20 bg-primary text-white">
        <div className="container-custom section-padding">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="mt-4 text-primary-100">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-primary text-white">
      <div className="container-custom section-padding">
        {/* API Status Indicator */}
        {usingFallback && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Using demo data - Backend connection unavailable
            </div>
          </div>
        )}

        {error && !usingFallback && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              {error}
            </div>
          </div>
        )}

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            What Our Guests Say
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our valued customers
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center">
            <p className="text-primary-100 text-lg">
              No testimonials available at the moment.
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Navigation and Testimonials Container */}
            <div className="flex items-center justify-center space-x-4">
              {/* Left Arrow */}
              <button
                onClick={prevTestimonials}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Testimonials Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {getCurrentTestimonials().map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 transition-all duration-500 hover:bg-white/15"
                    >
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-lg mb-6 italic">
                        "{testimonial.content || testimonial.text}"
                      </p>
                      <div className="flex items-center space-x-4">
                        <img
                          src={
                            testimonial.avatar ||
                            testimonial.avatar_url ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3"
                          }
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3";
                          }}
                        />
                        <div>
                          <div className="font-semibold">
                            {testimonial.name}
                          </div>
                          <div className="text-primary-200 text-sm">
                            {testimonial.role ||
                              testimonial.category ||
                              "Customer"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Arrow */}
              <button
                onClick={nextTestimonials}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Next testimonials"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Page Indicators */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 mt-8">
                {/* Page Dots */}
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "bg-white scale-125"
                          : "bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Go to page ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Page Counter */}
                <div className="text-primary-200 text-sm ml-4">
                  {currentIndex + 1} / {totalPages}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
