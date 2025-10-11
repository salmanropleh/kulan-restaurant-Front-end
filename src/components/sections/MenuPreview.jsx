import React from "react";
import { Link } from "react-router-dom";
import { featuredItems } from "../../data/menuData";

const MenuPreview = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            KULAN Specialties
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Taste our most beloved Somali and Kenyan dishes, crafted with
            authentic recipes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {item.popular && (
                  <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-display font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <span className="text-2xl font-bold text-primary">
                    ${item.price}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/menu"
            className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-full hover:bg-accent transition-colors duration-200 font-semibold text-lg group"
          >
            <span>View Full Menu</span>
            <div className="group-hover:translate-x-1 transition-transform">
              →
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
