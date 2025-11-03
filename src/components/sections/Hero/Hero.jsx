import React from "react";
import { Link } from "react-router-dom";
import { Play, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-black to-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3")',
        }}
      ></div>

      <div className="relative container-custom section-padding text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Rating Badge */}
          <div className="inline-flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">
              Rated 4.8/5 • 300+ Reviews
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            Welcome to
            <span className="block text-secondary">KULAN</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience exquisite flavors and exceptional service in the heart of
            the city. Where every meal tells a story.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/reservations"
              className="bg-primary hover:bg-accent text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Reserve Your Table
            </Link>
            <button className="flex items-center space-x-2 text-white hover:text-secondary transition-colors group">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-secondary transition-colors">
                <Play className="h-6 w-6" />
              </div>
              <span className="text-lg font-semibold">Watch Our Story</span>
            </button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary mb-1">14+</div>
              <div className="text-gray-300">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary mb-1">40+</div>
              <div className="text-gray-300">Signature Dishes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary mb-1">100%</div>
              <div className="text-gray-300">Fresh Ingredients</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
